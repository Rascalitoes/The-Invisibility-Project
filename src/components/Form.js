import React, { Component } from 'react';

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
        user: ''
      },
      prevState: {
        author: '',
        quote: '',
        source: '',
        date: '',
        keywords: '',
        user: ''
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
          user: this.state.user
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

          <label>Author:<br />
            <input type="text" name="author" id="author" size="50" required
              onChange={this.handleInputChange}
              value={this.state.author}
            /><br />
          </label>

          <label>Quote:<br />
            <textarea name="quote" id="quote" rows="5" cols="42" required
              onChange={this.handleInputChange}
              value={this.state.quote}
            ></textarea><br />
          </label>

          <label>Source:<br />
            <input type="text" name="source" id="source" size="50"
              onChange={this.handleInputChange}
              value={this.state.source}
            /><br />
          </label>

          <label>Date:<br />
            <input type="text" name="date" id="date" size="50"
              onChange={this.handleInputChange}
              value={this.state.date}
            /><br />
          </label>

          <label>Keywords (comma-separate):<br />
            <input type="text" name="keywords" id="keywords" size="50"
              value={this.state.keywords}
              onChange={this.handleInputChange}
            /><br />
          </label>

          <label>User:<br />
            <input type="text" name="user" id="user" size="50"
              onChange={this.handleInputChange}
              value={this.state.user}
            /><br /><br />
          </label>

          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}


