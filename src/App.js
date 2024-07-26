import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./Layout/Sidebar";
import { Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import CST from "./Pages/cst";

const App = () => {
  return (
    <>
      <Router>
        <Sidebar />
        <Routes>
          <Route path="/" element={<CST />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
