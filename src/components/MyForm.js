import React, { Component } from "react";
import { Form, Button } from "react-bootstrap";

export default class MyForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lyrics: "",
    };
    this.handleLyricsChange = this.handleLyricsChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleLyricsChange(event) {
    this.setState({ lyrics: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    alert(this.state.lyrics);
  }

  render() {
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <Form.Group controlId="exampleForm.ControlTextarea1">
            <Form.Label>Enter lyrics</Form.Label>
            <Form.Control
              as="textarea"
              rows="3"
              value={this.state.lyrics}
              onChange={this.handleLyricsChange}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </div>
    );
  }
}
