import React, { Component } from "react";
import { Container, Row, Col } from "react-bootstrap";

export default class About extends Component {
  render() {
    return (
      <div>
        <Container fluid>
          <Row>
            <Col>
              <h1>About</h1>
              <h2>About this project</h2>
              <ul>
                <li>An seamless way of searching for songs</li>
                <li>
                  Allows users to search by song lyrics, rhythm, and intervals
                </li>
              </ul>
              <h2>About the creator</h2>
              <h4>Rohan Purandare</h4>
              <ul>
                <li>
                  An 18 year old computer science major at Purdue University
                </li>
              </ul>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

//About
//About the project
//  xyz
//About the creators
//  xyz
