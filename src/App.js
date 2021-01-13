import React, {Component} from 'react';
import Card from './components/Card';
import Form from './components/Form';
import Filter from './components/Sidebar';
import './App.css';
import invisibilitylogo from "./InvisibilityLogo.png";

//import data from "./data.json";


class App extends Component {
  constructor(props){
    super();
    
    this.state={
      entries: [],
      isLoaded:false
    }
  }

  callAPI(){
    fetch("http://localhost:2000/show")
    .then(response => response.json())
    .then(response => {
      this.setState({
        isLoaded: true,
        entries: response
      });
    })
    .catch(err => {console.log(err)});
  }

  componentDidMount() {
    // in my local environment, the server (PHP) is running on localhost:2000, while the frontend (React) is running on 3000
    // localhost:2000 and localhost:3000 are treated as different domains, and this header and the header in the php
    // document are telling the server that it's ok to request and send data from different domains (usually stopped by the CORS policy)

    //replace localhost:2000 url with the URL where your php endpoint will live (e.g. http://robertglick.com/getData.php)
    // if the domain name is different from where you're hosting this app, you'll need to replace the localhost:3000 address with the domain where this app lives
    // if they're on the same domain you should be able to omit the Access-Control bits and the line in the PHP
    this.callAPI();
    /*
    this.setState({
      isLoaded: true,
      entries: data
    });
    console.log(data);
    */

    // read all entities
    /*
    const [associations, setAssociations] = React.useState(null);
    fetch("http://localhost:2000/show", { 'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials':'true'})
    .then(response => console.log("Hello it's me ROSCOE"+Object.keys(response.json())))
    .then(response => response.json())
    .catch(err => {console.log(err)});
    //.then(body => setAssociations(body));
    
    /*
    .then(response => {
      this.setState({
        isLoaded: true,
        entries: response
      });
    })
    .catch(err => { console.log(err); 
    });
    */

    /*
    fetch("./data.json", { 'Access-Control-Allow-Origin': 'http://localhost:3000',
    'Access-Control-Allow-Credentials':'true'})
      .then(result => result.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            entries: result
          });
          console.log(result);
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
          console.log("There was an error loading the data");
        }
      )
      */
  }

  // you could write a function to randomize the this.state.entries array then store it in state for random card order, like in the original

  render() {
    return(
      
       
        
    <div id="wrapperContainer">
        <header>
          <img src ={invisibilitylogo} height="120px" id = "logo" alt="logo" />
          <p id ="instruct">Click on the tiles to reveal METATEXT</p>

            <div className="invisibleDot">
                <button id="invisibleButton">[               .               ]</button>
            </div>
            
         
        </header>
        
        
       
        
        {/* A react quirk requires 'className' rather than 'class' like you'd find in HTML */}
        <div className="container">
          {this.state.entries ? 
            //if true (entries exist in state), then map through the array of entries one by one and make a new Card element for each
            this.state.entries.map((entry, index) =>{
              return <Card key={index} quote={entry.Quote} author={entry.Author} source={entry.Text_source} />
            })
          :
            //else, say:
            <p>No entries to display.</p>
          }
          
        </div>
     
      
      
        <div id = "filters" className = "container">
      
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
