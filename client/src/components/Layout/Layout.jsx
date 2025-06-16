import React from "react";
import Header from "../Header/Header.jsx";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "../Footer/Footer.jsx";

const Layout = () => {
  const location = useLocation();
  const isFullWidth = location.pathname === "/my-profile"; // או כל תנאי אחר

  const mainStyle = isFullWidth
    ? { width: "100vw" }
    : { padding: "40px 0", margin: "0 auto", maxWidth: "1500px" };

  return (
    <div>
      <Header />
      <div style={mainStyle}>
        <Outlet />
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
