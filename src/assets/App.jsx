import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Navbar from "./components/Navbar";
import Protectedroutes from "./protectedRoutes/Protectedroutes";
import About from "./pages/About";
import Drage from "./pages/Drage";


function App() {
  return (
    <Router>
      <div className="h-screen bg-gray-100">
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <Protectedroutes>
                <Home />
              </Protectedroutes>
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
