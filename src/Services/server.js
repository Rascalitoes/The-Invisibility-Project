const express = require('express');
const app = express();
const url = require('url');
const https = require('https');
const mongoClient = require('mongodb').MongoClient;
var cors = require('cors');
const { User } = require('./credentials.js');
const mongoose = require('mongoose');
let quotes = require('./controllers/quote.controller.js');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/*
 * The way this whole thing works, is a little complicated, I used tutorials from the following:
 * https://rapidapi.com/blog/build-rest-api-node-js-express-mongodb/
 *  ^-- this site helped me build an Express.js backend to communicate with MongoDB
 * https://rapidapi.com/blog/create-react-app-express/
 *  ^-- this site helped me connect the backend(Express.js) with the frontend(React.js)
 * https://www.freecodecamp.org/news/create-a-react-frontend-a-node-express-backend-and-connect-them-together-c5798926047c/
 *  ^-- this site helped me troubleshoot problems I was having with CORS
 */

/*********** THE EXPLANATION ***********/
/*
 * Please consult the setup comments at componentDidMount() in src/App.js first
 * If you want a more professional explanation, please consult https://rapidapi.com/blog/create-react-app-express/
 * 
 * 1. When someone opens the invisibility project page, the React frontend sends a GET request
 *     to the Express.js backend. Express.js is built for backend and has libraries that can easily
 *     handle API requests (GET, PUT, DELETE, etc.)
 * 2. Express.js sees the React request (at /show for example), and then sends a corresponding 
 *     request to the MongoDB database.
 * 3. If this is a GET request, MongoDB then sends the information to the Express.js backend, which
 *     is then updated as JSON form at the /show link (e.g. https://localhost:2000/show). Since this is
 *     originally where the React frontend thought it was requesting data from, React takes that data 
 *     and displays it as needed.
 */

//create basic server and implement handling different requests
//change the port as needed
const port = 2000;
app.listen(port, function () {
  initialize();
  console.log(`listening on ${port}`);
});

function initialize() {
  //By default, MongoDB is set up to port 27017 when you run it locally. I assume this will 
  //be different when deploying the Db on a server
  //Replace <password> with the password for the roscoebc user. Replace myFirstDatabase with 
  //the name of the database that connections will use by default. Ensure any option params are URL encoded.
  const username = User.username;
  const password = User.password;
  const db = "invis_test2"
  const uri = `mongodb+srv://${username}:${password}@cluster0.unw25.mongodb.net/${db}?retryWrites=true&w=majority`;

  //const client = new mongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log("connected to db");

      //Create an instance of the the MongoDB collection
      const invisCollection = mongoose.connection.collection("quotes");

      //cors() allows us to verify requests between frontent and backend
      app.use(cors());

      //retrieves ALL data from the database
      app.get('/show', function (req, res, next) {
        console.log("in GET");
        quotes.showAll(res);
      });

      //Using for testing, not to be used in final product
      app.get('/show/test', quotes.showOne);

      /*
      app.get('', function (req, res, next) {
        console.log("in GET qty");
        quotes.showRand(req, res);
      });
      */

      app.get('', quotes.showRand);

      //Work in progress
      //app.post('/post', quotes.postQuote);
      app.post('/process_get', function (req, res) {
        response = {
          author: req.body.author,
          quote: req.body.quote,
          source: req.body.source,
          date: req.body.date,
          keywords: req.body.keywords,
          user: req.body.user
        };
        console.log(response);
        res.end(JSON.stringify(response));
        quotes.postQuote(response);
      });
    }).catch(err => {
      console.log("error");
      console.log(err);
      process.exit()
    });
}

/*
 * Some important things to know for the following functions:
 *
 * res.statusCode is the HTTP status code. 200 means OK, 400 means Bad Request
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
 * 
 * res.setHeader changes the header. Headers allow the frontend to know
 * some extra infor such as content-type
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers
 */

