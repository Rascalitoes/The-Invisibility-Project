import React, { Component } from 'react';

function createPopup(event, name) {
  event.preventDefault();
  let popup = document.getElementById(name);
  let len = popup.innerHTML.length;
  if (len > 40) {
    popup.style.width = "40ex"
  }
  else if (len < 20) {
    popup.style.width = "160px"
  }
  else {
    popup.style.width = len.toString() + "ex"
  }
  popup.classList.toggle("show");
}

export default class Form extends Component {

  constructor(props) {
    super(props);
    this.state = {
      author: '',
      quote: '',
      source: '',
      date: '',
      keywords: '',
      email: ''
    };
    this.handleInputChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;

    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    fetch('http://localhost:2000/process', {
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
      .then(res => {
        if (res.status === 409) {
          alert("This submission already exists!")
        }
        else if (res.status === 201) {
          alert("Thank you for submitting a new (in)visibility")
        }
      })
      .catch(err => {
        console.log(err)
        alert("Sorry, something went wrong. Please try again later")
      });
  }

  render() {
    return (
      <div id="newEntryForm">
        <p id="formHeader">Enter a new (In)Visibility:</p>
        <form onSubmit={this.handleSubmit}>

          <label>Author: * <button className="popup" onClick={(event) => createPopup(event, "authorPopup")}>?<span className="popuptextright" id="authorPopup">A Simple Popup! This one is really long though, so it fills up more space</span></button><br />
            <input name="author" type="text" size="50" required
              onChange={this.handleChange}
              value={this.state.author}
            /><br />
          </label>

          <label>Quote: * <button className="popup" onClick={(event) => createPopup(event, "quotePopup")}>?<span className="popuptextright" id="quotePopup">A Simple Popup!</span></button><br />
            <textarea name="quote" rows="5" cols="42" required
              onChange={this.handleChange}
              value={this.state.quote}
            ></textarea><br />
          </label>

          <label>Source: <button className="popup" onClick={(event) => createPopup(event, "sourcePopup")}>?<span className="popuptextright" id="sourcePopup">A Simple Popup!</span></button><br />
            <input name="source" type="text" size="50"
              onChange={this.handleChange}
              value={this.state.source}
            /><br />
          </label>

          <label>Date: <button className="popup" onClick={(event) => createPopup(event, "datePopup")}>?<span className="popuptextright" id="datePopup">A Simple Popup!</span></button><br />
            <input name="date" type="text" size="50"
              onChange={this.handleChange}
              value={this.state.date}
            /><br />
          </label>

          <label>Keywords (comma-separate): <button className="popup" onClick={(event) => createPopup(event, "keywordsPopup")}>?<span className="popuptextright" id="keywordsPopup">A Simple Popup!</span></button><br />
            <input name="keywords" type="text" size="50"
              value={this.state.keywords}
              onChange={this.handleChange}
            /><br />
          </label>

          <label>Email: <button className="popup" onClick={(event) => createPopup(event, "emailPopup")}>?<span className="popuptextright" id="emailPopup">A Simple Popup!</span></button><br />
            <input name="email" type="email" size="50"
              onChange={this.handleChange}
              value={this.state.email}
            /><br /><br />
          </label>

          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}


