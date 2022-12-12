//The Express package is a structure for Node applications used for supporting the Node.js foundation of the microservice.
//Using Express to create server running on specific port + Express JS makes it super simple to build route
const express = require("express");
const app = express();//Create instanse of Express to use it 
const superagent = require('superagent');
//When we use Super Agent we need body parser backege to make it easy to send data with request (send data in body)
const bp = require('body-parser');
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
//Start Order2 Sever at 3000 port also we print the statement when the server start up
app.listen(4000,()=>{
console.log("Order Server is listening at port 4000");
});
let RC;
const sqlite3 = require('sqlite3');
 //IP Address of Catalog Service1
const IPCatalog1='192.168.1.104';
//Port number of Catalog Service1
const PortCatalog1='5000';
//IP Address of Catalog Service2
const IPCatalog2='192.168.1.104';
//Port number of Catalog Service2
const PortCatalog2='6000'; 
//Ip Address of Order Services2
const IPOrder2='192.168.1.104';
//Port number of order Services2
const PortOrder2='3000';
//IP Address of FrontEnd Server
const IPFront='192.168.1.103';
//Port number of FrontEnd Server
const PortFront='3000';
 // Connecting  SQlite Database
let db = new sqlite3.Database("./Order1.db" , (err) => {
    if(err) {
        console.log("Error Occurred - " + err.message);
    }
    else {
        console.log("DataBase Connected");
    }
})

//Handle post requst IPOrder:3000/purchase/id 
  app.post("/purchase/:id",(req,res)=>{
  let r=req.params.id;//Get id parameter 
  RC=req.body.RC;
  let dateTime = new Date();//current date
if (RC==1){
  RC=2;
  //First,to handle purchase order we need to send request to catalog server, to check the amount of book+ to see if there is abook of this id
  superagent.get("http://"+IPCatalog1+":"+PortCatalog1+"/Amount/"+r).then(json=>{
if (json.text=="The Book Avalaible In Stock"){
  //add order to order database
  const gmt = new Date(dateTime).toUTCString()  ;
   db.exec( 'insert into BOOK (ID,date) Values ('+r+',"'+gmt+'")');
   superagent.post("http://"+IPOrder2+":"+PortOrder2+"/ADD").send({ID:r,date:gmt}).then();
  //Update amount of book in catalog
   superagent.patch("http://"+IPCatalog1+":"+PortCatalog1+"/update/"+r).then();
   superagent.patch("http://"+IPCatalog2+":"+PortCatalog2+"/update/"+r).then();
   superagent.put("http://"+IPFront+":"+PortFront+"/invalidR/"+r).then();
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
  ) }

  else {
    RC=1;
    //First,to handle purchase order we need to send request to catalog server, to check the amount of book+ to see if there is abook of this id
  superagent.get("http://"+IPCatalog2+":"+PortCatalog2+"/Amount/"+r).then(json=>{
    if (json.text=="The Book Avalaible In Stock"){
      //add order to order database
      const gmt = new Date(dateTime).toUTCString()  ;
       db.exec( 'insert into BOOK (ID,date) Values ('+r+',"'+gmt+'")');
       superagent.post("http://"+IPOrder2+":"+PortOrder2+"/ADD").send({ID:r,date:gmt}).then();
      //Update amount of book in catalog
       superagent.patch("http://"+IPCatalog2+":"+PortCatalog2+"/update/"+r).then();
       superagent.patch("http://"+IPCatalog1+":"+PortCatalog1+"/update/"+r).then();
       //Send invalid req to front to remove it from cahce
       superagent.put("http://"+IPFront+":"+PortFront+"/invalidR/"+r).then();
    
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
  }
   });
//Handle post req (Add the oder to another order server)
app.post("/ADD",(req,res)=>{
let r=req.body.ID;
let dateTime=req.body.date;
db.exec( 'insert into BOOK (ID,date) Values ('+r+',"'+dateTime+'")');
console.log("ADD DONE");
   });
     
  //Change localhost to ip address of catalog *-*



