import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import About from "./components/About";
import NavigationBar from "./components/NavigationBar";
import { Route, Link, BrowserRouter as Router } from "react-router-dom";

ReactDOM.render(
  <div>
    <NavigationBar />
    <Router>
      <div>
        <Route exact path="/" component={App} />
        <Route path="/about" component={About} />
      </div>
    </Router>
  </div>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
