// resources/js/Components/Mensagens/ChatBolha.jsx
import React from 'react';

export default function ChatBolha({ mensagem, minha = false, autor }) {
    return (
        <div className={`flex ${minha ? 'justify-end' : 'justify-start'} mb-2`}>
            <div
                className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-sm leading-snug ${
                    minha
                        ? 'bg-[#0A2540] text-white rounded-br-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-bl-sm'
                }`}
            >
                {!minha && autor && (
                    <div className="text-[11px] font-semibold opacity-70 mb-0.5">{autor}</div>
                )}
                <div>{mensagem}</div>
            </div>
        </div>
    );
}
