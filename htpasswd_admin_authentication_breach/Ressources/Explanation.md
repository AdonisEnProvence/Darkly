# Htpasswd Admin Authentication Breach

## How we found the breach

Searching inside the [robots.txt](https://developers.google.com/search/docs/advanced/robots/intro) file, we could find:

```txt
User-agent: *
Disallow: /whatever
Disallow: /.hidden
```

Searching in the `/whatever` directory we were able to download the `htpasswd` file containing:

```txt
root:437394baff5aa33daa618be47b75cb49
```

[By googling the retrieved hash](https://md5.gromweb.com/?string=qwerty123@), we can find it's the md5 hash of `qwerty123@`.

It's really common to find admin panel using the route `/admin` on any web apps, this is also the case here.

After navigating to `/admin` we can find an authentication form, asking for a username and a password.

Fill the username with `root` and password by `qwerty123@` to finally submit. Bim there we go, a flag appears.

## How to exploit the breach

As we have access to an admin authentication, we could nearly do anything we want using either the admin authentication token on specific server endpoints or from the admin panel.

## How to avoid the breach

Overall defining a stronger password would make this breach harder to exploit but not 100% safe, as the hash could still be bruteforced using a script.

A stronger configuration of Nginx should be used, preventing any user to access any file from the filesystem, except those that must be served. Access to `.htpasswd` files should be carefully protected.

A `.htpasswd` file is normally used in an Apache server to guarantee authentication to specific directories or files. It can be used in conjunction with a `.htaccess`. Please note the dot before `htpasswd`, which is not in the name of the file we found. Implemented this way, the file seems not to be used by Nginx in any way. It's only storing the hashed password somewhere for a human to decrypt it. It will never be interpreted nor injected by any script or code.
