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
//IP Address of Catalog Service1
const IPCatalog1='192.168.43.112';
//Port number of Catalog Service1
const PortCatalog1='5000';
//IP Address of Catalog Service2
const IPCatalog2='192.168.43.112';
//Port number of Catalog Service2
const PortCatalog2='6000';
//Ip Address of Order Services1
const IPOrder1='192.168.43.201';
//Port number of order Services1
const PortOrder1='4000';
//Ip Address of Order Services2
const IPOrder2='192.168.43.201';
//Port number of order Services2
const PortOrder2='3000';
var roundC=1;// Load Balancing to Catalog server using RoundRobin
var roundO=1;//Load Balancing to Order Server using RoundRobin
var result;
var cache=[];//Cache to cache the req and response

//TO ADD TO CACHE
function ADD (request){
var index;
if (cache.length<100){ //r caching features (limit on the number of items in the cache)  
  cache.push(request);
}
else { // if cache lenght over the limit then we need a cache replecment policy (LRU)
  let j=cache[0].N;index=0;
    for (var i=0;i<cache.length;i++){ //Search which item have used less in order to replace it by new item
     if (cache[i].N<j){
      j=cache[i].N;
      index=i;    
     }
    }
    console.log("Before:");
    console.log(cache);//Print the cahce before replacment
    console.log("index of items to remove:");
    console.log(index);
    cache.splice(index,1,request);//Replace
    console.log("After:");
    console.log(cache);//Print the cache after replacment 
} }
//TO search if req in cache or not 
function SEARCH(URI){
let data = cache.find(data => data.URI === URI); 
if (data==undefined){
console.log("NOT FOUND IN CACHE");
return 0;}
else{
console.log("Data Found In Cache:  ");
data.N=data.N+1;//increse the number of this data is used
console.log(data.Response);
result=data.Response;
return 1;
  }  }    
