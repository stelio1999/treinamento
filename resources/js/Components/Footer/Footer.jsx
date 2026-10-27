// resources/js/Components/Footer/Footer.jsx
import React from "react";
import "./Footer.css";
import wp from "../../assets/whatsapp-logo.jpg";

const Footer = () => {
  return (
    <div className="Footer-container" id="about">
      <section className="footer">
        <div className="box-container">
          <div className="box">
            <h3>Endereço</h3>
            <a href="#">Av. Julius Nyerere, Maputo — Moçambique</a>
            <a href="https://wa.me/258841639601">
              <img alt="WhatsApp" src={wp} height="80" width="240" className="btn" />
            </a>
          </div>
          <div className="box">
            <h3>Contacta-nos</h3>
            <i className="fa">
              <a href="tel:+258841639601">+258 84 163 9601</a>
            </i>
            <br />
            <i className="fa">
              <a href="mailto:info@fitclub.co.mz">info@fitclub.co.mz</a>
            </i>
          </div>
          <div className="box">
            <h3>Segue-nos</h3>
            <div className="hero1">
              <h1>Encontra-nos em</h1>
              <div className="home__social-icon">
                <a href="#"><i className="fab fa-facebook-f"> Facebook</i></a>
                <a href="#"><i className="fab fa-instagram"> Instagram</i></a>
                <a href="#"><i className="fab fa-whatsapp"> WhatsApp</i></a>
                <a href="#"><i className="fab fa-google"> Google Maps</i></a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="credits">
        <p>© {new Date().getFullYear()} FitClub Moçambique. Todos os direitos reservados.</p>
      </div>
    </div>
  );
};

export default Footer;
