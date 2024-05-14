---
title: "Reverse Engineering Level 3 Writeup"
date: 2023-12-21
tags: ["exploit-dev", "reversing", "ctf"]
draft: false
---

# Reverse Engineering L3 Writeup
This is part of a course called Fundamentals of Software Exploitation designed to teach students about exploitation development and vulnerability research. There are various modules and at the end of the modules are three progression challenges. This is the final progression challenge for the Reverse Engineering module.

## Challenge Description
```
Challenge / Response

Wow, stealing acquiring software is hard work... 
This one communicates with a server of some kind and makes you submit a ton of valid request-response pairs.

This is a tricky one, but we think you're ready for it.
```

## Source Code
```c
// gcc -g -I ../includes -O0 02_challenge_3.c -o 02_challenge_3

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>


#include "02_challenge_3.h"
#include "wargames.h"

void main() 
{
    init_wargame();

    char challenge[64] = {};
    char response[64] = {};
	int status = 0;

    printf("------------------------------------------------------------\n");
    printf("--[ Reverse Engineering Level #3 - Challenge / Response     \n");
    printf("------------------------------------------------------------\n");

    for(int i = 0; i < 200; i++) {
        // clear the chal and resp buffers
        memset(challenge, 0, 64);
        memset(response, 0, 64);

		// generate and print a challenge string
		generate_random_challenge(challenge);
    	printf("CHALLENGE: %s\n", challenge);

		// prompt the user for their reesponse
		printf(" RESPONSE: ");
		fgets(response, sizeof(response), stdin);
		response[strcspn(response, "\n")] = 0;     // strip newline

        // check the user response for correctness
		status = valid_response(challenge, response);
        if(status)
		{
            printf("INCORRECT RESPONSE! (ERROR CODE %u)\n", status);
            exit(1);
        }
    }

    printf("------------------------------------------------------------\n");
    printf("Authenticated!\n");
    system("cat flag");
    
}

```

## Part 1: Basic Analysis
So when we enter the challenge, we're provided with C Source Code. If we take a quick look at the code, we can see that it's pretty simple. 

The binary calls a function to generate a challenge and then prompts the user to input a response. Then the code will check if the response is valid by calling a valid_response function and storing the result in a variable.

We can start by taking a look at the disassembled "valid_response" function. 

