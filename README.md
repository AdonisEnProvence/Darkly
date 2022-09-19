# Darkly

This repository is a 42 project that asked us to find security breaches on a website.

The objective was to find 14 breaches, each of them giving a flag.

For each breach, we wrote how we found it, how the breach can be exploited and how the breach can be avoided.

At the root of the repository, we created a directory for each breach containing the flag, and optionally the ressources that were needed to find the flag. For instance, we had to find a file containing a flag among 18,000 other files, and we wrote [a JavaScript script to help us](./scraping_hidden_directory/Ressources/fetch.js).

## Setup

### Starting the iso

In our setup we're using virtual box.

Download the `iso` from the intranet.

Create a ubuntu virtual machine with a default `vdi`, then create a new optical drive from your machine storage settings in the section `Controller: IDE`.

Then start the machine, and open the given IP in a browser.

### (Optional) Hitting the iso IP

If you have difficulties hitting the dumped vm ip. As for example if you're on 42 school network you will have to setup some config.

1. Add a new `Host-only Network` in VirtualBox

```
File > Host Network Manager > Create
```

2. Add a new `NAT Network`

```
File > Preferences > Network > Create
```

Then from your vm settings:

3. Create the first Network adapter for it to be attached to `Host-only Adapter`

```
Machine Settings > Network > Change `Attached to` select value to Host-only Adapter
```

4. Enable a second network adapter and make it attached to the `NAT Network`

```
Machine Settings > Network > Hit the Enabled Network Adapter checkbox
Machine Settings > Network > Change `Attached to` select value to Nat Network
```
