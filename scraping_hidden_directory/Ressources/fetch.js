import got from 'got'
import * as cheerio from 'cheerio'
import { writeFile } from 'fs/promises'

async function* traverseDirectory(baseDirectory) {
    console.log(baseDirectory)
    const htmlPage = await got(baseDirectory).text()

    const $ = cheerio.load(htmlPage)

    const linksToDirectoriesToTraverse = []

    $('a').each((_index, element) => {
        const href = $(element).attr('href')

        if (href.startsWith('..') === false && href !== 'README') {
            linksToDirectoriesToTraverse.push(href)
        }
    })

    const currentDirectoryReadme = await got('README', { prefixUrl: baseDirectory }).text()

    yield currentDirectoryReadme

    for (const directoryToTraverse of linksToDirectoriesToTraverse) {
        yield* traverseDirectory(baseDirectory + directoryToTraverse)
    }
}

const readmeFilesContent = []

for await (const readmeFileContent of traverseDirectory('http://192.168.56.101/.hidden/')) {
    readmeFilesContent.push(readmeFileContent)
}

await writeFile('./results.txt', readmeFilesContent.join(''))
