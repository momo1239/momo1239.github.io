---
title: "Certified Red Team Operator (CRTO) Review"
date: 2021-11-17
draft: false
---


# What is CRTO?
CRTO is supposed to be an introductory course into red teaming tradecraft, from initial compromise all the way to domain takeover and data exfiltration. From their website:


>"**Red Team Ops** is an online course that teaches the basic principals, tools and techniques, that are synonymous with red teaming.
>
>Students will first cover the core concepts of adversary simulation, command & control, and how to plan for an engagement. They will then learn about each stage of the >attack lifecycle from initial compromise, to full domain takeover, data hunting, and exfiltration. Students will also take various OPSEC concerns into account and >learn how to bypass defences such as Windows Defender, AMSI and AppLocker. Finally, they will cover reporting and post-engagement activities."


I decided to take this exam to learn more about operational red teaming and C2 knowledge after I passed my OSCP in the early months of this year. I ended up studying CRTP and got a job so this plan was pushed until now. 

## Who is this course for? 
Before taking this course you should have some knowledge of penetration testing or infosec but there's no real prerequisties for this course. I think this course is great for someone who's looking to get a peak into red teaming or for someone who wants to learn more about active directory security. If you are an OSCP or eCPPT level and you want to learn more about AD or red teaming then this is the course for you.

Prior to this course, I did the CRTP and also HTB Prolabs: Offshore so I did come in with prior knowledge of active directory attacks which helped. There were things in this course that I was already knew, but I learned a lot about C2, AV evasion with C2, and OPSEC concerns with every technique. 


# Overview
When you sign up for the course you will get access to the course materials on an online platform called Canvas. There are modules that will walk you through different stages of the red teaming lifecycle and it will accompany the lab environment. You can purchase as many lab hours as you need and it will only start counting when you are actually powering on the labs. 


# What the course covers

-  External Reconnaissance
-   Initial Compromise
-   Host Reconnaissance
-   Host Persistence
-   Host Privilege Escalation
-   Domain Reconnaissance
-   Lateral Movement
-   Credentials & User Impersonation
-   Password Cracking Hints & Tips
-   Session Passing
-   Pivoting
-   Data Protection API
-   Kerberos
-   Group Policy
-   Discretionary Access Control Lists
-   MS SQL Servers
-   Domain Dominance
-   Forest & Domain Trusts
-   Local Administrator Password Solution
-   Bypassing Defences
-   Data Hunting & Exfiltration
-   Post-Engagement & Reporting
-   Extending Cobalt Strike

Each of these modules have sub-modules and some with videos accompanying the materials as well. The materials does a good job of explaining the concepts and also showing you how it's done in cobalt strike. But if you want more detailed information on how an attack works I recommend <https://adsecurity.org> and [harmj0y's blog](http://harmj0y.net/blog/blog)

The course does provide everything you need to pass the exam and external sources and absolutely not needed. But in order to learn how to implement and apply the knowledge from the course materials, it's important to practice in the labs because the execution and implementation will be different depending on the configuration of the network.

You also get lifetime access to the RTO course materials and updates for as long as the course is supported by RastaMouse which is a big plus.


# Lab
The lab has multiple AD domains across forests and the course material will guide you through the labs. Generally speaking, it's been reccommended that you take 30-40 hours of lab time and go through the labs once with the course and then again on your own. Personally, I only bought 15 hours and likely spent less than that but it depends on your prior knowledge and experience. I will say that I really enjoyed working with Cobalt Strike during this course and both the lab and exam environment were amazing.

It is absolutely amazing that you can experience the big boy cobalt strike framework for £1.25 per hour (lab time). The labs has no access to internet and you can only access the labs from snaplab via guacamole which is a mandatory requirement for allowing cobalt strike in the labs. However, all the tools you need will be provided and it's a small price to pay for being able to use CS. 


# Exam
The CRTO is a 48 hour exam spread across 4 days. The best part about this exam is that you can **PAUSE** your exam whenever you want. How crazy is that? This gives you enough time to take breaks, eat, sleep, or whatever to refresh your mind during the exam. There's no report requirement for the exam and all you need is 6/8 flags to pass.

The exam consists of multiple domains and forests and you must complete the objective of the assessment (and get the flags along the way) to pass the exam. You will get access to a kali vm with all the tools you need during the exam. 

According to Rasta on his discord:
>
>My #1 tip for the exam is to spend some initial time prepping your C2 Profile, Resource Kit and Artifact Kit.  You want custom payloads that don't trigger default AV >signatures, and probably the amsi_disable directive for execute-assembly and powerpick capabilities.
>


This is absolutely true. You want to make sure that you have your C2 profile, resource kit, and artifact kit set up before you start or you will 100% run into headaches during the exam. If you know the course materials well and follow the above, you'll have no problems with the exam. 48 hours is more than enough time especially over 4 days. 

# Closing Thoughts
Great course for red teaming with a mix between practical training and theory explanations. Canvas made it feel like school though. Highly recommend this course for anyone who wants to learn about red team operations.
