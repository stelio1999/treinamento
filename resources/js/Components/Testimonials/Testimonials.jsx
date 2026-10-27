// resources/js/Components/Testimonials/Testimonials.jsx
import React, { useState } from "react";
import "./Testimonials.css";
import leftArrow from "../../assets/leftArrow.png";
import rightArrow from "../../assets/rightArrow.png";
import { testimonialsData } from "../../data/testimonialsData";
import { motion } from "framer-motion";

const Testimonials = () => {
  const [selected, setSelected] = useState(0);
  const tLength = testimonialsData.length;
  const transition = { type: "spring", duration: 1 };

  return (
    <div className="testimonials">
      <div className="left-t">
        <span>Testemunhos</span>
        <span className="stroke-text">O que dizem</span>
        <span>sobre nós</span>
        <motion.span
          key={selected}
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={transition}
        >
          {testimonialsData[selected].review}
        </motion.span>
        <span>
          <span style={{ color: "var(--orange)" }}>{testimonialsData[selected].name}</span>{" "}
          — {testimonialsData[selected].status}
        </span>
      </div>
      <div className="right-t">
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          transition={{ ...transition, duration: 2 }}
          whileInView={{ opacity: 1, x: 0 }}
        ></motion.div>
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          transition={{ ...transition, duration: 2 }}
          whileInView={{ opacity: 1, x: 0 }}
        ></motion.div>
        <motion.img
          key={selected}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={transition}
          src={testimonialsData[selected].image}
          alt=""
        />
        <div className="arrows">
          <img
            src={leftArrow}
            alt=""
            onClick={() => setSelected(selected === 0 ? tLength - 1 : selected - 1)}
          />
          <img
            src={rightArrow}
            alt=""
            onClick={() => setSelected(selected === tLength - 1 ? 0 : selected + 1)}
          />
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
