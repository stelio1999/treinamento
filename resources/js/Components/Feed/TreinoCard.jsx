// resources/js/Components/Feed/TreinoCard.jsx
import React from 'react';
import { Link } from '@inertiajs/react';
import { Clock, Lock, Globe } from 'lucide-react';
import BlocoTexto from './BlocoTexto';

export default function TreinoCard({ treino }) {
    const hora = new Date(treino.data_hora).toLocaleTimeString('pt-MZ', {
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <article className="card-fb overflow-hidden mb-4">
            {treino.imagem_url && (
                <div className="relative w-full h-44">
                    <img
                        src={treino.imagem_url}
                        alt={treino.titulo}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                        <h3 className="text-lg font-bold leading-tight drop-shadow">
                            {treino.titulo}
                        </h3>
                        <div className="flex items-center gap-2 text-xs mt-1 opacity-90">
                            <Clock size={14} /> {hora}
                            {treino.tipo === 'privado' ? (
                                <span className="flex items-center gap-1">
                                    <Lock size={12} /> Privado
                                </span>
                            ) : (
                                <span className="flex items-center gap-1">
                                    <Globe size={12} /> Público
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {!treino.imagem_url && (
                <div className="p-4 pb-0">
                    <h3 className="text-lg font-bold !text-slate-900 dark:!text-white">
                        {treino.titulo}
                    </h3>
                    <div className="flex items-center gap-2 text-xs mt-1 text-slate-500 dark:text-slate-400">
                        <Clock size={14} /> {hora}
                    </div>
                </div>
            )}

            <div className="p-4 space-y-3">
                {treino.blocos?.slice(0, 2).map((bloco) => (
                    <BlocoTexto key={bloco.id} conteudo={bloco.conteudo} />
                ))}
                <Link
                    href={`/treino/${treino.id}`}
                    className="block text-center btn-primary text-sm mt-2"
                >
                    Ver detalhes
                </Link>
            </div>
        </article>
    );
}
