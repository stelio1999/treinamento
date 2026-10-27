// resources/js/Pages/Aluno/Resultados.jsx
import React, { useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, Filter, Trophy, FileText, ChevronRight } from 'lucide-react';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';

export default function Resultados({ treinos = [], filtros = {} }) {
    const [de, setDe] = useState(filtros.de || '');
    const [ate, setAte] = useState(filtros.ate || '');

    const aplicar = (e) => {
        e.preventDefault();
        router.get('/resultados', { de, ate }, { preserveScroll: true });
    };

    const limpar = () => {
        setDe('');
        setAte('');
        router.get('/resultados', {}, { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Resultados" />

            <div className="flex items-center gap-2 px-2 py-3">
                <Link href="/feed" className="p-2 rounded-full bg-white dark:bg-slate-900">
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="text-lg font-bold">Os meus resultados</h1>
            </div>

            {/* Filtro por data */}
            <form onSubmit={aplicar} className="card-fb p-3 mb-4">
                <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <Filter size={14} /> Filtrar por data
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="text-[10px] uppercase text-slate-400">De</label>
                        <input
                            type="date"
                            value={de}
                            onChange={(e) => setDe(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] uppercase text-slate-400">Até</label>
                        <input
                            type="date"
                            value={ate}
                            onChange={(e) => setAte(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                        />
                    </div>
                </div>
                <div className="flex gap-2 mt-3">
                    <button type="submit" className="flex-1 btn-primary text-sm">
                        Aplicar filtro
                    </button>
                    <button type="button" onClick={limpar} className="btn-ghost text-sm">
                        Limpar
                    </button>
                </div>
            </form>

            {/* Lista de treinos */}
            {treinos.length === 0 ? (
                <div className="text-center py-16 px-4">
                    <Trophy size={48} className="mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Ainda não há treinos realizados no período selecionado.
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {treinos.map((t) => (
                        <Link
                            key={t.id}
                            href={`/resultados/${t.id}`}
                            className="card-fb block p-3 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
                        >
                            <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 shrink-0">
                                {t.imagem_url ? (
                                    <img
                                        src={t.imagem_url}
                                        alt={t.titulo}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <FileText size={22} className="text-slate-400" />
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                    {t.titulo}
                                </p>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                                    <Calendar size={11} />
                                    {new Date(t.data_hora).toLocaleString('pt-MZ', {
                                        day: '2-digit', month: '2-digit', year: 'numeric',
                                        hour: '2-digit', minute: '2-digit',
                                    })}
                                </p>
                                <div className="flex items-center gap-2 mt-1.5 text-[10px] font-semibold">
                                    <span className="text-emerald-600 dark:text-emerald-400">
                                        {t.concluidos}/{t.total_blocos} blocos
                                    </span>
                                    {t.notas > 0 && (
                                        <span className="text-amber-600 dark:text-amber-400">
                                            · {t.notas} nota{t.notas > 1 ? 's' : ''}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <ChevronRight size={18} className="text-slate-400 shrink-0" />
                        </Link>
                    ))}
                </div>
            )}
        </AuthenticatedLayout>
    );
}
