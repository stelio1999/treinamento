// resources/js/Components/Programs/Programs.jsx
import React from "react";
import "./Programs.css";
import { programsData } from "../../data/programsData";
import RightArrow from "../../assets/rightArrow.png";

const Programs = () => {
  return (
    <div className="Programs" id="programs">
      <div className="programs-header">
        <span className="stroke-text">Explora os nossos</span>
        <span>Programas</span>
        <span className="stroke-text">para te moldares</span>
      </div>
      <div className="programs-categories">
        {programsData.map((program, i) => (
          <div className="category" key={i}>
            {program.image}
            <span>{program.heading}</span>
            <span>{program.details}</span>
            <div className="join-now">
              <span>Solicite já</span>
              <img src={RightArrow} alt="Seta direita" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Programs;
