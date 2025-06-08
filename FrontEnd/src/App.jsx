import React, { useState } from "react";
import "./App.css";

import { Routes, Route, BrowserRouter } from "react-router-dom";
import MedlearnLoginPage from "./pages/Login"; // Đảm bảo đúng đường dẫn
import Home from "./pages/Home";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<MedlearnLoginPage />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
