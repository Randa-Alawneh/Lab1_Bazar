//WE run this file just once time, in order to create catalalog database and fill it with information
const fs = require("fs");//include fs module 
const sqlite3 = require("sqlite3").verbose();//import sqlite3 in order to use alot of features of sqlite3 
const filepath = "./Catalog1.db";//Path of DATABASE
function connectToDatabase() { // Function to connect with database
// if Catalog.db was not found create it   
if (fs.existsSync(filepath)) { 
return new sqlite3.Database(filepath);
}
// if Catalog.db was found then open it to create table and to insert the all book information 
else{
const db = new sqlite3.Database(filepath, (error) => {
if (error) {
return console.error(error.message);}
createTable(db);// Function to create table in catalog database
insertvalue(db);//Function to insert value in table in catalog database
console.log("Connected to the database successfully");
    });
return db;
  }}
function createTable(db) {
 //Qurey of Creating table in sqlite database
  db.exec(`
  CREATE TABLE BOOK
  (
    ID         int,
    Topic  VARCHAR(20),
    Name   VARCHAR(30),
    Amount        int,
    Cost          int  
  )`);}
function insertvalue(db) {
 //Qurey of insert values on table in sqlite   
    db.exec(`
    INSERT INTO BOOK (ID ,Topic,NAME,Amount,Cost) VALUES (1,"distributed systems","How to get a good grade in DOS in 40 minutes a day",33,20),
   (2,"distributed systems","RPCs for Noobs",72,30),
   (3,"undergraduate school","Xen and the Art of Surviving Undergraduate School",65,50),
   (4,"undergraduate school","Cooking for the Impatient Undergrad",59,100)    
  `);}
module.exports = connectToDatabase();