```assembly
0x400b9e:  push    rbp
0x400b9f:  mov     rbp, rsp
0x400ba2:  sub     rsp, 0x70
0x400ba6:  mov     qword [rbp-0x68], rdi
0x400baa:  mov     qword [rbp-0x70], rsi
0x400bae:  mov     rax, qword [fs:0x28]
0x400bb7:  mov     qword [rbp-0x8], rax
0x400bbb:  xor     eax, eax
0x400bbd:  mov     dword [rbp-0x36], 0x0
0x400bc4:  mov     word [rbp-0x32], 0x0
0x400bca:  mov     qword [rbp-0x30], 0x0
0x400bd2:  mov     qword [rbp-0x28], 0x0
0x400bda:  mov     qword [rbp-0x20], 0x0
0x400be2:  mov     qword [rbp-0x18], 0x0
0x400bea:  mov     dword [rbp-0x58], 0x0
0x400bf1:  mov     dword [rbp-0x44], 0x0
0x400bf8:  mov     dword [rbp-0x54], 0x0
0x400bff:  jmp     0x400c21
0x400c01:  shl     dword [rbp-0x58], 0x5
0x400c05:  mov     eax, dword [rbp-0x54]
0x400c08:  add     eax, 0xe
0x400c0b:  mov     edx, eax
0x400c0d:  mov     rax, qword [rbp-0x68]
0x400c11:  add     rax, rdx
0x400c14:  movzx   eax, byte [rax]
0x400c17:  movsx   eax, al
0x400c1a:  xor     dword [rbp-0x58], eax
0x400c1d:  add     dword [rbp-0x54], 0x1
0x400c21:  cmp     dword [rbp-0x54], 0x5
0x400c25:  jbe     0x400c01
0x400c27:  mov     rax, qword [rbp-0x70]
0x400c2b:  mov     esi, 0x401118
0x400c30:  mov     rdi, rax
0x400c33:  call    strtok
0x400c38:  mov     qword [rbp-0x40], rax
0x400c3c:  cmp     qword [rbp-0x40], 0x0
0x400c41:  jne     0x400c4d
0x400c43:  mov     eax, 0x1
0x400c48:  jmp     0x400de9
0x400c4d:  mov     rax, qword [rbp-0x40]
0x400c51:  mov     rdi, rax
0x400c54:  call    atol
0x400c59:  mov     dword [rbp-0x44], eax
0x400c5c:  mov     eax, dword [rbp-0x44]
0x400c5f:  cmp     eax, dword [rbp-0x58]
0x400c62:  je      0x400c6e
0x400c64:  mov     eax, 0x2
0x400c69:  jmp     0x400de9
0x400c6e:  mov     dword [rbp-0x50], 0x0
0x400c75:  jmp     0x400ce1
0x400c77:  mov     eax, dword [rbp-0x50]
0x400c7a:  movzx   ecx, byte [rbp+rax-0x36]
0x400c7f:  mov     edx, dword [rbp-0x50]
0x400c82:  mov     rax, qword [rbp-0x68]
0x400c86:  add     rax, rdx
0x400c89:  movzx   eax, byte [rax]
0x400c8c:  xor     ecx, eax
0x400c8e:  mov     edx, ecx
0x400c90:  mov     eax, dword [rbp-0x50]
0x400c93:  mov     byte [rbp+rax-0x36], dl
0x400c97:  mov     eax, dword [rbp-0x50]
0x400c9a:  movzx   edx, byte [rbp+rax-0x36]
0x400c9f:  mov     eax, dword [rbp-0x50]
0x400ca2:  add     eax, 0x7
0x400ca5:  mov     ecx, eax
0x400ca7:  mov     rax, qword [rbp-0x68]
0x400cab:  add     rax, rcx
0x400cae:  movzx   eax, byte [rax]
0x400cb1:  xor     edx, eax
0x400cb3:  mov     eax, dword [rbp-0x50]
0x400cb6:  mov     byte [rbp+rax-0x36], dl
0x400cba:  mov     eax, dword [rbp-0x50]
0x400cbd:  movzx   edx, byte [rbp+rax-0x36]
0x400cc2:  mov     eax, dword [rbp-0x50]
0x400cc5:  add     eax, 0x15
0x400cc8:  mov     ecx, eax
0x400cca:  mov     rax, qword [rbp-0x68]
0x400cce:  add     rax, rcx
0x400cd1:  movzx   eax, byte [rax]
0x400cd4:  xor     edx, eax
0x400cd6:  mov     eax, dword [rbp-0x50]
0x400cd9:  mov     byte [rbp+rax-0x36], dl
0x400cdd:  add     dword [rbp-0x50], 0x1
0x400ce1:  cmp     dword [rbp-0x50], 0x5
0x400ce5:  jbe     0x400c77
0x400ce7:  mov     dword [rbp-0x4c], 0x0
0x400cee:  jmp     0x400d2b
0x400cf0:  mov     eax, dword [rbp-0x4c]
0x400cf3:  movzx   eax, byte [rbp+rax-0x36]
0x400cf8:  add     eax, 0x1
0x400cfb:  mov     edx, eax
0x400cfd:  mov     eax, dword [rbp-0x4c]
0x400d00:  mov     byte [rbp+rax-0x36], dl
0x400d04:  mov     eax, dword [rbp-0x4c]
0x400d07:  movzx   edx, byte [rbp+rax-0x36]
0x400d0c:  mov     eax, dword [rbp-0x4c]
0x400d0f:  add     eax, 0xe
0x400d12:  mov     ecx, eax
0x400d14:  mov     rax, qword [rbp-0x68]
0x400d18:  add     rax, rcx
0x400d1b:  movzx   eax, byte [rax]
0x400d1e:  xor     edx, eax
0x400d20:  mov     eax, dword [rbp-0x4c]
0x400d23:  mov     byte [rbp+rax-0x36], dl
0x400d27:  add     dword [rbp-0x4c], 0x1
0x400d2b:  cmp     dword [rbp-0x4c], 0x5
0x400d2f:  jbe     0x400cf0
0x400d31:  mov     dword [rbp-0x48], 0x0
0x400d38:  jmp     0x400d6c
0x400d3a:  mov     eax, dword [rbp-0x48]
0x400d3d:  movzx   eax, byte [rbp+rax-0x36]
0x400d42:  movsx   eax, al
0x400d45:  mov     edx, dword [rbp-0x48]
0x400d48:  lea     ecx, [rdx+rdx]
0x400d4b:  lea     rdx, [rbp-0x30]
0x400d4f:  mov     ecx, ecx
0x400d51:  add     rcx, rdx
0x400d54:  mov     edx, eax
0x400d56:  mov     esi, 0x40111a {"%02X"
0x400d5b:  mov     rdi, rcx
0x400d5e:  mov     eax, 0x0
0x400d63:  call    sprintf
0x400d68:  add     dword [rbp-0x48], 0x1
0x400d6c:  cmp     dword [rbp-0x48], 0x5
0x400d70:  jbe     0x400d3a
0x400d72:  mov     esi, 0x401118
0x400d77:  mov     edi, 0x0
0x400d7c:  call    strtok
0x400d81:  mov     qword [rbp-0x40], rax
0x400d85:  cmp     qword [rbp-0x40], 0x0
0x400d8a:  jne     0x400d93
0x400d8c:  mov     eax, 0x3
0x400d91:  jmp     0x400de9
0x400d93:  lea     rdx, [rbp-0x30]
0x400d97:  mov     rax, qword [rbp-0x40]
0x400d9b:  mov     rsi, rdx
0x400d9e:  mov     rdi, rax
0x400da1:  call    strcmp
0x400da6:  test    eax, eax
0x400da8:  je      0x400db1
0x400daa:  mov     eax, 0x4
0x400daf:  jmp     0x400de9
0x400db1:  mov     esi, 0x40111f
0x400db6:  mov     edi, 0x0
0x400dbb:  call    strtok
0x400dc0:  mov     qword [rbp-0x40], rax
0x400dc4:  cmp     qword [rbp-0x40], 0x0
0x400dc9:  jne     0x400dd2
0x400dcb:  mov     eax, 0x5
0x400dd0:  jmp     0x400de9
0x400dd2:  mov     rax, qword [rbp-0x68]
0x400dd6:  lea     rdx, [rax+0x1c]
0x400dda:  mov     rax, qword [rbp-0x40]
0x400dde:  mov     rsi, rax
0x400de1:  mov     rdi, rdx
0x400de4:  call    validate_final
0x400de9:  mov     rsi, qword [rbp-0x8]
0x400ded:  xor     rsi, qword [fs:0x28]
0x400df6:  je      0x400dfd
0x400df8:  call    __stack_chk_fail
0x400dfd:  leave   
0x400dfe:  retn    
```
The function is pretty long (for a noob like me) so I'll want to break it down into small problems to solve. Also we can note that this function also calls another function called *validate_final* near the end of this function.

