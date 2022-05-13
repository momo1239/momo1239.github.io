---
title: "Active Directory - Forest & Domain Trusts"
date: 2021-12-12
tags: ["red teaming"]
draft: false
---



# Introduction
After taking both the CRTO and eCPTXv2 course, I wanted to reorganize my notes and discuss all the different ways to abuse an active directory trust. This is not a comprehensive list or guide by any means.

# What is a domain trust?
An active directory trust relationship allows users in one domain to access resources in another domain. This is done through a system of referrals. When a user requests for access to a resource that is outside of their domain, their KDC will return a referral ticket pointing to the KDC in the external domain.

The TGT of the user is included in the TGS-REP of the referral ticket but it is encrypted with the inter-realm key instead of the krbtgt account. The external domain will decrypt the inter-realm TGT with the inter-realm key and returns a TGS-REP back to the user and the user can then proceed to present the TGS to a service.


![kerberos authentication between cross-domain/forest](/images/trusts.png)


## Terminology Brief
 - Forest: A forest is a collection of domains that can be part of one or more domain trees.
 - SID: A security identifier uniquely identifies a security principal (user, domain, group)
 - One way trust: A one way trust allows principals in the **trusted** domain to access resources in the **trusting** domain, but not the other way around.
 - Two way trust: A two way trust is just two one-way trusts that go in both direction.
 - Transitive trust: A transitive trust is a trust that is extended to not only the child object, but also to each object the child object trusts. This means that a trusting domain will also trust the domains that the trusted domain trusts.


# Trust Types

Trusts can have different characteristics. By default, two-way transitive trusts are created when a new domain is added to a domain tree or a forest root domain. These two default trust types are parent-child trusts and tree-root trusts.

- Parent-child trusts: are part of the same forest. This trust is automatically created when a new domain is created in a tree.

- Tree-root trusts: A trust between root domain in a forest and a new tree root.

- External Trusts: Trusts between domains in different forests. It is nontransitive and enforces SID filtering.

- Forest Trusts: A trust relationship between a root domain in different forests. It also enforces SID filtering.

>**Microsoft extinguishes between inter-forest trusts and intra-forest trusts. Intra-forest trusts are trust relationships within the same forest, while inter-forest trusts are trusts between two different forests.**

# SID History Abuse

An intra-forest trust such as a parent-child or tree-root trust can be abused via an attack called SID History Abuse from the research of Sean Metcalf. Within a single forest, all domains trust each other and we can escalate from one domain to all the others.

## What is SID History?

SID History was designed to support migration of users from one domain to another. To preserve access to resources in the user's old domain, the user's previous SID would be added to the SID History of their new account. This works because the SIDs are not being filtered out in the cross-domain referrals via SID filtering. 

This means that if we add the SID of an enterprise admin to the sid history, we can access resources as if we were an enterprise admin. Mimikatz has a functionality to include extra account SIDs from other domains when making a golden ticket.

If you have compromised the domain controller of a child domain, you can add `S-1-5-21-<RootDomain>-519` to the /sids flag and compromise the parent domain. This can allow an attacker to completely compromise the **entire** forest as long as they can compromise **one** domain in the forest.

## Demo
The process will be the same as creating a golden ticket with the additional sid. 

```
kerberos::golden /user:Administrator /domain:<currentdomain> /sid:<CurrentDomainSID> /krbtgt:<krbtgtHash> /sids:<S-1-5-21-<RootDomain>-519> /startoffset:0 /endin:600 /renewmax:10080 /ticket:\path\to\ticket\golden.kirbi
```
After creating the ticket, we can pass the ticket and access resources in the root domain as the enterprise admin. We can also perform a dcsync attack.


![PTT from child domain](/images/ptt.PNG)



# Trust Tickets
As mentioned earlier, when a trust is created there is a shared password called the inter-realm key. When a user presents the inter-realm TGT referral to the external KDC, the user's TGT is included within it. Since the external domain trusts the domain that issued the referral, it trusts that the user's TGT is accurate. This means that we can forge an inter-realm ticket that allows us to impersonate any user in our domain using the inter-realm key. And if we can retrieve the inter-realm key, it's also likely that we can pull the krbtgt hash allowing us to impersonate any user in the external domain/forest.


## Forging trust tickets

1. Dump trust key
2. Create a forged trust ticket
3. Use the trust ticket to get a TGS for a service in the targeted domain
4. PTT

- `mimikatz lsadump::trust /patch`
- `>> kerberos::golden /domain:current_domain /sid:current_domain_sid /rc4:trust_key /user:Administrator /service:krbtgt /target:external_domain /ticket:path_to_save`
- `rubeus asktgs /ticket:path_to_trust_ticket /service:cifs/domain_controller_of_external_domain`

# SID Filtering
SID History abuse cannot be done through a forest trust because of a protection called SID filtering. When a user's TGT is presented to the external domain, it contains a PAC (privileged attribute certificate). The PAC contains among other things the SIDs of the groups that we are a member of. We can view the PACs through mimikatz using:
- `sekurlsa::tickets /export`

