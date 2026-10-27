// resources/js/Components/Feed/BlocoTexto.jsx
import React from 'react';

export default function BlocoTexto({ conteudo }) {
    return (
        <div
            className="prose prose-sm max-w-none text-slate-700 dark:text-slate-300 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: conteudo }}
        />
    );
}