//THIS all lines to tell the frontend server how to handle a get or post request to the server.
//Handle GET requst localhost:3000/info/id + Notice Here We send thee id in the header
app.get("/info/:id",(req,res)=>{
let c=req.params.id; //Get the id parameter 
let u=`/info/${c}`;
let start = process.hrtime();//Timer Start
let r=SEARCH(u);//Search req in cache
if (r==1) res.send(result);///if found in cache send the result
 else { //else if not found Handle this request by make another request to catalog service+send ID in header
  //choice which catalog server will handle the req 
  if (roundC==1){ //Handle the req by make req to catalog server 1
    superagent
    .get('http://'+IPCatalog1+':'+PortCatalog1+'/info/'+c)
    .then(json => {res.send(json.text)//then send the Response
    let R={"URI":`/info/${c}`,"Response":json.text,"N":0};//add the req and res to the cache
    ADD(R);
    });
    roundC=2;
  }
  //Handle the req by make req to catalog server 1
  else {
    superagent
  .get('http://'+IPCatalog2+':'+PortCatalog2+'/info/'+c)
  .then(json => {res.send(json.text)//then send the Response
  let R={"URI":`/info/${c}`,"Response":json.text,"N":0};
  ADD(R);
  });
  roundC=1;
  }
 }
 let stop = process.hrtime(start);//Stop Timer
 console.log(`Time Taken to execute: ${(stop[0] * 1e9 + stop[1])/1e9} seconds`);
});
//Handle GET requst localhost:3000/info + Notice Here We send thee id in the body requst 
app.get("/info",(req,res)=>{
  let c=req.body.ID; //To access data submit in request body
  let u=`/info/${c}`;
  let start = process.hrtime();//Timer Start
  let r=SEARCH(u);
  if (r==1) res.send(result);
  else {
  //Handle this request by make another request to catalog service+send ID in the body 
  if (roundC==1){//send req to catalog1
  superagent
  .get('http://'+IPCatalog1+':'+PortCatalog1+'/info').send({ID:c})
  .then(json => {
   res.send(json.text);//then send the Response
   let R={"URI":`/info/${c}`,"Response":json.text,"N":0};
    ADD(R);});
    roundC=2;
  }
  else{ //send req to catalog2
    superagent
    .get('http://'+IPCatalog2+':'+PortCatalog2+'/info').send({ID:c})
    .then(json => {
     res.send(json.text);//then send the Response
     let R={"URI":`/info/${c}`,"Response":json.text,"N":0};
      ADD(R);});
      roundC=1;
    }
  }
  let stop = process.hrtime(start);
  console.log(`Time Taken to execute: ${(stop[0] * 1e9 + stop[1])/1e9} seconds`);
});
//Handle GET request localhost:3000/search/topic + Notice here we send the topic in the header
app.get("/search/:topic",(req,res)=>{
  let c=req.params.topic; //GET TOPIC PARAMETERT
  let u=`/search/${c}`;
  let start = process.hrtime();
  let r=SEARCH(u);
  if (r==1) res.send(result);
  else {
    //Handle this request by make another request to catalog service+send topic in the header
    if(roundC==1){//send req to catalog1
    superagent
    .get('http://'+IPCatalog1+':'+PortCatalog1+'/search/'+c).send({RC:2})
    .then(json => {res.send(json.text)//then send the response
    let R={"URI":`/search/${c}`,"Response":json.text,"N":0};
    ADD(R);
    });
    roundC=2;
  }
  else {//send req to catalog2
    superagent
    .get('http://'+IPCatalog2+':'+PortCatalog2+'/search/'+c).send({RC:1})
    .then(json => {res.send(json.text)
    let R={"URI":`/search/${c}`,"Response":json.text,"N":0};
    ADD(R);
    });
    roundC=1;
  }
}
let stop = process.hrtime(start)
 console.log(`Time Taken to execute: ${(stop[0] * 1e9 + stop[1])/1e9} seconds`);  
});
//Handle GET request localhost:3000/search + Notice here we send the topic in the body
app.get("/search",(req,res)=>{
  let c=req.body.topic; //GEt data submit in request body
  let u=`/search/${c}`;
  let start = process.hrtime();
let r=SEARCH(u);
if (r==1) res.send(result);
else {//Handle this request by make another request to catalog service + SEND topic in the body request
    if (roundC==1){ //send req to catalog1
  superagent
  .get('http://'+IPCatalog1+':'+PortCatalog1+'/search').send({topic:c,RC:2})
  .then(json => {res.send(json.text)
    let R={"URI":`/search/${c}`,"Response":json.text,"N":0};
    ADD(R);
});
roundC=2;
}
  else { //send req to catalog2
    superagent
    .get('http://'+IPCatalog1+':'+PortCatalog1+'/search').send({topic:c,RC:1})
    .then(json => {res.send(json.text)
      let R={"URI":`/search/${c}`,"Response":json.text,"N":0};
      ADD(R);
  });
  roundC=1;
  }
}  
let stop = process.hrtime(start);
 console.log(`Time Taken to execute: ${(stop[0] * 1e9 + stop[1])/1e9} seconds`);
});

// Handle post request localhost:3000/purchase/id
app.post("/purchase/:id",(req,res)=>{
let c=req.params.id; //GET ID parameter 
let start = process.hrtime();
//Handle this request by make post request to order server 
if (roundO==1){ //send req to order server1
  superagent
  .post('http://'+IPOrder1+':'+PortOrder1+'/purchase/'+c).send({RC:roundC})
.then(json=> res.send(json.text) ); roundO=2;}
else{ //send req to order server2
    superagent
    .post('http://'+IPOrder2+':'+PortOrder2+'/purchase/'+c).send({RC:roundC})
  .then(json=> res.send(json.text) ); roundO=1;   
}
let stop = process.hrtime(start);
 console.log(`Time Taken to execute: ${(stop[0] * 1e9 + stop[1])/1e9} seconds`);
     });

//Handle put req ,if data in the cache are invalid
app.put("/invalidR/:id",(req,res)=>{
let start = process.hrtime();
let c=req.params.id; //GET ID parameter 
let u=`/info/${c}`;
const index = cache.findIndex((element) => element.URI === u);//search 
if (index>-1){
console.log(index);
cache.splice(index,1);
console.log(cache); res.send("DONE");
}
else 
res.send("N");
let stop = process.hrtime(start);
console.log(`Overhead of cache consistency: ${(stop[0] * 1e9 + stop[1])/1e9} seconds`);
         });

//Note localhost mean here ip address of front end server       