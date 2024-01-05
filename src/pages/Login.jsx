import React, { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import BrandLogo from "../assets/Brand.png";

const Login = () => {
  const [hovered, setHovered] = useState(false);
  const handleHover = () => {
    setHovered(true);
  };
  const handleLeave = () => {
    setHovered(false);
  };

  return (
    <div className="login-connect-button">
      <img
        onClick={() => {
          window.location.reload();
        }}
        className="brand-logo login-brand-logo"
        src={BrandLogo}
        alt="Brand Logo"
        onMouseOver={handleHover}
        onMouseLeave={handleLeave}
        style={{
          cursor: hovered ? "pointer" : null,
        }}
      />

      <ConnectButton showBalance={false} chainStatus="icon" />
    </div>
  );
};

export default Login;
