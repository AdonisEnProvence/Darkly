# XSS Breach on feedbacks page

## How we found the breach

From the page `http://IP/?page=feedback` you can find a form with two text fields, the name of the user writing the message and the message itself.

After submitting a feedback it appears at the bottom of the page.

### Submitting HTML content

The first attempt on XSS exploit would be to try adding a `<script />` tag inside one of the input.

To be able to insert a long text inside the name input it's necessary to modify its `maxlength` attribute.

Originally the code of the input is:

```html
<input name="txtName" type="text" size="30" maxlength="10">

We should replace it with:

<input name="txtName" type="text" size="30" maxlength="4200">
```

Then we write in both inputs the following malicious code that may lead to a XSS attack:

```html
<script>
    alert("XSS")
</script>
```

It seems that the server is escaping `<script />` tags from both message and name inputs.

### More complex XSS attempt

An other way to exploit a XSS breach is to submit HTML tags that allow to run code on their attributes, such as the `<img />` tag and its `onload` and `onerror` attributes.

We insert the more complex XSS attempt in both inputs

```html
<img src=a onerror=alert("XSS")>
```

There we go, on the page reload the name of the user that wrote the feedback is interpreted as HTML and the code for `onerror` attribute gets executed, causing an alert modal to be displayed.

Here's a part of the HTML code of the page after we inserted our malicious code:

```html
<td>
    Name : 
    <img src="a" onerror="alert(&quot;XSS&quot;)">
</td>
```

But... no flag is returned by the server.

After a lot of attempts, it turns out that we just have to fill one of the inputs with `script` for the server to return the flag.

## How to exploit the breach

From the moment a hacker is able to run code in the browser of all other users that will visit the feedback page. It unlocks a lot of possibilities for hackers.

Here are a few things a hacker could do to one of these users:

- Redirecting the user outside the website to an evil phishing reproduction website, where the user could enter personal information without noticing it's a trap
- Stealing user's authentication cookie, allowing the hacker to act on the behalf of the user
- Reading the content of pages to steal personal information
- Anything that can be executed in JavaScript inside a browser can now be executed by the hacker, and there is a lot more of mean things to do...

## How to avoid the breach

To prevent XSS, all content submitted by users should be escaped before being displayed to any user.

Depending on your stack, your framework might already help with preventing XSS.

Client frameworks, like React or Vue, as well as server frameworks, like Laravel, escape text content by default.

See documentation about injections for different frameworks and languages:

- [Vue](https://vuejs.org/guide/best-practices/security.html#potential-dangers)
- [PHP](https://www.php.net/manual/en/function.htmlspecialchars.php) (PHP has a built-in function to escape HTML characters)
- [Laravel](https://laravel.com/docs/9.x/blade#displaying-data)
