import React, { Component } from 'react';
import Card from './components/Card';
import Form from './components/Form';
import Filter from './components/Sidebar';
import './App.css';
import invisibilitylogo from "./InvisibilityLogo.png";
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

//import data from "./data.json";


class App extends Component {
  constructor(props) {
    super();

    this.state = {
      entries: [],
      isLoaded: false
    }
  }

  //callAPI only fetches (GET) data, it can't POST or PUT
  callAPI(quantity = "/show") {
    //replace localhost:2000 url with the URL where your database will live (e.g. http://robertglick.com/database/show)
    //Alternatively, you can go to package.json, and set "proxy":"http://robertglick.com", and fetch("/show")
    //You could write a function to randomize the this.state.entries array then store it in state for random card order, like in the original
    if (quantity !== "/show") {
      quantity = "?qty=" + quantity;
    }
    fetch(`http://localhost:2000${quantity}`)
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
    this.callAPI(12);
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


        {/*<Container fluid>*/}
          <Row>
            {/* A react quirk requires 'className' rather than 'class' like you'd find in HTML */}
            <Col xs = {8} id = "cards" className="container">
              {this.state.entries ?
                //if true (entries exist in state), then map through the array of entries one by one and make a new Card element for each
                this.state.entries.map((entry, index) => {
                  return <Card key={index} quote={entry.Quote} author={entry.Author} source={entry.Text_source} />
                })
                :
                //else, say:
                <p>No entries to display.</p>
              }

            </Col>



            <Col id="filters" className="container">

              <div>

                <Form />
                <Filter />

              </div>

            </Col>
          </Row>
        {/*</Container>*/}

      </div>
    )
  }

}

export default App;
