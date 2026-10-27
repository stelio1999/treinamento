// resources/js/Components/Contact/Contact.jsx
import React, { useState } from "react";
import { router } from "@inertiajs/react";
import "./Contact.css";

const Contact = () => {
    const [formData, setFormData] = useState({
        nome: "", email: "", telefone: "", idade: "", plano: "", mensagem: "",
    });
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState(null);

    const validateForm = () => {
        let errors = [];
        if (!formData.nome.trim()) errors.push("O nome é obrigatório.");
        if (!formData.email.trim()) errors.push("O e-mail é obrigatório.");
        else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.push("E-mail inválido.");
        if (!formData.mensagem.trim()) errors.push("A mensagem é obrigatória.");
        if (errors.length > 0) { alert(errors.join("\n")); return false; }
        return true;
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const enviar = () => {
        if (!validateForm()) return;
        setLoading(true);
        setFeedback(null);
        router.post("/contacto", formData, {
            preserveScroll: true,
            onSuccess: () => {
                setFeedback({ tipo: "ok", texto: "Mensagem enviada! Verifica o teu e-mail." });
                setFormData({ nome: "", email: "", telefone: "", idade: "", plano: "", mensagem: "" });
            },
            onError: () => {
                setFeedback({ tipo: "erro", texto: "Não foi possível enviar. Tenta novamente." });
            },
            onFinish: () => setLoading(false),
        });
    };

    return (
        <div className="container" id="contact">
            <div className="screen">
                <div className="screen-header">
                    <div className="screen-header-left">
                        <div className="screen-header-button close"></div>
                        <div className="screen-header-button maximize"></div>
                        <div className="screen-header-button minimize"></div>
                    </div>
                    <div className="screen-header-right">
                        <div className="screen-header-ellipsis"></div>
                        <div className="screen-header-ellipsis"></div>
                        <div className="screen-header-ellipsis"></div>
                    </div>
                </div>
                <div className="screen-body">
                    <div className="screen-body-item left">
                        <div className="app-title">
                            <span>CONTACTA-</span>
                            <span>-NOS</span>
                        </div>
                        <div className="app-contact">INFO: +258 84 163 9601</div>
                    </div>
                    <div className="screen-body-item">
                        <div className="app-form">
                            <div className="app-form-group">
                                <input className="app-form-control" placeholder="NOME" id="nome"
                                    value={formData.nome} onChange={handleInputChange} />
                            </div>
                            <div className="app-form-group">
                                <input className="app-form-control" placeholder="E-MAIL" id="email"
                                    value={formData.email} onChange={handleInputChange} />
                            </div>
                            <div className="app-form-group">
                                <input className="app-form-control" placeholder="CONTACTO" id="telefone"
                                    value={formData.telefone} onChange={handleInputChange} />
                            </div>
                            <div className="app-form-group">
                                <input className="app-form-control" placeholder="IDADE" id="idade"
                                    value={formData.idade} onChange={handleInputChange} />
                            </div>
                            <div className="app-form-group">
                                <input className="app-form-control" placeholder="PLANO" id="plano"
                                    value={formData.plano} onChange={handleInputChange} />
                            </div>
                            <div className="app-form-group message">
                                <input className="app-form-control" placeholder="MENSAGEM" id="mensagem"
                                    value={formData.mensagem} onChange={handleInputChange} />
                            </div>
                            <div className="app-form-group buttons">
                                <button type="button" className="app-form-button"
                                    onClick={() => setFormData({ nome: "", email: "", telefone: "", idade: "", plano: "", mensagem: "" })}>
                                    CANCELAR
                                </button>
                                <button type="button" className="app-form-button" onClick={enviar} disabled={loading}>
                                    {loading ? "A ENVIAR..." : "ENVIAR"}
                                </button>
                            </div>
                            {feedback && (
                                <p style={{ color: feedback.tipo === "ok" ? "#4caf50" : "#ff6b6b", marginTop: "1rem", fontSize: "0.85rem" }}>
                                    {feedback.texto}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
