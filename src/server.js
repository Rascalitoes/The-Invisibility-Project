const express = require('express');
const app = express();
const url = require('url');
const https = require('https');
const mongoClient = require('mongodb').MongoClient;
var cors = require('cors');

//I used the tutorial at https://rapidapi.com/blog/build-rest-api-node-js-express-mongodb/ to create this

//create basic server and implement handling different requests
const port = 2000;
app.listen(port,function(){
    initialize();
    console.log(`listening on ${port}`);
});

function initialize(){
    //by default, MongoDB is set up to port 27017 when you run it locally. This will be different when deploying the Db on a server
    const uri = "mongodb://127.0.0.1:27017";
    
    const client = new mongoClient(uri, {useNewUrlParser:true, useUnifiedTopology:true});

    client.connect(err => {
        if (err){
            console.log("error");
            console.log(err);
            client.close();
        }
        //Using Express.js 
        else{
            console.log("connected to db");
            const geoCollection = client.db("invis1").collection("invis_test_2");
            app.use(cors());
            app.post('/', function(req,res){
                console.log("in POST");
                const parsedURL = url.parse(req.url, true);
                console.log(req.query.author+" | "+req.query.source+" | "+req.query.quote);
                handleCreate(req.query.author,req.query.source,req.query.quote,res,geoCollection); 
            });

            app.get('/show',function(req,res,next){
                console.log("in GET");
                handleShow(res,geoCollection);
                /*
                res.setHeader('content-type','Application/json');
                res.setHeader('Access-Control-Allow-Origin','*');
                res.setHeader('Access-Control-Allow-Credentials','true');
                res.statusCode = 200;
                //create an array from the map
                console.log("sending...");
                res.json([{"Author":"Amelia","Text_source":"Earhart","Quote":"In photography, if you are constantly moving in a long exposure, you are rendered essentially invisible. "}]);
                */
            });
        }
    });
}

function handleCreate(author,source,quote,res,dbCollection){
    //call geolocation api and get the details
            data = {"Author":author,"Text_source":source,"Quote":quote};
            dbCollection.insertOne(data)
            .then((result,error) => {
                if(error){
                    console.log(error);
                }
            }).catch(error => console.error("error"))
            // set the header and status code success and return the details of the ip
            res.set('content-type','Application/json');
            res.statusCode = 200;
            res.end(`record created: ${author}, ${source}, ${quote}`);
}

function handleShow(res,db){
    db.find({},{projection:{_id:0}}).toArray()
    .then(results =>{
        //set the header and status
        res.setHeader('content-type','Application/json');
        res.setHeader('Access-Control-Allow-Origin','*');
        res.setHeader('Access-Control-Allow-Credentials','true');
        res.statusCode = 200;
        //create an array from the map
        res.send(JSON.stringify(results));
    })
    .catch(error => console.error(error))
}

/*
function handleShow(res,db){
    //db.find({},{projection:{_id:0}}).toArray()
    //.then(results =>{
        //set the header and status
        res.setheader('content-type','Application/json');
        res.setHeader('Access-Control-Allow-Origin','*');
        res.setHeader('Access-Control-Allow-Credentials','true');
        res.statusCode = 200;
        //create an array from the map
        console.log("sending...");
        return res.send([{"Author":"Amelia","Text_source":"Earhart","Quote":"In photography, if you are constantly moving in a long exposure, you are rendered essentially invisible. "}]);

    //})
    //.catch(error => console.error(error))
}
*/

function handleUpdate(ipAddress,res,db){
    //call geolocation api and get the details
    var query = {ip:ipAddress};
    db.find(query,{projection:{_id:0}}).toArray()
    .then(results => {
        if(results.length > 0){
            getGeolocation(ipAddress)
            .then(response =>{
                updateRecord(response,db);
                res.setHeader('content-type','Application/json');
                res.statusCode = 200;
                var time = new Date();
                var respJson = {"ip":response.ip,"country":response.country,"city":response.city,"lastUpdated":time}
                res.end("record updated : "+ JSON.stringify(respJson));
            },
                error => {
                    res.statusCode = 400;
                    res.end(error);
                })
        }
        else{
            //ip not found
            res.statusCode = 400;
            res.send(`Read: ${ipAddress} not found`);
        }
    });
}

function handleRead(ipAddress,res,db){
    var query = {ip: ipAddress};
    db.find(query,{projection:{_id:0}}).toArray()
    .then(results => {
        if(results.lenth >0){
            console.log("results:");
            console.log(results);
            res.setHeader('content-type','Application/json');
            res.statusCode = 200;
            res.send(JSON.stringify(results));
        }
        else{
            //ip not found
            res.statusCode = 400;
            res.send(`ReadL ${ipAddress} not found`);
        }
    });
}

function handleDelete(ipAddress,res,db){
    //check if ip is in the table
    var query = {ip:ipAddress};
    db.deleteOne(query,function(err,obj){
        if(err){
            res.statusCode = 400;
            res.send(`Delete: ${ipAddress} not found`);
        }
        //n in results indicates the number of records deleted
        if(obj.result.n == 0){
            res.statusCode = 400;
            res.send(`Delete: ${ipAddress} not found`);
        }
        else{
            res.statusCode = 200;
            res.send(`record deleted: ${ipAddress}`);
        }
    });
}

function getGeolocation( ipAddress ) {
    // initilize http.rquest object
    var req = https.request;
    // initialize header with the required information to call geolocation api. 
    var header = {
            "x-rapidapi-host": "ip-geolocation-ipwhois-io.p.rapidapi.com",
            "x-rapidapi-key": "f9591de09dmsh8ad03cfe6c5144ep1fcbadjsnce3f3695820f",
            "useQueryString": true
        };
    // add the query string including the IP address
    var query_string = { "ip" : ipAddress };
    // set the options parameter
    var options = {
                    headers: header,
                    query: query_string
                };
    // form the url
    const url =  rapidAPIBaseUrl + ipAddress ;
    return new Promise ( ( resolve, reject) => {
                        
            https.get( url, options, res  => {
               
                let data = "";
                 //data is received in chunks, so uppend data as and when received
                res.on( 'data', function(response) {
                    data = data + response;
                });
                // handle error if any
                res.on( 'error', function(err) {
                    console.log("Error");
                    console.log(err);
                })
                // if end of data return the final chunk
                res.on( 'end', () => {
                    resolve(  JSON.parse(data) ); 
                });
            });//Endn of http
    }); //end of return promise
}//End of getGeolocation

function insertRecord(entry,geoCollection){
    // get current date to update last update the time
    var time = new Date();
    // add the entry to table ip is the key and country, city and last updated time are stored
    data = {"ip":entry.ip,"country":entry.country,"city":entry.city,"lastUpdated":time}
    geoCollection.insertOne(data)
    .then((result,error) => {
        if(error){
            console.log(error);
        }
    }).catch(error => console.error("error"))
    
}

function updateRecord(entry,geoCollection){
    // get current date to update last updated time
    var time = new Date();
    // add the entry to table ip is the key and country, city and last updated time are stored
    var query = {"ip":entry.ip}
    data = { $set : {"ip":entry.ip,"country":entry.country,"city":entry.city,"lastUpdated":time}}
    geoCollection.updateOne(query,data)
    .then((result,error) => {
    })
    .catch(error => console.error("error"))
}