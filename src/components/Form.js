import React, { Component } from 'react';

function createPopup(event, name) {
  event.preventDefault();
  var popup = document.getElementById(name);
  var len = popup.innerHTML.length;
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
    let updateState = this.state.current
    updateState[target.name] = target.value

    this.setState({
      current: updateState
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
          author: this.state.current.author,
          quote: this.state.current.quote,
          source: this.state.current.source,
          date: this.state.current.date,
          keywords: this.state.current.keywords,
          email: this.state.current.email
        })
      })
    }
    else {
      alert("You've already submitted this!")
      event.preventDefault();
    }
  }

  render() {

    return (
      <div id="newEntryForm">
        <p id="formHeader">Enter a new (In)Visibility:</p>
        <form onSubmit={this.handleSubmit}>

          <label>Author: * <button className="popup" onClick={(event) => createPopup(event, "authorPopup")}>?<span className="popuptextright" id="authorPopup">A Simple Popup! This one is really long though, so it fills up more space</span></button><br />
            <input name="author" type="text" size="50" required
              onChange={this.handleInputChange}
              value={this.state.current.author}
            /><br />
          </label>

          <label>Quote: * <button className="popup" onClick={(event) => createPopup(event, "quotePopup")}>?<span className="popuptextright" id="quotePopup">A Simple Popup!</span></button><br />
            <textarea name="quote" rows="5" cols="42" required
              onChange={this.handleInputChange}
              value={this.state.current.quote}
            ></textarea><br />
          </label>

          <label>Source: <button className="popup" onClick={(event) => createPopup(event, "sourcePopup")}>?<span className="popuptextright" id="sourcePopup">A Simple Popup!</span></button><br />
            <input name="source" type="text" size="50"
              onChange={this.handleInputChange}
              value={this.state.current.source}
            /><br />
          </label>

          <label>Date: <button className="popup" onClick={(event) => createPopup(event, "datePopup")}>?<span className="popuptextright" id="datePopup">A Simple Popup!</span></button><br />
            <input name="date" type="text" size="50"
              onChange={this.handleInputChange}
              value={this.state.current.date}
            /><br />
          </label>

          <label>Keywords (comma-separate): <button className="popup" onClick={(event) => createPopup(event, "keywordsPopup")}>?<span className="popuptextright" id="keywordsPopup">A Simple Popup!</span></button><br />
            <input name="keywords" type="text" size="50"
              value={this.state.current.keywords}
              onChange={this.handleInputChange}
            /><br />
          </label>

          <label>Email: <button className="popup" onClick={(event) => createPopup(event, "emailPopup")}>?<span className="popuptextright" id="emailPopup">A Simple Popup!</span></button><br />
            <input name="email" type="email" size="50"
              onChange={this.handleInputChange}
              value={this.state.current.email}
            /><br /><br />
          </label>

          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}


