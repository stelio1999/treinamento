// resources/js/Components/Footer/Footer.jsx
import React from 'react';
import { MessageCircle } from 'lucide-react';
import './Footer.css';
import wp from '../../assets/whatsapp-logo.jpg';

const WHATSAPP_NUMBER = '258841639601';
const WHATSAPP_MSG = encodeURIComponent('Olá! Vim pelo site FitClub e gostaria de saber mais.');

export default function Footer() {
    const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`;

    return (
        <>
            <div className="Footer-container" id="about">
                <section className="footer">
                    <div className="box-container">
                        <div className="box">
                            <h3>Endereço</h3>
                            <a href="https://maps.google.com/?q=Av.+Julius+Nyerere,+Maputo" target="_blank" rel="noopener noreferrer">
                                Av. Julius Nyerere, Maputo — Moçambique
                            </a>
                        </div>

                        <div className="box">
                            <h3>Contacto</h3>
                            <a href={`tel:+${WHATSAPP_NUMBER}`}>+258 84 163 9601</a>
                            <a href="mailto:info@fitclub.co.mz">info@fitclub.co.mz</a>
                        </div>

                        <div className="box">
                            <h3>Segue-nos</h3>
                            <div className="home__social-icon">
                                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
                                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="credits">
                    <p>© {new Date().getFullYear()} FitClub Moçambique. Todos os direitos reservados.</p>
                </div>
            </div>

            {/* ✅ Botão flutuante do WhatsApp — sempre visível */}
            <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Falar no WhatsApp"
                className="whatsapp-float"
            >
                {/* Ícone SVG oficial do WhatsApp (lucide não tem ícone de marca) */}
                <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.6 6.32A7.84 7.84 0 0 0 12.05 4a7.94 7.94 0 0 0-6.87 11.9L4 20l4.23-1.11a7.93 7.93 0 0 0 3.82.97h.01a7.94 7.94 0 0 0 5.54-13.54zM12.05 18.53h-.01a6.6 6.6 0 0 1-3.36-.92l-.24-.14-2.5.66.67-2.44-.16-.25a6.6 6.6 0 1 1 12.24-3.5 6.6 6.6 0 0 1-6.64 6.59zm3.62-4.94c-.2-.1-1.17-.58-1.35-.64-.18-.07-.31-.1-.44.1-.13.2-.5.64-.62.77-.11.13-.23.15-.43.05-.2-.1-.84-.31-1.6-.99a5.99 5.99 0 0 1-1.1-1.37c-.12-.2-.01-.31.09-.41.09-.09.2-.23.3-.35.1-.12.13-.2.2-.34.07-.13.03-.25-.02-.35-.05-.1-.44-1.07-.61-1.46-.16-.38-.32-.33-.44-.34-.11 0-.24 0-.37 0-.13 0-.34.05-.51.25-.18.2-.67.65-.67 1.59 0 .94.69 1.85.79 1.98.1.13 1.36 2.07 3.29 2.9.46.2.82.32 1.1.41.46.15.88.13 1.21.08.37-.05 1.17-.48 1.34-.94.17-.46.17-.86.12-.94-.05-.08-.18-.13-.38-.23z" />
                </svg>
            </a>
        </>
    );
}