function handleShow(res, collection, quantity = 0) {
  collection.find({}, { projection: { _id: 0 } }).toArray()
    .then(results => {
      //set the header and status
      res.setHeader('content-type', 'Application/json');
      res.statusCode = 200;
      //send the JSON data to be displayed and read by the frontend
      res.send(JSON.stringify(results));
    })
    .catch(error => console.error(error))
}

//$sample returns a random sample of documents back. If all documents are unique,
//then there will be no repeats.
function handleShowRand(res, collection, parsedURL) {
  let quantity = Number(parsedURL.query.qty);
  let keywords = parsedURL.query.keywords;
  collection.aggregate([{ $sample: { size: quantity } }]).toArray()
    .then(results => {
      //set the header and status
      res.setHeader('content-type', 'Application/json');
      res.statusCode = 200;
      //send the JSON data to be displayed and read by the frontend
      res.send(JSON.stringify(results));
    })
    .catch(error => console.error(error))
}




function handleCreate(author, source, quote, res, collection) {
  //call geolocation api and get the details
  data = { "Author": author, "Text_source": source, "Quote": quote };
  collection.insertOne(data)
    .then((result, error) => {
      if (error) {
        console.log(error);
      }
    }).catch(error => console.error("error"))
  // set the header and status code success and return the details of the ip
  res.setHeader('content-type', 'Application/json');
  res.statusCode = 200;
  res.end(`record created: ${author}, ${source}, ${quote}`);
}

function handleUpdate(ipAddress, res, collection) {
  //call geolocation api and get the details
  var query = { ip: ipAddress };
  collection.find(query, { projection: { _id: 0 } }).toArray()
    .then(results => {
      if (results.length > 0) {
        getGeolocation(ipAddress)
          .then(response => {
            updateRecord(response, collection);
            res.setHeader('content-type', 'Application/json');
            res.statusCode = 200;
            var time = new Date();
            var respJson = { "ip": response.ip, "country": response.country, "city": response.city, "lastUpdated": time }
            res.end("record updated : " + JSON.stringify(respJson));
          },
            error => {
              res.statusCode = 400;
              res.end(error);
            })
      }
      else {
        //ip not found
        res.statusCode = 400;
        res.send(`Read: ${ipAddress} not found`);
      }
    });
}

function handleRead(ipAddress, res, collection) {
  var query = { ip: ipAddress };
  collection.find(query, { projection: { _id: 0 } }).toArray()
    .then(results => {
      if (results.lenth > 0) {
        console.log("results:");
        console.log(results);
        res.setHeader('content-type', 'Application/json');
        res.statusCode = 200;
        res.send(JSON.stringify(results));
      }
      else {
        //ip not found
        res.statusCode = 400;
        res.send(`ReadL ${ipAddress} not found`);
      }
    });
}

function handleDelete(ipAddress, res, collection) {
  //check if ip is in the table
  var query = { ip: ipAddress };
  collection.deleteOne(query, function (err, obj) {
    if (err) {
      res.statusCode = 400;
      res.send(`Delete: ${ipAddress} not found`);
    }
    //n in results indicates the number of records deleted
    if (obj.result.n == 0) {
      res.statusCode = 400;
      res.send(`Delete: ${ipAddress} not found`);
    }
    else {
      res.statusCode = 200;
      res.send(`record deleted: ${ipAddress}`);
    }
  });
}

function insertRecord(entry, collection) {
  // get current date to update last update the time
  var time = new Date();
  // add the entry to table ip is the key and country, city and last updated time are stored
  data = { "ip": entry.ip, "country": entry.country, "city": entry.city, "lastUpdated": time }
  collection.insertOne(data)
    .then((result, error) => {
      if (error) {
        console.log(error);
      }
    }).catch(error => console.error("error"))

}

function updateRecord(entry, collection) {
  // get current date to update last updated time
  var time = new Date();
  // add the entry to table ip is the key and country, city and last updated time are stored
  var query = { "ip": entry.ip }
  data = { $set: { "ip": entry.ip, "country": entry.country, "city": entry.city, "lastUpdated": time } }
  collection.updateOne(query, data)
    .then((result, error) => {
    })
    .catch(error => console.error("error"))
}