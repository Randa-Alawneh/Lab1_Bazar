//The Express package is a structure for Node applications used for supporting the Node.js foundation of the microservice.
//Using Express to create server running on specific port + Express JS makes it super simple to build route
const express = require("express");//Require Express
const app = express();//Create instanse of Express to use it 
//In order to make request,We use SuperAgent (To send requst to Catalog Service + Order Service)
const superagent = require('superagent');
//When we use Super Agent we need body parser backege to make it easy to send data with request (send data in body)
const bp = require('body-parser');
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
//Start FrontEnd Sever at 3000 port also we print the statement when the server start up 
app.listen(3000,()=>{
console.log("FrontEnd Services is listening at port 3000");
});
//IP Address of Catalog Service
const IPCatalog='192.168.43.112';
//Port number of Catalog Service
const PortCatalog='5000';
//Ip Address of Order Services
const IPOrder='192.168.43.201';
//Port number of order Services
const PortOrder='4000';
// THIS all lines from 24-to end to tell the frontend server how to handle a get or post request to the server.
//Handle GET requst localhost:3000/info/id + Notice Here We send thee id in the header
app.get("/info/:id",(req,res)=>{
  let c=req.params.id; //Get the id parameter 
  //Handle this request by make another request to catalog service+send ID in header
  superagent
  .get('http://'+IPCatalog+':'+PortCatalog+'/info/'+c)
  .then(json => res.send(json.text));//then send the Response
});
//Handle GET requst localhost:3000/info + Notice Here We send thee id in the body requst 
app.get("/info",(req,res)=>{
  let c=req.body.ID; //To access data submit in request body
  //Handle this request by make another request to catalog service+send ID in the body 
  superagent
  .get('http://'+IPCatalog+':'+PortCatalog+'/info').send({ID:c})
  .then(json => 
   res.send(json.text));//then send the Response
});
//Handle GET request localhost:3000/search/topic + Notice here we send the topic in the header
app.get("/search/:topic",(req,res)=>{
  let c=req.params.topic; //GET TOPIC PARAMETERT
  //Handle this request by make another request to catalog service+send topic in the header
  superagent
  .get('http://'+IPCatalog+':'+PortCatalog+'/search/'+c)
  .then(json => res.send(json.text));//then send the response
});
//Handle GET request localhost:3000/search + Notice here we send the topic in the body
app.get("/search",(req,res)=>{
  let c=req.body.topic; //GEt data submit in request body
  //Handle this request by make another request to catalog service + SEND topic in the body request
  superagent
  .get('http://'+IPCatalog+':'+PortCatalog+'/search').send({topic:c})
  .then(json => res.send(json.text));
});
// Handle post request localhost:3000/purchase/id
app.post("/purchase/:id",(req,res)=>{
  let c=req.params.id; //GET ID parameter 
  //Handle this request by make post request to order server 
  superagent
  .post('http://'+IPOrder+':'+PortOrder+'/purchase/'+c)
.then(json=> res.send(json.text) );
     });
