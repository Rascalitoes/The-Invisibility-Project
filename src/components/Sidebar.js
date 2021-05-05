import React, { Component } from 'react';


document.addEventListener("DOMContentLoaded", function () {

  function returnOptions() {
    return fetch("http://localhost:2000/keywords")
      .then(response => response.json())
      .catch(err => {
        console.log(err)
      });
  }

  function createDLOption(word) {
    console.log(word);
    let option = document.createElement("option");
    option.value = word;
    option.innerHTML = word;
    return option
  }


  const DL = document.createElement("datalist");
  DL.id = "keywordOptions";

  returnOptions().then(optionValues => {
    for (let word in optionValues) {
      DL.appendChild(createDLOption(optionValues[word]));
      console.log("Yay" + word);
    }
  })

  document.querySelector("#keywordArea").appendChild(DL);
})


export default class Filter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      meta: ["author", "source", "origin"],
      metaValues: [false, false, false],
      cardNum: 5,
      keywords: "",
      author: false, source: false, origin: false,
    }

  }

  handleChange = event => {
    const target = event.target;
    const value = (target.name === ("author" || "source" || "origin")) ? target.checked : target.value;
    const name = target.name;

    this.setState({ [name]: value });
  }

  handleButtonPress = event => {
    this.props.onButtonPress(this.state);
    alert("cardNum: " + this.state.cardNum
      + "\nkeywords: " + this.state.keywords
      + "\nmetadata: " + this.state.author + this.state.source + this.state.origin);
  }

  render() {
    return (

      <div id="sidebarContainer">


        <form className="display">
          <fieldset id="searchBox">
            <legend id="h1"> Search:</legend>
            <p><input type="text" name='keywords' size="50" placeholder="Search" onChange={this.handleChange} value={this.state.value} /></p>
            <input value="Search" type="button" onClick={this.handleButtonPress} />
          </fieldset>

        </form>

        <form className="display" autoComplete="off">
          <fieldset id="searchBox">
            <legend id="h1"> Keyword Search:</legend>
            <p id="keywordArea"><input type="text" list="keywordOptions" name='keywords' size="50" placeholder="Keyword" onChange={this.handleChange} value={this.state.value} />
            </p>
            <input value="Search" type="button" onClick={this.handleButtonPress} />
          </fieldset>

        </form>


        {/*using this.state.meta[x] allows one to change the meta names at the top once, removing
      the requirement to search through the document to find all other instances of the names 
        <form className="display" id="metadataFilter">
          <fieldset>
            <legend id="h2">Filter Metadata: </legend>
            <p><input type="checkbox" name="author" onChange={this.handleChange} value={this.state.value} /> {this.state.meta[0]}</p>
            <p><input type="checkbox" name="source" onChange={this.handleChange} value={this.state.value} /> {this.state.meta[1]}</p>
            <p><input type="checkbox" name="origin" onChange={this.handleChange} value={this.state.value} /> {this.state.meta[2]}</p>
            <input value="Refresh" type="button" onClick={this.handleButtonPress} />
          </fieldset>

        </form>
        */}


        <form className="display" id="tileNumber">
          <fieldset>
            <p>Current tiles:</p>
            <legend id="h3">Select Number of Tiles to Display: </legend>
            <p><input type="text" name="cardNum" size="50" placeholder="Search" onChange={this.handleChange} value={this.state.value} /></p>
            <input value="Select" type="button" onClick={this.handleButtonPress} />
          </fieldset>

        </form>

      </div>
    );
  }
}
