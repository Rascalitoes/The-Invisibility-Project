# The Invisibility Project

This is a MERN project (MongoDB, Express.js, ReactJS, Node.js) \
The various installation instructions can be seen here:

## Versions used
Mongo   --  4.4.6 \
Express --  4.17.1 \
React   --  17.0.1 \
Node    --  14.15.1

## Setting up the project to run on your local machine
* At `src/Services/API.js`, the `fetch` at line 6 should fetch from http://localhost:2000 \
  `return fetch(http://localhost:2000/${pathname}${queries})`
  
* Set up your database. At `src/Services/credentials.js`, change the `db` variable to the name of the database you wish to access.
* #### If using Mongo Atlas:
  * At `src/Services/credentials.js`, change the `User` variable to your Mongo Atlas Project username and password
  * If you plan on saving this file, make sure you don't save it in a place where other people can access this file and your passwords
* #### If using Mongo Community (or other local instance):
  * At `src/Services/server.js`, set your uri variable on line 52 to your local Mongo port (mongodb://127.0.0.1:27017) by default
    * `const uri = "mongodb://127.0.0.1:27017"`
* To **add email functionality**, navigate to `src/Services/credentials.js` and edit the `mailInfo` variable. 
* If you **do not wish to recieve emails** while running the project, navigate to `src/services/controllers/quote.controller.js` and comment out the line `.then(ID => email.data.sendAllMail(data,ID))`


## Running the project on your local machine

* ### *Backend*
  In the project directory, navigate to `src/Services` \
  Run the server with `node server.js` \
  By default, the server can be accessed at [http://localhost:2000](http://localhost:2000) (It'll just be a blank page) \
  If your server runs on a different port, change the port variable (line 38) at `src/Services/server.js` to your port
    * `const port = xxxx`
    
  Once you see the following two messages: \
  `listening on xxxx` \
  `connected to db` \
  You can continue to the next step

* ### *Frontend*
  In a separate terminal, navigate to the project directory and run the React frontend with `npm start` (this may take a while)\
  Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
