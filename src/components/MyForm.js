import React, { Component } from "react";
import { Form, Button, Card, CardDeck } from "react-bootstrap";
import * as Musixmatch from "musixmatch-node";
import * as albumArt from "album-art";
//get bpm api

export default class MyForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lyrics: "",
      song: [],
      albumArts: [],
    };
    this.handleLyricsChange = this.handleLyricsChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getAlbumArt = this.getAlbumArt.bind(this);
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
    this.setState({
      song: foundSong.message.body.track_list.slice(0, 5),
    });
    console.log(foundSong.message.body.track_list);
    var tempAlbumArts = [];
    for (var i = 0; i < this.state.song.length; i++) {
      var url = await this.getAlbumArt(
        foundSong.message.body.track_list[i].track.artist_name,
        foundSong.message.body.track_list[i].track.album_name
      );
      tempAlbumArts.push(url);
    }
    this.setState({
      albumArts: tempAlbumArts,
    });
  }

  async getAlbumArt(artistName, albumName) {
    var url = "";

    await albumArt(artistName, { album: albumName }, (error, response) => {
      url = response;
      //=> http://path/to/rush.jpg
    });

    console.log(url);

    return url;
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
        <br />
        <CardDeck>
          {this.state.song.map((item, index) => (
            <Card style={{ width: "18rem" }}>
              <Card.Img
                variant="top"
                src={this.state.albumArts[index]}
                alt=""
              />
              <Card.Body>
                <Card.Title>{item.track.track_name}</Card.Title>
                <hr />
                <Card.Text>{item.track.artist_name}</Card.Text>
                <Card.Text>{item.track.album_name}</Card.Text>
              </Card.Body>
            </Card>
          ))}
        </CardDeck>
      </div>
    );
  }
}
