import React, { Component } from "react";
import { Form, Button, Card, CardDeck, Alert, Spinner } from "react-bootstrap";
import * as Musixmatch from "musixmatch-node";
import * as albumArt from "album-art";
import { getLyrics, getSong } from "genius-lyrics-api";

//implement piano bpm inputer --> toggle switch
//algorithm to compare two arrays
//input genre
//input time signature

//9-GXJ4Xrxl2JxwhJCv1Sr_Qsoh6LqfYj-ZHWLtcYf-WNIdsnMnV2i62SKj8Pz7RTvSfVZ0KAsvp_dWNgCnZ5VA <--secret
//dO0b7x1qji4SPXZw9AX9C5f2bT-F9WbwLrE9ao3IFwWfeIjMfzUXueHsKMsj6aEf <-- token
//M7vuA_L-_x3zZEkS3zbXne-Dmwhio7vJ4Y4Q7G5RPREEb2N8WuYE8OYIYzkcwMWH <-- id

export default class MyForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lyrics: "",
      song: [],
      albumArts: [],
      hideAlert: true,
      submitted: false,
      bpm: 0,
    };
    this.handleLyricsChange = this.handleLyricsChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getAlbumArt = this.getAlbumArt.bind(this);
    this.handleBPMSubmit = this.handleBPMSubmit.bind(this);
  }

  handleLyricsChange(event) {
    this.setState({ lyrics: event.target.value });
  }

  async handleSubmit(event) {
    event.preventDefault();
    const mxm = new Musixmatch("179e0011e5cff7cbbc059b9ebb27ce57");
    if (this.state.lyrics === "" && this.state.bpm === 0) {
      //none
      this.setState({ hideAlert: false });
    } else if (this.state.bpm === 0) {
      //just lyrics
      this.setState({ submitted: true });
      const foundSong = await mxm.searchTrack({
        q_lyrics: this.state.lyrics,
        s_track_rating: "desc",
      });
      this.setState({
        // song: foundSong.message.body.track_list.slice(0, 5),
      });
      const tempSongs = [];
      for (var i = 0; i < 5; i++) {
        const tempSong = {
          song: foundSong.message.body.track_list[i].track.track_name,
          artist: foundSong.message.body.track_list[i].track.artist_name,
          album: foundSong.message.body.track_list[i].track.album_name,
        };
        tempSongs.push(tempSong);
      }
      this.setState({ song: tempSongs });
      console.log(foundSong.message.body.track_list);
      var tempAlbumArts = [];
      for (var i = 0; i < this.state.song.length; i++) {
        var url = await this.getAlbumArt(
          this.state.song[i].artist,
          this.state.song[i].album
        );
        tempAlbumArts.push(url);
      }
      this.setState({
        albumArts: tempAlbumArts,
      });
    } else if (this.state.lyrics === "") {
      //just bpm
      this.setState({ submitted: true });
      console.log(this.state.bpm);
      var response = await fetch(
        `https://api.getsongbpm.com/tempo/?api_key=faa2dcd7d5ec93022e7ef5fb1222b8ed&bpm=${this.state.bpm}`
      );
      var body = await response.json();
      console.log(response);
      console.log(body);
      const tempSongs = [];
      for (var i = 0; i < 5; i++) {
        const tempSong = {
          song: body.tempo[i].song_title,
          artist: body.tempo[i].artist.name,
          album: body.tempo[i].album.title,
        };
        tempSongs.push(tempSong);
      }
      this.setState({ song: tempSongs });
      var tempAlbumArts = [];
      for (var i = 0; i < this.state.song.length; i++) {
        var url = await this.getAlbumArt(
          this.state.song[i].artist,
          this.state.song[i].album
        );
        tempAlbumArts.push(url);
      }
      this.setState({
        albumArts: tempAlbumArts,
      });
    } else {
      //lyrics and bpm
      this.setState({ submitted: true });
      console.log(this.state.bpm);
      var response = await fetch(
        `https://api.getsongbpm.com/tempo/?api_key=faa2dcd7d5ec93022e7ef5fb1222b8ed&bpm=${this.state.bpm}`
      );
      var tempBody = await response.json();
      console.log(response);
      console.log(tempBody);
      var body = tempBody.tempo;
      const songsWithScore = [];
      for (var i = 0; i < 20; i++) {
        const options = {
          apiKey:
            "dO0b7x1qji4SPXZw9AX9C5f2bT-F9WbwLrE9ao3IFwWfeIjMfzUXueHsKMsj6aEf",
          title: body[i].song_title,
          artist: body[i].artist.name,
          optimizeQuery: true,
        };
        var lyrics = await getLyrics(options);
        if (lyrics === null || lyrics === undefined) {
          continue;
        }
        console.log(lyrics.replace(/\W/g, "").toLowerCase());
        var words = lyrics.replace(/\W/g, "").toLowerCase();
        var relevanceCounter = 0;
        while (
          words.indexOf(
            this.setState({
              lyrics: this.state.lyrics.replace(/\W/g, "").toLowerCase(),
            })
          ) !== -1
        ) {
          relevanceCounter++;
          words =
            words.substring(
              0,
              words.indexOf(
                this.setState({
                  lyrics: this.state.lyrics.replace(/\W/g, "").toLowerCase(),
                })
              )
            ) +
            words.substring(
              words.indexOf(
                this.setState({
                  lyrics: this.state.lyrics.replace(/\W/g, "").toLowerCase(),
                })
              ) + 1
            );
        }
        const songWithScore = {
          song: body[i].song_title,
          artist: body[i].artist.name,
          album: body[i].album.title,
          score: relevanceCounter,
        };
        songsWithScore.push(songWithScore);
      }
      //this.setState({ song: songsWithScore });
      songsWithScore.sort((a, b) => (a.score > b.score ? 1 : -1));
      const tempSongs = [];
      for (var i = 0; i < 5; i++) {
        const tempSong = {
          song: songsWithScore[i].song,
          artist: songsWithScore[i].artist,
          album: songsWithScore[i].album,
        };
        tempSongs.push(tempSong);
      }
      this.setState({ song: tempSongs });
      console.log(tempSongs);
      var tempAlbumArts = [];
      for (var i = 0; i < this.state.song.length; i++) {
        var url = await this.getAlbumArt(
          this.state.song[i].artist,
          this.state.song[i].album
        );
        tempAlbumArts.push(url);
      }
      this.setState({
        albumArts: tempAlbumArts,
      });
    }
  }

  async getAlbumArt(artistName, albumName) {
    var url = "";

    await albumArt(artistName, { album: albumName }, (error, response) => {
      url = response;
      //=> http://path/to/rush.jpg
    });
    this.setState({ submitted: false });
    console.log(url);

    return url;
  }

  async handleBPMSubmit(event) {
    event.preventDefault();
    console.log(this.state.bpm);
    var response = await fetch(
      `https://api.getsongbpm.com/tempo/?api_key=faa2dcd7d5ec93022e7ef5fb1222b8ed&bpm=${this.state.bpm}`
    );
    var body = await response.json();
    console.log(response);
    console.log(body);
    this.setState({ bpmSongArray: body });
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
          <Form.Group controlId="exampleForm.ControlTextarea1">
            <Form.Label>Enter BPM</Form.Label>
            <Form.Control
              type="number"
              value={this.state.bpm}
              onChange={(event) => this.setState({ bpm: event.target.value })}
              placeholder="Enter BPM here..."
            />
          </Form.Group>
          <Form.Group controlId="exampleForm.ControlTextarea1">
            <Form.Label>Enter Genre</Form.Label>
            <Form.Control as="select">
              <option>-Select-</option>
              <option>Rock</option>
              <option>Pop</option>
              <option>Jazz</option>
            </Form.Control>
            {/* value={this.state.bpm}
            onChange={(event) => this.setState({ bpm: event.target.value })} */}
          </Form.Group>
          <Form.Group controlId="exampleForm.ControlTextarea1">
            <Form.Label>Enter Time Signature</Form.Label>
            <Form.Row>
              <Form.Group>
                <Form.Control
                  type="number"
                  //value={this.state.bpm}
                  //onChange={(event) => this.setState({ bpm: event.target.value })}
                  //placeholder="Enter BPM here..."
                />
              </Form.Group>
              <h2> / </h2>
              <Form.Group>
                <Form.Control as="select">
                  <option></option>
                  <option>2</option>
                  <option>4</option>
                  <option>8</option>
                  <option>16</option>
                  <option>32</option>
                </Form.Control>
              </Form.Group>
            </Form.Row>
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
        <br />
        <Spinner animation="border" hidden={!this.state.submitted} />
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
                <Card.Title>{item.song}</Card.Title>
                <hr />
                <Card.Text>{item.artist}</Card.Text>
                <Card.Text>{item.album}</Card.Text>
              </Card.Body>
            </Card>
          ))}
        </CardDeck>
        <br />
        <Alert
          variant="danger"
          hidden={this.state.hideAlert}
          onClose={() => this.setState({ hideAlert: true })}
          dismissible
        >
          <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
          <p>Please enter an input in the lyric and bpm fields.</p>
        </Alert>
      </div>
    );
  }
}
