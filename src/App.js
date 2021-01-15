import React, { Component } from 'react';
import Card from './components/Card';
import Form from './components/Form';
import Filter from './components/Sidebar';
import './App.css';
import invisibilitylogo from "./InvisibilityLogo.png";

//This function is used in callAPI and formats the queries for the url
//The argument 'query' is a dictionary.
function addQueries(query={}){
  let returnString = "";
  //check for elements in dictionary, if there are any, prep for queries by adding '?'
    returnString += "?";
    for (var q in query){
      if(query[q]){
        returnString += (q + "=" + query[q] + "&");
      }
    }
    //Because my code is sloppy, delete the last '&' that was added
    returnString = returnString.slice(0,-1);
  return returnString;
}

class App extends Component {
  constructor(props) {
    super();

    this.state = {
      entries: [],
      isLoaded: false
    }
  }

  //callAPI only fetches (GET) data, it can't POST or PUT
  callAPI(quantity="/show",keywords="") {
    //replace localhost:2000 url with the URL where your database will live (e.g. http://robertglick.com/database/show)
    //Alternatively, you can go to package.json, and set "proxy":"http://robertglick.com", and fetch("/show")
    //You could write a function to randomize the this.state.entries array then store it in state for random card order, like in the original
    let queries = addQueries({"qty":quantity,"keywords":keywords});
    //quantity = quantity+""
    console.log(queries);
    fetch(`http://localhost:2000${queries}`)
      .then(response => response.json())
      .then(response => {
        this.setState({
          isLoaded: true,
          entries: response
        });
      })
      .catch(err => { console.log(err) });
  }

  componentDidMount() {
    /*
     * Call the API (at the moment, it simply returns all of the results, not a specific number)
     * In my local environment, two servers must be running. The Express server & the React server
     * React is running on http://localthost:3000, while Express is running on http://localhost:2000
     * To run the Express server, navigate to the-invisibility-project/src and run node server.js in the command line
     * I don't need any special headers about access restrictions because I added the CORS library.
     * To learn more about how this all works, please see src/server.js
     */
    this.callAPI(5,"apple, banana");
  }

  render() {
    return (



      <div id="wrapperContainer">
        <header>
          <img src={invisibilitylogo} height="120px" id="logo" alt="logo" />
          <p id="instruct">Click on the tiles to reveal METATEXT</p>

          <div className="invisibleDot">
            <button id="invisibleButton">[               .               ]</button>
          </div>


        </header>




        {/* A react quirk requires 'className' rather than 'class' like you'd find in HTML */}
        <div className="container">
          {this.state.entries ?
            //if true (entries exist in state), then map through the array of entries one by one and make a new Card element for each
            this.state.entries.map((entry, index) => {
              return <Card key={index} quote={entry.Quote} author={entry.Author} source={entry.Text_source} />
            })
            :
            //else, say:
            <p>No entries to display.</p>
          }

        </div>



        <div id="filters" className="container">

          <div>
            <Form />
            <Filter />
          </div>

        </div>


      </div>
    )
  }

}

export default App;
