# Darkly

This repository is not an application by itself.
It's 42 project, where we have to find securities breaches on an `iso` exposing a website.
?? Unfortunately we don't have the permission to share the `iso` bundle. ??


## Setup

### Starting the iso
In our setup we're using virtual box.
Download the `iso` from the intranet.
Create an ubuntu virtual machine with an default `vdi`, then crete a new optical drive from your machine storage settings in the section `Controller: IDE`.
Then start the machine, and open the given ip in a browser.

### ( Optional ) Hitting the iso IP
If you have difficulties hitting the dumped vm ip. As for example if you're on 42 school network you will have to setup some config.

- 1 Add a new `Host-only Network` in VirtualBox
```
File > Host Network Manager > Create
```

- 2 Add a new `NAT Network`
```
File > Preferences > Network > Create
```

Then from your vm settings:

- 3 ??Modify/Create?? the first Network adapter for it to be attached to `Host-only Adapter`
```
Machine Settings > Network > Change `Attached to` select value to Host-only Adapter
```

- 4 Enable a second network adapter and make it attached to the `NAT Network`
```
Machine Settings > Network > Hit the Enabled Network Adapter checkbox
Machine Settings > Network > Change `Attached to` select value to Nat Network
```
