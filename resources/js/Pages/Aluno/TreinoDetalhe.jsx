// resources/js/Pages/Aluno/TreinoDetalhe.jsx
import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Clock, Lock, Globe } from 'lucide-react';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import BlocoProgresso from '../../Components/Feed/BlocoProgresso';

export default function TreinoDetalhe({ treino, progressos = {} }) {
    if (!treino) return null;

    // Estado local dos progressos — atualizado em tempo real
    const [progressosState, setProgressosState] = useState(progressos);

    const dataFmt = new Date(treino.data_hora).toLocaleString('pt-MZ', {
        weekday: 'long', day: '2-digit', month: 'long',
        hour: '2-digit', minute: '2-digit',
    });

    const totalBlocos = treino.blocos?.length ?? 0;
    const concluidos = treino.blocos?.filter(
        (b) => progressosState[b.id]?.concluido
    ).length ?? 0;
    const progressoPct = totalBlocos === 0
        ? 0
        : Math.round((concluidos / totalBlocos) * 100);

    // Atualiza o estado quando o filho toggla
    const handleToggle = (blocoId, novoEstado) => {
        setProgressosState((prev) => ({
            ...prev,
            [blocoId]: {
                ...(prev[blocoId] || {}),
                concluido: novoEstado,
            },
        }));
    };

    return (
        <AuthenticatedLayout>
            <Head title={treino.titulo} />

            <div className="flex items-center gap-2 px-2 py-3">
                <Link href="/feed" className="p-2 rounded-full !text-slate-900 !bg-white dark:bg-slate-900">
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="text-base font-bold truncate">{treino.titulo}</h1>
            </div>

            <article className="card-fb overflow-hidden">
                {treino.imagem_url && (
                    <img
                        src={treino.imagem_url}
                        alt={treino.titulo}
                        className="w-full h-52 object-cover"
                    />
                )}

                <div className="p-4">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                        {treino.titulo}
                    </h2>
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                        <span className="flex items-center gap-1">
                            <Clock size={14} /> {dataFmt}
                        </span>
                        <span className="flex items-center gap-1">
                            {treino.tipo === 'privado' ? (
                                <><Lock size={12} /> Privado</>
                            ) : (
                                <><Globe size={12} /> Público</>
                            )}
                        </span>
                    </div>

                    {/* Barra de progresso */}
                    <div className="mt-4">
                        <div className="flex justify-between text-xs font-semibold mb-1">
                            <span className="text-slate-600 dark:text-slate-400">Progresso</span>
                            <span className="text-[#0A2540] dark:text-blue-400">
                                {concluidos}/{totalBlocos} ({progressoPct}%)
                            </span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                            <div
                                className="h-full bg-emerald-500 transition-all duration-300"
                                style={{ width: `${progressoPct}%` }}
                            />
                        </div>
                    </div>

                    <div className="mt-5 space-y-3">
                        {treino.blocos?.map((b) => (
                            <BlocoProgresso
                                key={b.id}
                                bloco={b}
                                progressoInicial={progressosState[b.id] ?? null}
                                onToggle={(estado) => handleToggle(b.id, estado)}
                            />
                        ))}
                    </div>
                </div>
            </article>
        </AuthenticatedLayout>
    );
}
