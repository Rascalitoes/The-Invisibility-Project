import React, { Component } from 'react';

function createPopup(event,id){
  event.preventDefault();
  var popup = document.getElementById(id);
  var len = popup.innerHTML.length;
  if(len > 40){
    popup.style.width = "40ex"
  }
  else if (len < 20){
    popup.style.width = "160px"
  }
  else{
    popup.style.width = len.toString()+"ex"
  }
  popup.classList.toggle("show");
}

export default class Form extends Component {

  constructor(props) {
    super(props);
    this.state = {
      current: {
        author: '',
        quote: '',
        source: '',
        date: '',
        keywords: '',
        email: ''
      },
      prevState: {
        author: '',
        quote: '',
        source: '',
        date: '',
        keywords: '',
        email: ''
      }
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    if (this.state.current !== this.state.prevState) {
      alert('Thank you for submitting a new (in)visibility');
      event.preventDefault();
      fetch('http://localhost:2000/process_get', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          author: this.state.author,
          quote: this.state.quote,
          source: this.state.source,
          date: this.state.date,
          keywords: this.state.keywords,
          email: this.state.email
        })
      })
      //console.log("YAy!");
      //this.setState({prevState: this.state.current})
    }
    else{
      alert("You've already submitted this!")
      event.preventDefault();
    }
  }


  render() {

    return (
      <div className="newEntryForm">
        <p id="formHeader">Enter a new (In)Visibility:</p>
        <form onSubmit={this.handleSubmit}>

          <label>Author: * <button class="popup" onClick={(event) => createPopup(event,"authorPopup")}>?<span class="popuptextright" id="authorPopup">A Simple Popup! This one is really long though, so it fills up more space</span></button><br />
            <input type="text" name="author" id="author" size="50" required
              onChange={this.handleInputChange}
              value={this.state.author}
            /><br />
          </label>

          <label>Quote: * <button class="popup" onClick={(event) => createPopup(event,"quotePopup")}>?<span class="popuptextright" id="quotePopup">A Simple Popup!</span></button><br />
            <textarea name="quote" id="quote" rows="5" cols="42" required
              onChange={this.handleInputChange}
              value={this.state.quote}
            ></textarea><br />
          </label>

          <label>Source: <button class="popup" onClick={(event) => createPopup(event,"sourcePopup")}>?<span class="popuptextright" id="sourcePopup">A Simple Popup!</span></button><br />
            <input type="text" name="source" id="source" size="50"
              onChange={this.handleInputChange}
              value={this.state.source}
            /><br />
          </label>

          <label>Date: <button class="popup" onClick={(event) => createPopup(event,"datePopup")}>?<span class="popuptextright" id="datePopup">A Simple Popup!</span></button><br />
            <input type="text" name="date" id="date" size="50"
              onChange={this.handleInputChange}
              value={this.state.date}
            /><br />
          </label>

          <label>Keywords (comma-separate): <button class="popup" onClick={(event) => createPopup(event,"keywordsPopup")}>?<span class="popuptextright" id="keywordsPopup">A Simple Popup!</span></button><br />
            <input type="text" name="keywords" id="keywords" size="50"
              value={this.state.keywords}
              onChange={this.handleInputChange}
            /><br />
          </label>

          <label>Email: <button class="popup" onClick={(event) => createPopup(event,"emailPopup")}>?<span class="popuptextright" id="emailPopup">A Simple Popup!</span></button><br />
            <input type="email" name="email" id="email" size="50"
              onChange={this.handleInputChange}
              value={this.state.email}
            /><br /><br />
          </label>

          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}


