# book-Task

GET /api/books/ - get all books from db 
params:
* ?limit=a,b - get books from a to b in from full list
* ?attributes=id,title...etc [field' name] - get only fields from query
* ?sort=date [field' name] - get sorted list by increase
* ?sortDESC= date [field' name] - get sorted list by decrease

GET /api/books/:id - get book by id

POST /api/books/add - add book to db 
requered body:
{ 
  author: 
    { firstName - string, 
      lastName-string 
      },
  title-string,
  description-string,
  image-base64 string 
}

DELETE /api/books/:id - delete book from db by id

# required env variables for db
    HOST,
    USER,
    PASSWORD,
    DATABASE,
    DB_PORT
    
# migrate db

>> cd db/
>> node migrate.js up/(down - roll back) migrations/1_Create_table_Authors.js
>> node migrate.js up/(down - roll back) migrations/2_Create_table_Books.js

# run application

>>npm install
>>npm start

