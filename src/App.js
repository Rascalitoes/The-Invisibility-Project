import React, { Component } from 'react';
import Card from './components/Card';
import Form from './components/Form';
import Filter from './components/Sidebar';
import './App.css';
import invisibilitylogo from "./InvisibilityLogo.png";
import { callAPI } from "./Services/API.js";


class App extends Component {
  constructor(props) {
    super();

    this.state = {
      entries: [],
      isLoaded: false
    }
  }

  componentDidMount() {
    /*
     * Call the API
     * In my local environment, two servers must be running. The Express server & the React server
     * React is running on http://localthost:3000, while Express is running on http://localhost:2000
     * To run the Express server, navigate to the-invisibility-project/src/Services and run node server.js 
     * in the command line. I don't need any special headers about access restrictions because I 
     * added the CORS library. To learn more about how this all works, please see src/Services/server.js
     */

    callAPI(5)
      .then(response => {
        console.log(response);
        this.setState({ entries: response });
        this.setState({ isLoaded: true });
      })
      .catch(err => console.log(err));
  }

  updateCards = name => {
    callAPI(1)
      .then(response => {
        console.log(response);
        this.setState({ entries: response });
        this.setState({ isLoaded: true });
      })
      .catch(err => console.log(err));
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
            <Filter onButtonPress={this.updateCards} />
          </div>

        </div>


      </div>
    )
  }

}

export default App;
