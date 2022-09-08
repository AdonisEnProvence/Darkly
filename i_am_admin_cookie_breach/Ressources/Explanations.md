# I_am_admin cookie breach

After inspecting the website cookies we found this one:

```
I_am_admin	68934a3e9455fa72420237eb05902327
```

By googling `68934a3e9455fa72420237eb05902327` it results as the md5 hashed of `false`..
Then by hashing `true` we get `b326b5062b2f0e69046810717534cb09`.
Thanks to your browser devtool change the cookie value and refresh.
There you go the website renders an alert modal containing the flag.

Solution:

Overall hashing a boolean value is a very bad idea.
A simple solution would be define a more complex hash, and then statically storing it in the server nor database to be even safer.
Also only storing a cookie in an admin client is safer, as it won't give an track to exploit to the hacker.

