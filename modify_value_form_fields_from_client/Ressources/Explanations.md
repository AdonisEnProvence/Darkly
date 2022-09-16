# Modify value of form fields from the client

## How we found the breach

From the page `http://IP/?page=recover`.
By inspecting the page we can find the following html tag:

```html
<input type="hidden" name="mail" value="webmaster@borntosec.com" maxlength="15">
```

This input is within a recover password form. Here we can find the admin email, staticaly defined in the client code. After modifying it's value and submitting the server returns a page containing the flag.

## How to exploit the breach

By changing the HTML element value attribute by an email address we have acess to, we could intercept the recovering password request email. Now we also know what is the email address of the webmaster!

## How to avoid the breach:

A solution would be for the form to hit a server endpoint that securily stores the admin email inside the server and not the client.

The email of the webmaster could also not be filled by default.
