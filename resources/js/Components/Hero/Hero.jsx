// resources/js/Components/Hero/Hero.jsx
import React from "react";
import "./Hero.css";
import hero_image from "../../assets/hero_image.png";
import hero_back from "../../assets/hero_image_back.png";
import heart from "../../assets/heart.png";
import calories from "../../assets/calories.png";
import { motion } from "framer-motion";
import NumberCounter from "number-counter";
import Header from "../Header/Header";
import { Link as InertiaLink } from "@inertiajs/react";
import { Link as ScrollLink } from "react-scroll";



const Hero = () => {
  const transition = { duration: 3, type: "spring" };
  const mobile = window.innerWidth <= 768;

  return (
    <div className="hero" id="home">
      <div className="blur hero-blur"></div>

      <div className="left-h">
        <Header />

        {/* faixa "o melhor" */}
        <div className="the-best">
          <motion.div
            initial={{ left: mobile ? "178px" : "238px" }}
            whileInView={{ left: "8px" }}
            transition={{ ...transition, type: "tween" }}
          ></motion.div>
          <span>O MELHOR CLUBE DE FITNESS DA CIDADE</span>
        </div>

        {/* texto principal */}
        <div className="hero-text">
          <div>
            <span className="stroke-text">Molda </span>
            <span>o teu</span>
          </div>
          <div>
            <span>corpo ideal</span>
          </div>
          <div>
            <span>
              Aqui vamos ajudar-te a moldar e construir o corpo que sempre
              desejaste e a viver a vida em pleno.
            </span>
          </div>
        </div>

        {/* números */}
        <div className="figures">
          <div>
            <span><NumberCounter end={140} start={100} delay={4} preFix="+" /></span>
            <span>treinadores especialistas</span>
          </div>
          <div>
            <span><NumberCounter end={978} start={878} delay={4} preFix="+" /></span>
            <span>membros inscritos</span>
          </div>
          <div>
            <span><NumberCounter end={50} delay={2} preFix="+" /></span>
            <span>programas de treino</span>
          </div>
        </div>

        {/* botões */}
<div className="hero-btns">
  {/* 1. Vai para a página de login (Inertia) */}
  <InertiaLink href="/login" className="btn">
    Começar agora
  </InertiaLink>

  {/* 2. Scroll suave até à secção de contacto */}
  <ScrollLink
    to="contact"
    spy={true}
    smooth={true}
    duration={600}
    offset={-50}
    className="btn"
  >
    Saber mais
  </ScrollLink>
</div>
      </div>

      {/* lado direito */}
      <div className="right-h">
<ScrollLink
    className="btn"
    to="join-us"
    spy={true}
    smooth={true}
    duration={600}
    offset={-50}
  >
    Inscreve-te já
  </ScrollLink>
        <motion.div
          initial={{ right: "-1rem" }}
          whileInView={{ right: "4rem" }}
          transition={transition}
          className="heart-rate"
        >
          <img src={heart} alt="" />
          <span>Batimento cardíaco</span>
          <span>116 bpm</span>
        </motion.div>

        <img className="hero-img" src={hero_image} alt="" />
        <motion.img
          initial={{ right: mobile ? "11rem" : "11rem" }}
          whileInView={{ right: "20rem" }}
          transition={transition}
          className="hero-back"
          src={hero_back}
          alt=""
        />

        <motion.div
          initial={{ right: "32rem" }}
          whileInView={{ right: "28rem" }}
          transition={transition}
          className="calories"
        >
          <img src={calories} alt="" />
          <div>
            <span>Calorias queimadas</span>
            <span>220 kcal</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