### First Loop / Algorithm 
We're going to skip the function prologue and jump into the first loop immediately following the variable initializations.

```assembly
400c01:  shl     dword [rbp-0x58], 0x5
400c05:  mov     eax, dword [rbp-0x54]
400c08:  add     eax, 0xe
400c0b:  mov     edx, eax
400c0d:  mov     rax, qword [rbp-0x68]
400c11:  add     rax, rdx
400c14:  movzx   eax, byte [rax]
400c17:  movsx   eax, al
400c1a:  xor     dword [rbp-0x58], eax
400c1d:  add     dword [rbp-0x54], 0x1

400c21:  cmp     dword [rbp-0x54], 0x5
400c25:  jbe     0x400c01
```
The function sets a counter to 0 and creates a while loop by comparing the counter (which is stored at the offset rbp-0x54) to 0x5. 

The loop will take a variable that was initialized outside of the loop and perform a bitwise shift left by 0x5. Then it will take the counter variable and add 0xe (14) to use as an index. 

The function will store the challenge string into rax register and take the value of the challenge string at the index and store it into a variable to perform a XOR operation against the value that was shifted left by 0x5.

The loop will then go through this algorithm until the while loop is completed and save the end result into a variable. 

### 1st Check
After the loop has ran through, we encounter the first check in the function that will determine if our response is valid or not. The function will call *strtok* and *atol* to tokenize the string and convert it into a value. Then it will compare the first segment of our response input (separated by a colon as a delimiter).

