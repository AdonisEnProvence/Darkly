# Htpasswd Admin Authentication Breach 

Searching inside the robots.txt files ( What is a robot.txt file ? https://developers.google.com/search/docs/advanced/robots/intro?hl=fr )
We could find:

```txt
User-agent: *
Disallow: /whatever
Disallow: /.hidden
```

Searching in the `/whatever` directory we were able to download the `htpasswd` file containing:

```txt
root:437394baff5aa33daa618be47b75cb49
```

By googling the retrieved hash, we can find the it's corresponding to the md5 hash of `qwerty123@`.


After navigation to the `/admin` page, fill the username with `root` and password by `qwerty123@` to finally submit.
Bim there we go, a flag appears.

Solution:

Overall defining a stronger password would make this breach harder to exploit, as the hash could still be bruteforced using a script.
?? To avoid definitely this kind of breach, a stronger ngninx config that would disallow any user to access the htpasswd would be solution. ??
Also storing the admin password in an dedicated database table instance would also do the work, of course by secured and escaped sql query.