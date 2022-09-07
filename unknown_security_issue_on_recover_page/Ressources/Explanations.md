#  UNKNOWN SECURITY ISSUE ON THE RECOVER PASSWORD FORM PAGE

From the page `http://IP/?page=recover`.
Inspect the page and search for the following html tag:

```html
<input type="hidden" name="mail" value="webmaster@borntosec.com" maxlength="15">
```
Here we can find the admin email, staticaly defined in the client code. By changing the html element value attribute by an email address we have acess to, we could intercept the recovering password request email. By doing so and pressing submit button, the server returns a page containing the flag.

## Solution:

A solution would be for the form to hit a server endpoint that securily stores the admin email inside the server and not the client.
Never trust the client. 