```assembly
400c27:  mov     rax, qword [rbp-0x70]
400c2b:  mov     esi, 0x401118
400c30:  mov     rdi, rax
400c33:  call    strtok
400c38:  mov     qword [rbp-0x40], rax
400c3c:  cmp     qword [rbp-0x40], 0x0
400c41:  jne     0x400c4d
```
The content at memory address 0x401118 stores the value for a colon which is used as a delimiter. So we know the response will have segments separated by a colon.

The strtok function will then split the token to compare the first segment of our response input.

```assembly
400c4d:  mov     rax, qword [rbp-0x40]
400c51:  mov     rdi, rax
400c54:  call    atol
400c59:  mov     dword [rbp-0x44], eax
400c5c:  mov     eax, dword [rbp-0x44]
400c5f:  cmp     eax, dword [rbp-0x58]
400c62:  je      0x400c6e
```
Here we can see the atol function being called to convert the first segment of the string into an integer value to compare. 

### Reversing First Check
Now that we understand that the end value of the loop needs to be the first segment of our response input, we can replicate this in python. 

Reversing the first loop will give us something like this in python.

```python
    i = 0
    res = 0
    while i < 6:
        res = res << 5
        index = i + 14
        val = ord(chall[index])
        res ^= val
        print(res)
        i += 1
```
The variable "res" will hold the first segment that we will use as our payload to send to the server hosting this binary.

### Reversing the 2nd Check
Following the end of the first check, we can see that there are three while loops that the function will go through before it does a strcmp to check for a valid second segment of the response input. 

We can break the 2nd check down by reversing each loop at a time.

```assembly
400c77:  mov     eax, dword [rbp-0x50]
400c7a:  movzx   ecx, byte [rbp+rax-0x36]
400c7f:  mov     edx, dword [rbp-0x50]
400c82:  mov     rax, qword [rbp-0x68]
400c86:  add     rax, rdx
400c89:  movzx   eax, byte [rax]
400c8c:  xor     ecx, eax
400c8e:  mov     edx, ecx
400c90:  mov     eax, dword [rbp-0x50]
400c93:  mov     byte [rbp+rax-0x36], dl
400c97:  mov     eax, dword [rbp-0x50]
400c9a:  movzx   edx, byte [rbp+rax-0x36]
400c9f:  mov     eax, dword [rbp-0x50]
400ca2:  add     eax, 0x7
400ca5:  mov     ecx, eax
400ca7:  mov     rax, qword [rbp-0x68]
400cab:  add     rax, rcx
400cae:  movzx   eax, byte [rax]
400cb1:  xor     edx, eax
400cb3:  mov     eax, dword [rbp-0x50]
400cb6:  mov     byte [rbp+rax-0x36], dl
400cba:  mov     eax, dword [rbp-0x50]
400cbd:  movzx   edx, byte [rbp+rax-0x36]
400cc2:  mov     eax, dword [rbp-0x50]
400cc5:  add     eax, 0x15
400cc8:  mov     ecx, eax
400cca:  mov     rax, qword [rbp-0x68]
400cce:  add     rax, rcx
400cd1:  movzx   eax, byte [rax]
400cd4:  xor     edx, eax
400cd6:  mov     eax, dword [rbp-0x50]
400cd9:  mov     byte [rbp+rax-0x36], dl
400cdd:  add     dword [rbp-0x50], 0x1
```
This loop performs several XOR operations on the bytes in the buffer and using those values to determine positions (index) and operands for the XOR operation. It will then store the result at an address calculated based on the value of the counter. 

