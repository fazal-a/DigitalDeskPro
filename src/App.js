import React, { useState } from "react";
import { Routes, Route, Navigate} from "react-router-dom";
import { useUserData } from "./Context/UserDataContext";


import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import Room from "./components/Room/Room";
import Home from "./components/Home/Home";
// import Home from "./components/Home/temphomeRef";


function App() {
  const { isLoggedIn  } = useUserData();

  return (
    <>
      <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/room" element={<Room />} />

        {isLoggedIn ? (
        <Route path="/room/*" element={<Room />} />
      ) : (
        <Route path="/room/*" element={<Navigate to="/login" />} />
      )}
        <Route path="/home/:examId" element={<Home />} />



      </Routes>
    </>
  );
}
export default App;
