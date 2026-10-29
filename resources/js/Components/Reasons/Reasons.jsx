// resources/js/Components/Reasons/Reasons.jsx
import React from "react";
import image1 from "../../assets/image1.jpg";
import image2 from "../../assets/image2.jpg";
import image3 from "../../assets/image3.jpg";
import image4 from "../../assets/image4.jpg";
import nb from "../../assets/nb.png";
import adidas from "../../assets/adidas.png";
import nike from "../../assets/nike.png";
import tick from "../../assets/tick.png";
import "./Reasons.css";

const Reasons = () => {
  return (
    <div className="Reasons" id="reasons">
      <div className="left-r">
        <img src={image1} alt="" />
        <img src={image2} alt="" />
        <img src={image3} alt="" />
        <img src={image4} alt="" />
      </div>
      <div className="right-r">
        <span>algumas razões</span>
        <div>
          <span className="stroke-text">Porque </span>
          <span>nos escolher?</span>
        </div>
        <div className="details-r">
          <div><img src={tick} alt="" /><span>mais de 140 treinadores especialistas</span></div>
          <div><img src={tick} alt="" /><span>treina de forma mais inteligente e rápida</span></div>
          <div><img src={tick} alt="" /><span>1 programa grátis para novos membros</span></div>
          <div><img src={tick} alt="" /><span>parceiros de confiança</span></div>
        </div>
        <span style={{ color: "var(--gray)", fontWeight: "normal" }}>OS NOSSOS PARCEIROS</span>
        <div className="partners">
          <img src={nb} alt="" />
          <img src={adidas} alt="" />
          <img src={nike} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Reasons;
