import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import MyForm from "./components/MyForm";
import { Container, Row, Col } from "react-bootstrap";

function App() {
  return (
    <Container>
      <Row>
        <Col>
          <MyForm></MyForm>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