```asm
400cf0:  mov     eax, dword [rbp-0x4c]
400cf3:  movzx   eax, byte [rbp+rax-0x36]
400cf8:  add     eax, 0x1
400cfb:  mov     edx, eax
400cfd:  mov     eax, dword [rbp-0x4c]
400d00:  mov     byte [rbp+rax-0x36], dl
400d04:  mov     eax, dword [rbp-0x4c]
400d07:  movzx   edx, byte [rbp+rax-0x36]
400d0c:  mov     eax, dword [rbp-0x4c]
400d0f:  add     eax, 0xe
400d12:  mov     ecx, eax
400d14:  mov     rax, qword [rbp-0x68]
400d18:  add     rax, rcx
400d1b:  movzx   eax, byte [rax]
400d1e:  xor     edx, eax
400d20:  mov     eax, dword [rbp-0x4c]
400d23:  mov     byte [rbp+rax-0x36], dl
400d27:  add     dword [rbp-0x4c], 0x1
```
This loop will then take byte by byte the results that were stored from the previous loops and use them for arithmetic operations and subsequently store the results the same way.

```asm
400d3a:  mov     eax, dword [rbp-0x48]
400d3d:  movzx   eax, byte [rbp+rax-0x36]
400d42:  movsx   eax, al
400d45:  mov     edx, dword [rbp-0x48]
400d48:  lea     ecx, [rdx+rdx]
400d4b:  lea     rdx, [rbp-0x30]
400d4f:  mov     ecx, ecx
400d51:  add     rcx, rdx
400d54:  mov     edx, eax
400d56:  mov     esi, 0x40111a {"%02X"
400d5b:  mov     rdi, rcx
400d5e:  mov     eax, 0x0
400d63:  call    sprintf
400d68:  add     dword [rbp-0x48], 0x1
```
The final loop before the function checks for a valid second segment essentially goes byte by byte and calls sprintf function to format the results of the previous loops and appends it all into a string variable. 

```assembly
400d72:  mov     esi, 0x401118
400d77:  mov     edi, 0x0
400d7c:  call    strtok
400d81:  mov     qword [rbp-0x40], rax
400d85:  cmp     qword [rbp-0x40], 0x0
400d8a:  jne     0x400d93

400d93:  lea     rdx, [rbp-0x30]
400d97:  mov     rax, qword [rbp-0x40]
400d9b:  mov     rsi, rdx
400d9e:  mov     rdi, rax
400da1:  call    strcmp
400da6:  test    eax, eax
400da8:  je      0x400db1
```
Then the function will compare that string variable with the second segment of the user input. So we know our second segment must equal that string variable.

Now that we have figured out the algorithms, we can script the algo in python to give us that string to use as our second segment.

```python
   k = 0
    list = []
    while k < 6:
        rbprax = 0
        firstxor = ord(chall[k])
        res10 = rbprax ^ firstxor
        rbprax = res10
        index = k + 7
        res11 = chall[index:]
        secondxor = ord(res11[0])
        res22 = rbprax ^ secondxor
        rbprax = res22
        index1 = k + 21
        val = chall[index1]
        thirdxor = ord(val[0])
        res3 = rbprax ^ thirdxor
        rbprax = res3
        print(hex(rbprax))
        list.append(hex(rbprax))
        k += 1
    list1 = [int(val, 16) for val in list]
    print(list1)

    string1 = ""
    j = 0

    while j < 6:
        xorval = list1[j] + 0x1
        index10 = j + 14
        var = ord(chall[index10])
        res99 = var ^ xorval
        string1 += "%02X" % res99
        j += 1
    print(string1)
```

