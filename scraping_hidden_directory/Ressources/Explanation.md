`/robots.txt` and `/sitemap.xml` are files usually used on websites. There was not a `sitemap.xml` file, but there was a `robots.txt` that contained the following text:

```txt
User-agent: *
Disallow: /whatever
Disallow: /.hidden
```

`robots.txt` is read by bots that crawl websites for indexation, like Google Bot. It can be used to customize which pages should be indexed by which bots.

Here the configuration means that bots should not index the content of two directories: `/whatever` and `/.hidden`.

If we go to `/.hidden` directory, we discover the content of the directory listed, which is made of some other directories, and one `README` file. When going recursively to subdirectories, we see that all of them contain a `README` file, with random sentences.

We wrote a script to scrap all `README` files, and that concatenates their content in one big file.

To determine if one of these `README` contains a flag, we filtered lines by a regex matching when finding at least one digit (hashes contain digits, not random sentences which are plain words).

Only one line contains a number, and it's the line with the flag.

## How to use script

Install dependencies:

```bash
npm ci
```

Fetch content of all `README`s and assemble them:

```bash
node fetch
```

Find the line that contains at least one digit:

```bash
node post-processing
```
