import React from "react";
import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Chating from "./pages/Chating";
import About from "./pages/About";
import UserDashboard from "./pages/UserDashboard";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Toaster />
        <Navbar />
        <Routes>
          
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/chatting" element={<Chating />} />
          <Route path="/userDashboard" element={<UserDashboard />} />

          
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;