### Final Check
The function will call the strtok function one last time before calling validate_final function to check for the last segment of the response input.

If we take a look at the validate_final function, we can see that there are two loops before the function checks if the response is valid or not.

Let's take a look at the validate_final function.

```assembly
0x400ab5:  push    rbp
0x400ab6:  mov     rbp, rsp
0x400ab9:  sub     rsp, 0x40
0x400abd:  mov     qword [rbp-0x38], rdi
0x400ac1:  mov     qword [rbp-0x40], rsi
0x400ac5:  mov     rax, qword [fs:0x28]
0x400ace:  mov     qword [rbp-0x8], rax
0x400ad2:  xor     eax, eax
0x400ad4:  mov     qword [rbp-0x20], 0x0
0x400adc:  mov     qword [rbp-0x18], 0x0
0x400ae4:  mov     dword [rbp-0x28], 0x0
0x400aeb:  jmp     0x400b38
0x400aed:  mov     eax, dword [rbp-0x28]
0x400af0:  movzx   eax, byte [rax+0x6020b0]
0x400af7:  movzx   edx, al
0x400afa:  mov     ecx, dword [rbp-0x28]
0x400afd:  mov     rax, qword [rbp-0x38]
0x400b01:  add     rax, rcx
0x400b04:  movzx   eax, byte [rax]
0x400b07:  movsx   eax, al
0x400b0a:  mov     ecx, edx
0x400b0c:  imul    ecx, eax
0x400b0f:  mov     edx, 0x4ec4ec4f
0x400b14:  mov     eax, ecx
0x400b16:  imul    edx
0x400b18:  sar     edx, 0x3
0x400b1b:  mov     eax, ecx
0x400b1d:  sar     eax, 0x1f
0x400b20:  sub     edx, eax
0x400b22:  mov     eax, edx
0x400b24:  imul    eax, eax, 0x1a
0x400b27:  sub     ecx, eax
0x400b29:  mov     eax, ecx
0x400b2b:  mov     edx, eax
0x400b2d:  mov     eax, dword [rbp-0x28]
0x400b30:  mov     byte [rbp+rax-0x20], dl
0x400b34:  add     dword [rbp-0x28], 0x1
0x400b38:  cmp     dword [rbp-0x28], 0x5
0x400b3c:  jbe     0x400aed
0x400b3e:  mov     dword [rbp-0x24], 0x0
0x400b45:  jmp     0x400b5f
0x400b47:  mov     eax, dword [rbp-0x24]
0x400b4a:  movzx   eax, byte [rbp+rax-0x20]
0x400b4f:  add     eax, 0x41
0x400b52:  mov     edx, eax
0x400b54:  mov     eax, dword [rbp-0x24]
0x400b57:  mov     byte [rbp+rax-0x20], dl
0x400b5b:  add     dword [rbp-0x24], 0x1
0x400b5f:  cmp     dword [rbp-0x24], 0x5
0x400b63:  jbe     0x400b47
0x400b65:  lea     rdx, [rbp-0x20]
0x400b69:  mov     rax, qword [rbp-0x40]
0x400b6d:  mov     rsi, rdx
0x400b70:  mov     rdi, rax
0x400b73:  call    strcmp
0x400b78:  test    eax, eax
0x400b7a:  je      0x400b83
0x400b7c:  mov     eax, 0x6
0x400b81:  jmp     0x400b88
0x400b83:  mov     eax, 0x0
0x400b88:  mov     rsi, qword [rbp-0x8]
0x400b8c:  xor     rsi, qword [fs:0x28]
0x400b95:  je      0x400b9c
0x400b97:  call    __stack_chk_fail
0x400b9c:  leave   
0x400b9d:  retn    
```

We can see the first loop is a series of calculations on bytes from specific addresses and modifies the content at the buffer rbp+rax-0x20. 

