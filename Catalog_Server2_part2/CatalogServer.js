//The Express package is a structure for Node applications used for supporting the Node.js foundation of the microservice.
//Using Express to create server running on specific port + Express JS makes it super simple to build route
const express = require("express");
const app = express();//Create instanse of Express to use it 
// read body request in express
const bp = require('body-parser');
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
//Start Catalog Sever at 6000 port also we print the statement when the server start up
app.listen(6000,()=>{
console.log("Catalog Server is listening at port 6000");
});
// Connecting  SQlite Database
const sqlite3 = require('sqlite3');
let db = new sqlite3.Database("./Catalog2.db" , (err) => {
    if(err) {
        console.log("Error Occurred - " + err.message);
    }
    else {
        console.log("Catalog DataBase Connected");
    }
})
// THIS all lines from 27-to end to tell the catalog server how to handle a get or post request to the server from frontend or order server.
//Handle GET requst IPcatalog:6000/info/id + Notice Here We send thee id in the header
app.get("/info/:id",(req,res)=>{
 let r=req.params.id;//Get id parameter
 var selectQuery = 'SELECT * FROM BOOK where ID=' +r+' ;'// //Qurey of select info of book with unique id  in sqlite   
 db.all(selectQuery , (err , data) => { //Check the return data from query
     if(err) return;
     //IF there is a data about this book then get it and send it to front end server
     if (data.length>0){
        //Take the json data then send it in nice way 
     let INFO="Information About Book#"+r+"\n"+
     "TOPIC:"+data[0].Topic+", NAME:"+data[0].Name+", QUNTITY: "+data[0].Amount+", COST: "+data[0].Cost;
     res.send(INFO);
     console.log(INFO);//print send data to frontend on Catalog server consle
    }
     //if there is no data about book, no book have this id,print massage of that 
     else {
      let INFO="There's no book with this id, please check the id and try again."
    res.send(INFO);
    console.log(INFO);//print send data to frontend on Catalog server consle
    }
    
 });   
});
//Handle GET requst IPcatalog:6000/info + Notice Here We send thee id in the body
app.get("/info",(req,res)=>{
    let r=req.body.ID;//get id from body request *Different between this get and previous get*
    var selectQuery = 'SELECT * FROM BOOK where ID=' +r+' ;'
    db.all(selectQuery , (err , data) => {
        if(err) return;
        if (data.length>0){
   let INFO="Information About Book#"+r+"\n"+
   "TOPIC:"+data[0].Topic+", NAME:"+data[0].Name+", QUNTITY: "+data[0].Amount+", COST: "+data[0].Cost;
        res.send(INFO); console.log(INFO);}
        else {
            let INFO="There's no book with this id, please check the id and try again."
            res.send(INFO); console.log(INFO);
        }
       
    });
      
   });
//Handle GET requst IPcatalog:6000/Search/topic + Notice Here We send thee topic in the header
app.get("/search/:topic",(req,res)=>{
   let r=req.params.topic;//get topic value
   var selectQuery = 'SELECT * FROM BOOK where Topic="'+r+'" ;'//select info based on topic in sqlite query
   db.all(selectQuery , (err , data) => {
       if(err) return;
    //If there is a data , take it and send it in nice format to front end sever
       if (data.length>0){
  let INFO="All Book Belong to "+r+"Topic"+"\n";
  //For loop with number of book have this topic
  for (let i=0;i<data.length;i++){
INFO=INFO+"Book ID:"+data[i].ID+", Book Name :"+data[i].Name+"\n";
  }
       res.send(INFO);
       console.log(INFO);//print info in catalog terminal
      }
      //if there is no data return 
       else {
        let INFO="There is no book belong to "+r+" Topic.";
        res.send(INFO); console.log(INFO);//print info in catalog terminal
       }
      
   });
     
  });

  //Same as above, but this handle search request when the topic send in the body
  app.get("/search",(req,res)=>{
    let r=req.body.topic;//get the topic from body request
    var selectQuery = 'SELECT * FROM BOOK where Topic="'+r+'" ;'
    db.all(selectQuery , (err , data) => {
        if(err) return;
        if (data.length>0){
   let INFO="All Book Belong to "+r+"Topic"+"\n";
   for (let i=0;i<data.length;i++){
 INFO=INFO+"Book ID:"+data[i].ID+", Book Name :"+data[i].Name+"\n";
   }
        res.send(INFO);
        console.log(INFO);}
        else {
            let INFO="There is no book belong to "+r+" Topic.";
            res.send(INFO);console.log(INFO);
        }
    });
      
   });
//Handle get requset from order sever , this need to response with Amount of book of this send id   
app.get("/Amount/:id",(req,res)=>{
   let r=req.params.id;
   var selectQuery = 'SELECT Amount FROM BOOK where ID="'+r+'" ;'
   db.all(selectQuery , (err , data) => {
       if(err) return;
     //if there is data about this id,send amount of book to order sever        
       if (data.length >0){
        let x=data[0].Amount;
       if (parseInt(x)>0) {
        res.send("The Book Avalaible In Stock");
       }
      else {  res.send("The book is currently out of stock.");}}
      else { res.send("There is no book with this id, please check the id and try again.");}      
   });     
  });
//Handle patch requset from order sever , this for update amount of specific book  
  app.patch("/update/:id",(req,res)=>{
   let r=req.params.id;
 var updateQuery = 'update BOOK set Amount=Amount-1 where ID="'+r+'" ;'
        db.all(updateQuery , (err , data) => {
           if(err) { res.send("Error in update"); console.log("Error in update");;return;}
           else {res.send("Update Done");
           console.log("Update Done");}
             
       });     
  });





