// resources/js/Components/Header/Header.jsx
import React, { useState } from "react";
import Logo from "../../assets/logo.png";
import "./Header.css";
import { Link } from "react-scroll";
import Bars from "../../assets/bars.png";

const Header = () => {
  const mobile = window.innerWidth <= 768;
  const [menuOpened, setMenuOpened] = useState(false);

  return (
    <div className="header" id="header">
      <img src={Logo} alt="Logotipo" className="logo" />

    </div>
  );
};

export default Header;
