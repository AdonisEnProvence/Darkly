# I_am_admin cookie breach

## How we found the breach

From anywhere on the website, by inspecting the element you can have access the app's cookies.

Where we can found:

```
I_am_admin	68934a3e9455fa72420237eb05902327
```

By googling `68934a3e9455fa72420237eb05902327` it results as the md5 hashed of `false`. Then by hashing `true` we get `b326b5062b2f0e69046810717534cb09`. Thanks to your browser devtool we change the cookie value by the hased `true` and refresh.

There we go the website renders an alert modal containing a flag.

## How to exploit the breach

From what we could have seen on this website nothing in particular.
But on common webapp being able to determine how are hashed cookies, can be really usefull if you wanna corrupt a user's local cookies.
Such as, on an marketplace, a current cart status modifying what the user would be buying.

## How to avoid the breach

Let's say we want to store in a cookie the list of products selected by a user on an e-commerce website.

The user selects three products, referenced by their ids:

```txt
[1, 2, 3]
```

We store in the cookie this list server-side. We use [`Set-Cookie`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie) header to set cookies from the server:

```txt
Set-Cookie: products=[1,2,3]
```

But this cookie is absolutely not secure, and its content is subject to XSS attacks!

### The Signed cookie

First, the content of the cookie can be *signed*. The server signs the content, and adds a signature at the end of the cookie. After, when the server reads the cookie during a subsequent request, it ensures that the value hasn't been changed, as if signed again the value of the cookie and the signature should be the same. The value is still stored in plain text in the cookie. Sensitive information must not be stored there.

```txt
Set-Cookie: products=[1,2,3].<signature>
```

### The Encrypted cookie

Second, the content of the cookie can be *encrypted*, using a secret key. When the cookie is created, its value is first encrypted using a key, and then put in the cookie. When the cookie is read, the content is first decryted by using the same key. Sensitive information can now be stored in the cookie as they are no longer stored in plain text: the private key is needed to read the content.

```txt
Set-Cookie: products=AYjA/rwOiMhnaQzzqg33yAHzn7m6JOqBDOTUylpxGrqO9Q+bvExCapX1IyHmZunWzJKCcJDvSeHuKFhSnaZhhUn4A2M1K6jERXRQF2FhIlGpPwTQJlk1tgxGCHd7jBmzrEZbrqDopwdxx+gPXi9AR36vBablJWWerc7UNC4Nr54=
```

### HttpOnly attribute

Using `HttpOnly` attribute will prevent `JavaScript` access to the cookie, as for example during an XSS attack. Only server can read and modify the cookie.

```txt
Set-Cookie: products=[1,2,3]; HttpOnly
```

### Secure attribute

Using the `Secure` attribute ensures that the cookie will only be sent for HTTPS requests (made to load images, for requests made with `fetch`, etc.).

This will prevent [MitM attack](https://developer.mozilla.org/en-US/docs/Glossary/MitM)

```txt
Set-Cookie: products=[1,2,3]; Secure
```

### SameSite attribute

Using the `SameSite` attribute will prevent sending scoped cookies to an unwanted other domain.

As for example during an [CSRF](https://developer.mozilla.org/en-US/docs/Glossary/CSRF) attack.

By default, modern browsers use `SameSite=Lax` for cookies that do not configure this attribute to help with mitigating CSRF attacks.

```txt
Set-Cookie: products=[1,2,3]; SameSite=Strict
```
