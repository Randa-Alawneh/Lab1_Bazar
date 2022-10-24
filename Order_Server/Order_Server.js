//The Express package is a structure for Node applications used for supporting the Node.js foundation of the microservice.
//Using Express to create server running on specific port + Express JS makes it super simple to build route
const express = require("express");
const app = express();//Create instanse of Express to use it 
const superagent = require('superagent');
//Start Order Sever at 4000 port also we print the statement when the server start up
app.listen(4000,()=>{
console.log("Order Server is listening at port 4000");
});
const sqlite3 = require('sqlite3');
  
 // Connecting  SQlite Database
let db = new sqlite3.Database("./Order.db" , (err) => {
    if(err) {
        console.log("Error Occurred - " + err.message);
    }
    else {
        console.log("DataBase Connected");
    }
})

//Handle post requst IPOrder:4000/purchase/id 
  app.post("/purchase/:id",(req,res)=>{
  let r=req.params.id;//Get id parameter 
  let dateTime = new Date();//current date
  //First,to handle purchase order we need to send request to catalog server, to check the amount of book+ to see if there is abook of this id
  superagent.get("http://localhost:5000/Amount/"+r).then(json=>{
if (json.text=="The Book Avalaible In Stock"){
  //add order to order database
   db.exec( 'insert into BOOK (ID,date) Values ('+r+',"'+dateTime+'")');
  //Update amount of book in catalog
   superagent
   .patch("http://localhost:5000/update/"+r).then()
 ;
    res.send("The book has been successfully ordered.");
  }
  else if (json.text=="The book is currently out of stock.") {
    res.send("The book is currently out of stock.");
  }
  else {
    res.send(json.text);
  }
  console.log(json.text);
}
  ) 
   });
     
  //Change localhost to ip address of catalog *-*



