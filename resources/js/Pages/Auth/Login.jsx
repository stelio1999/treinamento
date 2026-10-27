// resources/js/Pages/Auth/Login.jsx
import React, { useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { motion } from "framer-motion";
import "../../App.css";
import "./Login.css";

export default function Login() {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post("/login", {
            onFinish: () => reset("password"),
        });
    };

    const transition = { type: "spring", duration: 0.9 };

    return (
        <>
            <Head title="Entrar" />
            <div className="app-welcome" style={{ justifyContent: 'center', alignItems: 'center' }}>

            <div className="login-page">
                {/* Blur decorativo igual ao Welcome */}
                <div className="blur login-blur-1" />
                <div className="blur login-blur-2" />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={transition}
                    className="login-card"
                >
                    {/* Logo / título */}
                    <div className="login-header">
                        <div className="login-logo">FC</div>
                        <h1 className="login-title">
                            Bem-vindo ao <span className="stroke-text">FitClub</span>
                        </h1>
                        <p className="login-subtitle">
                            Entra na tua conta para continuares a treinar.
                        </p>
                    </div>

                    {/* Formulário */}
                    <form onSubmit={submit} className="login-form">
                        <div className="login-field">
                            <label htmlFor="email">E-mail</label>
                            <input
                                id="email"
                                type="email"
                                autoComplete="username"
                                placeholder="exemplo@fitclub.co.mz"
                                value={data.email}
                                onChange={(e) => setData("email", e.target.value)}
                                className="login-input"
                                required
                            />
                            {errors.email && (
                                <p className="login-error">{errors.email}</p>
                            )}
                        </div>

                        <div className="login-field">
                            <label htmlFor="password">Palavra-passe</label>
                            <div className="login-password-wrap">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    value={data.password}
                                    onChange={(e) => setData("password", e.target.value)}
                                    className="login-input"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((s) => !s)}
                                    className="login-eye"
                                    aria-label="Mostrar palavra-passe"
                                >
                                    {showPassword ? "🙈" : "👁️"}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="login-error">{errors.password}</p>
                            )}
                        </div>

                        <div className="login-row">
                            <label className="login-checkbox">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData("remember", e.target.checked)}
                                />
                                <span>Lembrar-me</span>
                            </label>

                            <a href="#" className="login-forgot">
                                Esqueceste-te?
                            </a>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="btn login-btn"
                        >
                            {processing ? "A entrar..." : "Entrar"}
                        </button>
                    </form>

                    {/* Rodapé */}
                    <div className="login-footer">
                        <p>
                            Ainda não tens conta?{" "}
                            <Link href="/" className="login-link">
                                Voltar ao início
                            </Link>
                        </p>
                        <p className="login-contact">
                            Contacta-nos: <a href="mailto:info@fitclub.co.mz">info@fitclub.co.mz</a>
                        </p>
                    </div>
                </motion.div>
            </div>
            </div>
        </>
    );
}
