# Redirect attack

## How we found the breach

Inside every page of the website, we can find a footer containing icons that redirects on click to some social networks.

Here is the HTML code for one of these links:

```html
<li><a href="index.php?page=redirect&amp;site=twitter" class="icon fa-twitter"></a></li>
```

Links to Facebook, Twitter and Instagram accounts of 42 are of the form: `/index.php?page=redirect&site=<service>`.

We replaced the service with something else than `facebook`, `twitter` and `instagram`, to see if we could be redirected, for example, to Google website: `/index.php?page=redirect&site=google`.

We were not redirected to Google website, but we had found a flag!

## How to exploit the breach

If someone wanna impersonate the service, he could send a link in a phishing mail as `http:/IP/index.php?page=redirect&site=<EVIL_WEBSITE>`
This link redirection could look legit to the user that would click on it, being redirected to the evil site that perfectly reproduces the source website.

The user being confident about the authenticity of the website could enter his personal information, that would in fact be sent to the hacker, hacker that could even log in the user by sniffing the information and redirecting the user to the authentic website afterall.

The user wouldn't even notify that he has been hacked.

## How to avoid the breach

To avoid this kind of breach the server needs to verify the given query.

### Domain whitelist

Using a domain `whitelist`, this can be dangerous as whitelisted website can still have security issues.

Javascript bad domain whitelist implementation:

```js
const whiteListedDomainCollection = [
    "domain-one.fr"
    "domain-two.fr"
    "domain-two.fr"
];

const redirectUrl = getParameterByName('redirect_url');

const domainIsWhiteListed = whiteListedDomainCollection.some((whiteListedDomain) => redirectUrl.startsWith(whiteListedDomain));

if (domainIsWhiteListed){
    // handle success
} else {
    // handle failure
}
```

Nothing says that the whitelisted domains are themselves redirect attack bullet proof.
Neither that the parsing implementation is not unbreakable.

### Static defined possible redirection

Or by defining a plain url whitelist as below.

Dangerous PHP Implementation example:

```php
$redirect_url = $_GET['url'];
header("Location: " . $redirect_url);
```

Safe PHP Implementation example:

```php
<?php
$redirect_url = $_GET['url'];

switch ($redirect_url) {
    case "instagram":
        header("Location: http://www.instagram.com/my-account");
        break;
    case "twitter":
        header("Location: http://www.twitter.com/my-account");
        break;
    case "facebook":
        header("Location: http://www.facebook.com/my-account");
        break;
    default:
        // Redirect to 404 page
}

exit;
?>
```

### Redirection confirmation modal

Also it's possible to notify the user before redirecting him, that he's about to go outside the website using a warning confirmation modal.

Source: https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html#preventing-unvalidated-redirects-and-forwards
