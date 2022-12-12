//WE run this file just once time, in order to create catalalog database and fill it with information
const fs = require("fs");//include fs module 
const sqlite3 = require("sqlite3").verbose();//import sqlite3 in order to use alot of features of sqlite3 
const filepath = "./Order2.db";//Path of DATABASE
function connectToDatabase() { // Function to connect with database
  // if Order2.db was not found create it   
  if (fs.existsSync(filepath)) {
    return new sqlite3.Database(filepath);
  }
  
// if Order2.db was found then open it to create table 
  else {
    const db = new sqlite3.Database(filepath, (error) => {
      if (error) {
        return console.error(error.message);
      }
      createTable(db);// Function to create table in Order2 database
      console.log("Connected to the database successfully");
    });
    return db;
  }
}
function createTable(db) {
   //Qurey of insert values on table in sqlite   
  db.exec(`
  CREATE TABLE BOOK
  (
    ID         int,
    date      VARCHAR(50)  
  )
`);
}
module.exports = connectToDatabase();