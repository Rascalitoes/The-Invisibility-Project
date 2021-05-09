const express = require('express');
const app = express();
const url = require('url');
const https = require('https');
const mongoClient = require('mongodb').MongoClient;
var cors = require('cors');
const { User } = require('./credentials.js');
const mongoose = require('mongoose');
let quotes = require('./controllers/quote.controller.js');
let keywords = require('./controllers/keyword.controller.js');
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
  const db = "invis_test3"
  const uri = `mongodb+srv://${username}:${password}@cluster0.unw25.mongodb.net/${db}?retryWrites=true&w=majority`;

  //const client = new mongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  //The extra fields after the uri are to prevent deprecated drivers and functions from being used
  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => {
      console.log("connected to db");

      //Create an instance of the the MongoDB collection
      const invisCollection = mongoose.connection.collection("quotes");

      //cors() allows us to verify requests between frontent and backend
      app.use(cors());

      //retrieves ALL data from the database
      app.get('/show', quotes.showAll);

      //retrieves a specified number of random documents
      app.get('', function(req,res){
        if(req.query.hasOwnProperty('terms')){
          quotes.searchFor(req,res)
        }
        else{
          quotes.showRand(req,res);
        }
      });

      //Work in progress
      //app.post('/post', quotes.postQuote);
      app.post('/process_get', function (req, res) {
        response = {
          author: req.body.author,
          quote: req.body.quote,
          source: req.body.source,
          date: req.body.date,
          keywords: req.body.keywords,
          user: req.body.email
        };
        console.log(response);
        res.end(JSON.stringify(response));
        quotes.postQuote(response);
      });

      //Search functionality
      app.get('/search', quotes.searchFor)

      app.get('/keywords',keywords.findAllInspected);


    }).catch(err => {
      console.log("error");
      console.log(err);
      process.exit()
    });
}