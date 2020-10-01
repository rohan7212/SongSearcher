import React, { Component } from "react";
import { Form, Button, Card } from "react-bootstrap";
import * as Musixmatch from "musixmatch-node";

export default class MyForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lyrics: "",
      song: "",
    };
    this.handleLyricsChange = this.handleLyricsChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleLyricsChange(event) {
    this.setState({ lyrics: event.target.value });
  }

  async handleSubmit(event) {
    event.preventDefault();
    const mxm = new Musixmatch("179e0011e5cff7cbbc059b9ebb27ce57");
    const foundSong = await mxm.searchTrack({
      q_lyrics: this.state.lyrics,
      s_track_rating: "desc",
    });
    console.log(foundSong.message.body.track_list[0].track);
    this.setState({
      song: foundSong.message.body.track_list[0].track.track_name,
    });
    console.log(this.state.song);
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
              placeholder="Enter lyrics here..."
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
        <Card style={{ width: "18rem" }}>
          <Card.Img variant="top" src="holder.js/100px180" />
          <Card.Body>
            <Card.Title>{this.state.song}</Card.Title>
            <Card.Text></Card.Text>
          </Card.Body>
        </Card>
      </div>
    );
  }
}
