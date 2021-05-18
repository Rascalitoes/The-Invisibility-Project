import React, { Component } from 'react';


document.addEventListener("DOMContentLoaded", function () {

  function returnOptions() {
    return fetch("http://localhost:2000/keywords")
      .then(response => response.json())
      .catch(error => console.error(error));
  }

  function createDLOption(word) {
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
    }
  })
  .catch(error => console.error(error));

  document.getElementById("keywordArea").appendChild(DL);
})

function createPopup(event,id){
  event.preventDefault();
  let popup = document.getElementById(id);
  popup.classList.toggle("show");
}


export default class Filter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cardNum: 5,
      searchTerms: "",
      keywords: "",
    }

  }

  handleChange = event => {
    //The name property of the input on the form must match the state it is trying to change
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({ [name]: value });
  }

  handleButtonPress = event => {
    this.props.onButtonPress(this.state);
  }

  render() {
    return (

      <div id="sidebarContainer">

        <form className="display" autoComplete="off">
          <fieldset>
            <legend><button className="popup" onClick={(event) => createPopup(event,"generalSearchPopup")}>?<span className="popuptext" id="generalSearchPopup">You can search several keywords by using commas e.g. cat, dog</span></button> Search:</legend>
            <p><input type="text" name='searchTerms' size="50" placeholder="Search" onChange={this.handleChange} value={this.state.value} /></p>
            <input value="Search" type="button" onClick={this.handleButtonPress} />
          </fieldset>

        </form>

        <form className="display" autoComplete="off">
          <fieldset>
            <legend><button className="popup" onClick={(event) => createPopup(event,"keywordSearchPopup")}>?<span className="popuptext" id="keywordSearchPopup">You can search several keywords by using commas e.g. cat, dog</span></button> Keyword Search:</legend>
            <p id="keywordArea"><input type="text" list="keywordOptions" name='keywords' size="50" placeholder="Keyword" onChange={this.handleChange} value={this.state.value} />
            </p>
            <input value="Search" type="button" onClick={this.handleButtonPress} />
          </fieldset>

        </form>
        {/* 
        This works, and the backend can deal with it
        <form className="display">
          <fieldset>
            <p>Current tiles:</p>
            <legend>Select Number of Tiles to Display: </legend>
            <p><input type="text" name="cardNum" size="50" placeholder="Search" onChange={this.handleChange} value={this.state.value} /></p>
            <input value="Select" type="button" onClick={this.handleButtonPress} />
          </fieldset>

        </form>
        */}
      </div>
    );
  }
}