The second loop takes the results of the first loop at the buffer rbp+rax-0x20 and adds 0x41 to the value to append it to a string. That string will be used to compare to our final segment and through debugging we find out that it's converted to ASCII.

We can write python loops to give us a string that will be validated like this:

```python
    l = 0
    listboy = [0xd8, 0x32, 0x5c, 0xef, 0x5, 0x9a]
    biglist = []
    while l < 6:
        firstxor = chall3[l]
        res55 = listboy[l] * ord(chall3[l])
        restest = (res55 + 2**31) % 2**32 - 2**31
        restor = restest * 0x4ec4ec4f
        res66 = (restor >> 32) & 0xFFFFFFFF
        res77 = res66 >> 0x3
        res88 = res55 >> 0x1f
        res98 = res77 - res88
        res100 = res98 * 0x1a
        res111 = res55 - res100
        biglist.append(res111)
        l += 1

    print(biglist)

    d = 0
    result2 = ""

    while d < 6:
        result = biglist[d] + 65
        result2 += chr(result)
        d += 1

    print(result2)
```

## Putting It All Together
We have everything we need to generate a response input that will be successful against the binary. However, if we notice in the source code, the binary challenge/response pairs is in a loop 200 times. 

We will need to put our entire script together and wrap it in a loop for 200 times to successfully crack the binary and receive the flag.

This is my final script, I haven't cleaned it up so it won't look pretty.

```python
import interact
import struct

# Pack integer 'n' into a 8-Byte representation
def p64(n):
    return struct.pack('Q', n)

# Unpack 8-Byte-long string 's' into a Python integer
def u64(s):
    return struct.unpack('Q', s)[0]

p = interact.Process()
tester =  0
p.readuntil('\n')
p.readuntil('\n')
p.readuntil('\n')
while tester < 200:
    challnoob = p.readuntil('CHALLENGE: ')
    chall = p.readline().strip()
    print(chall)
    chall3 = chall[28:]


    i = 0
    res = 0

    while i < 6:
        res = res << 5
        index = i + 14
        val = ord(chall[index])
        res ^= val
        print(res)
        i += 1

    k = 0
    list = []
    while k < 6:
        rbprax = 0
        firstxor = ord(chall[k])
        res10 = rbprax ^ firstxor
        rbprax = res10
        index = k + 7
        res11 = chall[index:]
        secondxor = ord(res11[0])
        res22 = rbprax ^ secondxor
        rbprax = res22
        index1 = k + 21
        val = chall[index1]
        thirdxor = ord(val[0])
        res3 = rbprax ^ thirdxor
        rbprax = res3
        print(hex(rbprax))
        list.append(hex(rbprax))
        k += 1
    list1 = [int(val, 16) for val in list]
    print(list1)

    string1 = ""
    j = 0

    while j < 6:
        xorval = list1[j] + 0x1
        index10 = j + 14
        var = ord(chall[index10])
        res99 = var ^ xorval
        string1 += "%02X" % res99
        j += 1
    print(string1)


    l = 0
    listboy = [0xd8, 0x32, 0x5c, 0xef, 0x5, 0x9a]
    biglist = []
    while l < 6:
        firstxor = chall3[l]
        res55 = listboy[l] * ord(chall3[l])
        restest = (res55 + 2**31) % 2**32 - 2**31
        restor = restest * 0x4ec4ec4f
        res66 = (restor >> 32) & 0xFFFFFFFF
        res77 = res66 >> 0x3
        res88 = res55 >> 0x1f
        res98 = res77 - res88
        res100 = res98 * 0x1a
        res111 = res55 - res100
        biglist.append(res111)
        l += 1

    print(biglist)

    d = 0
    result2 = ""

    while d < 6:
        result = biglist[d] + 65
        result2 += chr(result)
        d += 1

    print(result2)


    print("This is the chall: " + str(chall))
    wow = str(res) + ":" + string1 + ":" + result2

    p.sendline(wow)
    print("I am on my " + str(tester) + " iteration!")
    tester += 1

    #p.interactive()
```

Thanks for reading. Noob out.
