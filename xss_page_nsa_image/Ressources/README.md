# XSS breach on media src pages

## How we found the breach

On the main page, we saw that the picture of the NSA contained a link, pointing to `/?page=media&src=nsa`.

We modified the `src` query parameter to `nsa2`, and discovered that the page contained an [`object`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/object) element, which `data` attribute was the value of the query parameter: `nsa2`. We tried `/` and saw the root page embedded.

On MDN documentation, we saw that `data` attribute of an `object` tag is the "address of the resource as a valid URL". We already knew that for `img` tag we could use a base64 encoded image as the `src`. We searched about the official name of this kind of practice, and found on MDN [a page about *Data URLs*](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URLs).

By reading the page, we saw an example they provide:

```txt
data:text/html,<script>alert('hi');</script>
```

We tried to use this data URL as the `src` query parameter, the alert was displayed but we did not find the right answer. (<http://192.168.56.101/?page=media&src=data:text/html,%3Cscript%3Ealert(%27hi%27);%3C/script%3E>)

We decided to encode the HTML code into base64, as we would do for an image.

When we encode `<script>alert('hi');</script>` in base64, we end up with `PHNjcmlwdD5hbGVydCgnaGknKTs8L3NjcmlwdD4=`.

If this time we use the base64 encoded HTML code, it works! (<http://192.168.56.101/?page=media&src=data:text/html;base64,PHNjcmlwdD5hbGVydCgnaGknKTs8L3NjcmlwdD4=>). Do not forget to add `;base64` to let the browser know that it needs to decode the URL.

## How to exploit the breach

[See explanation on the document for the other XSS breach →](../../xss_on_feedbacks_page_breach/Ressources/README.md)

## How to avoid the breach:

[See explanation on the document for the other XSS breach →](../../xss_on_feedbacks_page_breach/Ressources/README.md)