An example of a PAC might look like this:

```
Username: user
Domain SID: domain-sid
UserId: 500
PrimaryGroupId 513
Member of groups:
  ->   513 (attributes: 7)
  ->   520 (attributes: 7)
  ->   512 (attributes: 7)
  ->   519 (attributes: 7)
  ->   518 (attributes: 7)
LogonServer:  forest-a-dc
LogonDomainName:  forest-a

Extra SIDS:
  ->   S-1-18-1
```
SID filtering will filter out SIDs that are matching a particular patterns. There are certain rules that will be used to filter out these SIDs from being added.

For example, if there is an SID that is set to *AlwaysFilter* then it will always be filtered out by the trusting domain/forest regardless of the trust type. 

The enterprise admins group is set to "ForestSpecific". According to microsoft:
> * “The ForestSpecific rule is for those SIDs that are never allowed in a PAC that originates from out of the forest or from a domain that has been marked as QuarantinedWithinForest, unless it belongs to that domain.”

# SID Filtering Relaxation
There is an option via the netcom tool to allow SID history on cross-forest trusts.

`netcom trust /d:forest-a.local forest-b.local /enablesidhistory:yes`

After enabling SID history, the trust has the TREAT_AS_EXTERNAL FLAG.

>*If this bit is set, then a cross-forest trust to a domain is to be treated as an external trust for the purposes of SID Filtering. Cross-forest trusts are more stringently filtered than external trusts. This attribute relaxes those cross-forest trusts to be equivalent to external trusts. For more information on how each trust type is filtered, see [MS-PAC] section 4.1.2.2.*

This means that any SID that is not filtered as **ForestSpecific** in the PAC will be accepted by the DC on Forest B. Any RID greater than 1000 can be spoofed if SID history is enabled across forest trusts. 

# Breaking Forest Trusts

>*If we have a bidirectional trust with an external forest and we manage to compromise a machine on the local forest that has enabled unconstrained delegation (DCs have this by default), we can use the printerbug to force the DC of the external forest's root domain to authenticate to us. Then we can capture it's TGT, inject it into memory and DCsync to dump it's hashes, giving ous complete access over the whole forest.*

This means that if we have a two-way forest trust between Forest-A and Forest-B, then the compromise of any server with unconstrained delegation in Forest-B/Forest-A can be used to compromise the other forest's root domain completely.

1. Compromise a server with unconstrained delegation. (DC have unconstrained delegation by default)

2. Use Rubeus monitor to monitor for 4624 logon events and extract TGTs from the session via LSA APIs

3. Use the printer bug against a domain controller on the targeted forest.

4. The targeted forest's DC will authenticate to our compromised server as the DC machine account. The TGT will be contained within the service ticket sent to our compromised server and cached in memory.

5. Then we can extract the TGT and PTT to execute a DCSYNC attack and compromise the targeted forest.

## Demo

 - Using Rubeus' monitor:
 ![rubeus monitor](/images/monitor.PNG)

- Triggering the printer bug with SpoolSample:
![spoolsample](/images/spool.PNG)

- Receive TGT
![TGT of DC](/images/tgt.PNG)

- PTT
![PTT](/images/ptt.PNG)

# Manual Trust Abuse
Prior to the days of easily abusing intra-forest trusts via SID History abuse, attackers had to enumerate and map out foreign user/group membership and escalate from child trust to root domain by hand. 

 - Enumerate and map trust relationships
 - Enumerate security principals that have access to resources in another domain, or security principals that are from another domain. 
 - Utitilze targeted account compromise to pivot through domain trusts to achieve objective.
------------------------------------------------------------------------
In some cases, this may be easier than other methods. 

Let's say there's a user in domainA.local that is also an administrator on the domain controller of domainB.local. If we can compromise that user, it is very simple to compromise domainB. 

There might be many different scenarios depending on the configuration of the active directory environment you are in. While taking CRTO and eCPTXv2, I was able to abuse MSSQL database links across forest trusts.

# MSSQL Database Link Abuse
>*A database link allows a SQL Server to access other resources like other SQL Server. If we have two linked SQL Servers we can execute stored procedures in them. Database links also works across Forest Trust!*

1. Enumerate database links
2. We can use queries to enumerate other links from the linked database
3. Query execution for RCE

- Enumerating existing links:
    - `select * from master..sysservers`

- Enumerating other links from the another link:
    - `select * from openquery("LinkedDatabase", 'select * from master..sysservers')`

- Code execution:
    - `Get-SQLServerLinkCrawl -Instance <SPN> -Query "exec master..xp_cmdshell 'whoami'"`

     - `SELECT * FROM OPENQUERY("[LINK]", 'select @@servername; exec xp_cmdshell ''powershell -w hidden -enc blah''')`


# Conclusion 
These were the attacks and methods that I utilize for CRTO and eCPTX. This is not meant to be a guide or a complete list of attacking trusts. This is just a reorganization of my notes. 