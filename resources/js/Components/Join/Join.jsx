// resources/js/Components/Join/Join.jsx
import React, { useState } from "react";
import { router } from "@inertiajs/react";
import "./Join.css";

const Join = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState(null); // {tipo:'ok'|'erro', texto}

    const handleJoin = (e) => {
        e.preventDefault();
        if (!email) return;
        setLoading(true);
        setFeedback(null);

        router.post("/solicitar-inscricao", { email }, {
            preserveScroll: true,
            onSuccess: () => {
                setFeedback({ tipo: "ok", texto: "Solicitação enviada! Verifica o teu e-mail." });
                setEmail("");
            },
            onError: (errs) => {
                setFeedback({
                    tipo: "erro",
                    texto: errs.email || "Não foi possível enviar. Tenta novamente.",
                });
            },
            onFinish: () => setLoading(false),
        });
    };

    return (
        <div className="Join" id="join-us">
            <div className="left-j">
                <hr />
                <div>
                    <span className="stroke-text">Pronto para</span>
                    <span> subir de nível</span>
                </div>
                <div>
                    <span>o teu corpo</span>
                    <span className="stroke-text"> connosco?</span>
                </div>
            </div>
            <div className="right-j">
                <form className="email-container" onSubmit={handleJoin}>
                    <input
                        type="email"
                        name="user_email"
                        placeholder="Introduz o teu e-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button type="submit" className="btn btn-j" disabled={loading}>
                        {loading ? "A enviar..." : "Inscrever"}
                    </button>
                </form>
                {feedback && (
                    <p
                        style={{
                            color: feedback.tipo === "ok" ? "#4caf50" : "#ff6b6b",
                            marginTop: "0.75rem",
                            fontSize: "0.85rem",
                        }}
                    >
                        {feedback.texto}
                    </p>
                )}
            </div>
        </div>
    );
};

export default Join;
