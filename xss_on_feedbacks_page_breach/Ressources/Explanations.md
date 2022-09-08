# XSS Breach on feedbacks page

From the page `http://IP/?page=feedback`, where you can find a form regrouping two text input:

The feedback name and message.
After submitting a feedback it appears on the page's bottom.

## Submitting html content

The first attempt on XSS exploit would be to try adding script tag inside one of the input.

Note:
To be able to insert long message content inside the name input it's necessary to modify it's maxlength attritube
```html
<input name="txtName" type="text" size="30" maxlength="10">

<!-- To -->

<input name="txtName" type="text" size="30" maxlength="4200">
```

Then we add in both input the following XSS attack:
```html
<script>
    alert("XSS")
</script>
```

Thing is that the server looks like he's escaping the script tags from both the message and name inputs.

## More complex XSS attempt

An other way to exploit an XSS breach is to submit html tags that allows to run code on their attribute, such as the <img> and it's `onload` nor `onerror` attribute.

We insert the more complex XSS attempt in both inputs

```html
<img src=a onerror=alert("XSS")>
```

There we go, on the page reload the feedback name is interpreted as `html` and executes the `onerror` code, that leads to displaying an alert modal.

But... no flag is returned by the server.

After a lot of attempts, it turns out that we just have to fill one of the input with `script` for the server to returns the flag.

## Solution:

A solution would be to escape or use HTML Sanitization on any content you receive from the client.
