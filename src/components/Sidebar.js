import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default class Filter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      meta: false,
    }

  }



  render() {
    return (

      <div>

        <Row> <Col>
          <form>
            <fieldset id="searchBox">
              <legend id="h1"> Search:</legend>
              <p><input type="text" className="searchTerm" placeholder="Search" /></p>
              <input type="submit" id="submitbtn" value="Search" />
            </fieldset>

          </form>
        </Col> </Row>

        <Row> <Col>
          <form id="metadataFilter">
            <fieldset>
              <legend >Filter Metadata: </legend>
              <p><input type="checkbox" id="option1" /> Author</p>
              <p><input type="checkbox" id="option2" /> Source </p>
              <p><input type="checkbox" id="option3" /> Origin</p>
              <input type="submit" id="submitbtn" value="Refresh" />
            </fieldset>
          </form>
        </Col> </Row>

        <Row> <Col>
          <form id="tileNumber">
            <fieldset>
              <p>Current tiles:</p>
              <legend id="h3">Select Number of Tiles to Display: </legend>
              <p><input type="text" className="searchTerm" placeholder="Search" /></p>
              <input type="submit" id="submitbtn" value="Select" />
            </fieldset>

          </form>
        </Col> </Row>
      </div>
    );
  }
}
