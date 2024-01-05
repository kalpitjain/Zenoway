import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Explore from "./Explore";
import Profile from "./Profile";
import Alert from "./Alert";
import { useAccount } from "wagmi";
import Login from "./Login";

const App = () => {
  const { isConnected } = useAccount();

  return (
    <Routes>
      {isConnected ? (
        <>
          <Route path="/profile" element={<Profile />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/alert" element={<Alert />} />
          <Route path="/" element={<Home />} />
        </>
      ) : (
        <>
          <Route path="/profile" element={<Login />} />
          <Route path="/explore" element={<Login />} />
          <Route path="/alert" element={<Login />} />
          <Route path="/" element={<Login />} />
        </>
      )}
    </Routes>
  );
};

export default App;
