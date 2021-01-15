import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default class Form extends Component {

  constructor(props) {
    super(props);
    this.state = {
      author: 'a',
      quote: 'b',
      source: 'c',
      date: 'd',
      keywords: 'e',
      user: 'rdglick2'
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.name === 'author' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit() {
    alert(
      "Author: \t"+this.state.author+"\n"+
      "Quote: \t"+this.state.quote+"\n"+
      "Source: \t"+this.state.source+"\n"+
      "Date: \t"+this.state.date+"\n"+
      "Keywords: \t"+this.state.keywords+"\n"+
      "User: \t"+this.state.user+"\n");
  }


  render() {

    return (
      <div id="midline">
        <p id="formHeader">Enter a new (In)Visibility:</p>
        <form onSubmit={this.handleSubmit} target="_blank">

          <Row> <Col>
            <label class="textInput">Author:<br />
              <input type="text" name="author" class="textInput" required
                onChange={this.handleInputChange}
                value={this.state.author}
              /><br />
            </label>
          </Col> </Row>

          <Row> <Col>
            <label class="textInput">Quote:<br />
              <textarea name="quote" class="textInput" rows="5" required
                onChange={this.handleInputChange}
                value={this.state.quote}
              ></textarea><br />
            </label>
          </Col> </Row>

          <Row> <Col>
            <label class="textInput">Source:<br />
              <input type="text" name="source" class="textInput" required
                onChange={this.handleInputChange}
                value={this.state.source}
              /><br />
            </label>
          </Col> </Row>

          <Row> <Col>
            <label class="textInput">Date:<br />
              <input type="text" name="date" class="textInput" required
                onChange={this.handleInputChange}
                value={this.state.date}
              /><br />
            </label>
          </Col> </Row>

          <Row> <Col>
            <label class="textInput">Keywords (comma-separate):<br />
              <input type="text" name="keywords" class="textInput"
                value={this.state.keywords}
                onChange={this.handleInputChange} required
              /><br />
            </label>
          </Col> </Row>

          <Row> <Col>
            <label class="textInput">User:<br />
              <input type="text" name="user" class="textInput"
                onChange={this.handleInputChange}
                value={this.state.user}
              /><br /><br />
            </label>
          </Col> </Row>

          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}


