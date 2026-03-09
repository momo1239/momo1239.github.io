---
title: "Abusing Windows Kernel Driver to Kill PPL-Protected Processes"
date: 2026-03-09 10:00:00 +0000
categories: [vuln-research]
tags: [vuln-research, BYOVD]
layout: post
---


# Introduction
I've been playing around with vibe reversing using Claude and an IDA MCP Server and decided to look into exploring kernel drivers for BYOVD attacks. I found an anti-cheat driver signed and shipped with a game. Kernel drivers run with the highest privileges on your machine. Anti-cheat drivers use this power to protect games from cheaters, but when they’re poorly written, attackers can abuse that same power against you. Communication between the user-mode client and the driver occurs through DeviceIoControl requests sent to the device object. These requests contain structured input data that the driver interprets as commands. 

---

## Background

The driver exposes a device interface that allows a user-mode component to control its behavior through IOCTL requests. The driver operates as part of an anti-cheat system, where a privileged kernel component assists a companion user-mode client in enforcing process control and maintaining the integrity of the protected application environment. One supported command allows the user-mode component to specify a process identifier (PID), which the driver then uses to perform a process termination operation from kernel mode. 

Anti-cheat drivers require the ability to terminate processes often at the kernel level to immediately stop unauthorized software from interacting with, reading, or modifying game memory. Because modern cheats often operate with high privileges to hide from standard security software, anti-cheats must run at the same or higher level to detect and terminate these malicious applications. 

However, if the driver exposes this process termination capability through an IOCTL handler accessible from user mode it can allow malicious actors to abuse this outside of the intended anti-cheat client.

---

## What Is PPL?

Protected Process Light is a Windows security feature introduced in Windows 8.1. Processes marked as PPL (such as antivirus engines, LSASS, and certain system processes) cannot be opened with full access rights from user-mode code — even by administrators. Any attempt to call `OpenProcess` or `TerminateProcess` against a PPL-protected process from user-mode will fail with `ACCESS_DENIED`.

The key constraint: PPL is enforced at the **user-mode boundary**. Kernel-mode code operating with `OBJ_KERNEL_HANDLE` bypasses this check entirely.

---

## IOCTL Enumeration

All IOCTLs use `FILE_ANY_ACCESS` (access bits 14–15 = `0b00`), meaning the device handle requires no special privilege.

The driver exposes 10 IOCTLs codes but we are interested in IOCTL `0x22201c`

| IOCTL | In | Out | Action |
|---|---|---|---|
| `0x222000` | 0 | 0 | Re-register `Ps*` kernel callbacks |
| `0x222004` | 0 | 0 | **Unregister all kernel callbacks** |
| `0x222008` | 0 | 1036 | Dequeue process entry (info leak) |
| `0x222018` | 1036 | 0 | Enqueue fake entry, add name to protected list |
| **`0x22201C`** | **1036** | **0** | **Kill process by PID via `ZwTerminateProcess`** |
| `0x222020` | 1036 | 0 | Enqueue fake entry, flag=0 |
| `0x222024` | 8 | 0 | Set timeout + re-register callbacks |
| `0x222040` | 0 | 4 | Returns version DWORD (`3`) |
| `0x222044` | 8 | 0 | Register user event object |
| `0x222048` | 0 | 0 | Dereference registered event |



---

## Vulnerability - Arbitrary Process Termination 

IOCTL `0x22201C` terminates any process on the system:

### Call Chain

```
DeviceIoControl
  └─ IRP_MJ_DEVICE_CONTROL_Handler (0x140001540)   [no privilege check]
       └─ IOCTL_0x22201C_TerminateFromList (0x14000264C)
            ├─ reads target PID from first 4 bytes of 1036-byte input buffer
            ├─ CRC32(name) → RemovePIDFromProtectedList
            └─ KillProcessByPID (0x140002848)
                 ├─ ZwOpenProcess(pid, PROCESS_ALL_ACCESS, OBJ_KERNEL_HANDLE)
                 └─ ZwTerminateProcess(handle, 0)
```


The IOCTL dispatch routine accepts requests through IRP_MJ_DEVICE_CONTROL without performing any privilege validation. When the handler receives IOCTL `0x22201C`, it forwards the supplied 1036-byte input buffer to an internal termination routine. The user-controlled buffer places the target PID in the first 4 bytes, which the driver extracts and uses as the process identifier. The routine also performs a CRC32-based lookup/removal against the driver’s internal protected process list before invoking KillProcessByPID.

KillProcessByPID then opens the target process with ZwOpenProcess using PROCESS_ALL_ACCESS and OBJ_KERNEL_HANDLE, and immediately calls ZwTerminateProcess on the returned handle. As a result, any user able to obtain a handle to the device and issue IOCTL `0x22201C` can cause the driver to terminate an arbitrary process by supplying its PID in the input buffer.

Antivirus, EDR agents, system services, even PPL (Protected Process Light) processes are not safe. ZwTerminateProcess from kernel mode bypasses PPL protection entirely, which means even processes that Windows itself is supposed to shield from tampering are killable through this driver.

Decompiled `KillProcessByPID`:

```c
__int64 __fastcall KillProcessByPID(unsigned int pid)
{
    HANDLE ProcessHandle = 0;
    OBJECT_ATTRIBUTES oa;
    CLIENT_ID cid;

    oa.Length = 48;
    oa.Attributes = 514;     // OBJ_KERNEL_HANDLE | OBJ_INHERIT
    oa.RootDirectory = 0;
    oa.ObjectName = 0;
    cid.UniqueProcess = (HANDLE)pid;
    cid.UniqueThread = 0;

    NTSTATUS status = ZwOpenProcess(&ProcessHandle, 0x1FFFFF,  // PROCESS_ALL_ACCESS
                                    &oa, &cid);
    if (NT_SUCCESS(status) && ProcessHandle) {
        status = ZwTerminateProcess(ProcessHandle, 0);
        ZwClose(ProcessHandle);
    }
    return status;
}
```


### Input Buffer Layout

The IOCTL expects exactly **1036 bytes** with the PID in the first 4 bytes:

```c
#pragma pack(push, 1)
typedef struct {
    DWORD pid;        // offset 0  — target PID, directly passed to ZwOpenProcess
    WORD  _pad;       // offset 4
    CHAR  name[1030]; // offset 6  — CRC32'd as wide string for protected list removal
} WARSAW_KILL_INPUT;
#pragma pack(pop)
```


---

## Proof of Concept - Disable PPL Process

The PoC was created to demo against Windows Defender but this can be applied to any other AV/EDR. When the target PID belongs to `MsMpEng.exe`, the tool enters an infinite loop and re-kills the process every 700 ms. This is necessary because the Windows Service Control Manager (SCM) has a recovery action to restart the `WinDefend` service on failure (default delay: ~5 seconds). Each restart spawns a new `MsMpEng.exe` with a different PID — so the loop refreshes the PID each iteration.

![Windows Defender Process](/assets/img/driver/msmp.png)
![Disabling Defender 1](/assets/img/driver/msmpsave.png)
![Disabling Defender 2](/assets/img/driver/msmpsave2.png)


---


## References

- [ZeroMemoryEx/Blackout](https://github.com/ZeroMemoryEx/Blackout) 
- [Windows Internals: Protected Processes](https://learn.microsoft.com/en-us/windows/win32/procthread/protected-processes)
- [OBJ_KERNEL_HANDLE documentation](https://learn.microsoft.com/en-us/windows-hardware/drivers/kernel/object-handles)
- `ZwOpenProcess` / `ZwTerminateProcess` — Windows Driver Kit reference

---


