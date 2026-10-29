// resources/js/Pages/Aluno/ResultadoDetalhe.jsx
import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft, Calendar, Check, X, StickyNote, TrendingUp,
    PieChart as PieIcon, ChevronDown, Maximize2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import BlocoTexto from '../../Components/Feed/BlocoTexto';
import {
    ResponsiveContainer, PieChart, Pie, Cell, Tooltip,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts';
import VideoYoutube from '../../Components/Feed/VideoYoutube';   // ✅

const CORES = {
    concluido: '#10b981',
    pendente: '#e2e8f0',
    barra: '#0A2540',
    comNota: '#f59e0b',
};

function CustomTooltip({ active, payload, label }) {
    if (!active || !payload || !payload.length) return null;
    return (
        <div className="rounded-lg bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-700 px-3 py-2 shadow-lg text-xs">
            <p className="font-semibold text-slate-700 dark:text-slate-200 mb-1">{label}</p>
            {payload.filter((p) => p.value > 0).map((p, i) => (
                <p key={i} style={{ color: p.color }} className="font-medium">{p.name}</p>
            ))}
        </div>
    );
}

export default function ResultadoDetalhe({ treino, blocos = [] }) {
    const [expandido, setExpandido] = useState(null); // id do bloco aberto

    const concluidos = blocos.filter((b) => b.concluido).length;
    const pendentes = blocos.length - concluidos;
    const total = blocos.length;
    const pct = total === 0 ? 0 : Math.round((concluidos / total) * 100);
    const notas = blocos.filter((b) => b.nota).length;

    const dadosPie = [
        { name: 'Concluídos', value: concluidos },
        { name: 'Pendentes', value: pendentes },
    ];

    const dadosBarras = blocos.map((b) => ({
        bloco: `B${Number(b.ordem) + 1}`,
        concluido: b.concluido ? 1 : 0,
        comNota: b.nota ? 1 : 0,
        pendente: b.concluido ? 0 : 1,
    }));

    const toggleExpandir = (id) => {
        setExpandido((atual) => (atual === id ? null : id));
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Resultado — ${treino.titulo}`} />

            {/* Topo */}
            <div className="flex items-center gap-2 px-2 py-3">
                <Link href="/resultados" className="p-2 rounded-full !text-slate-900 !bg-white dark:!bg-slate-100">
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="text-base font-bold truncate">{treino.titulo}</h1>
            </div>

            {/* Cartão do treino */}
            <div className="card-fb overflow-hidden mb-4">
                {treino.imagem_url && (
                    <img src={treino.imagem_url} alt={treino.titulo} className="w-full h-44 object-cover" />
                )}
                <div className="p-4">
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">{treino.titulo}</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                        <Calendar size={12} />
                        {new Date(treino.data_hora).toLocaleString('pt-MZ', {
                            day: '2-digit', month: 'long', year: 'numeric',
                            hour: '2-digit', minute: '2-digit',
                        })}
                    </p>

                    <div className="flex items-center gap-3 mt-3 text-xs font-semibold flex-wrap">
                        <span className="text-emerald-600 dark:text-emerald-400">
                            {concluidos}/{total} blocos concluídos
                        </span>
                        {notas > 0 && (
                            <span className="text-amber-600 dark:text-amber-400">
                                · {notas} nota{notas > 1 ? 's' : ''}
                            </span>
                        )}
                    </div>

                    <div className="mt-2 h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.9, ease: 'easeOut' }}
                            className="h-full bg-emerald-500"
                        />
                    </div>
                </div>
            </div>

            {/* ===== GRID DE BLOCOS ===== */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                <AnimatePresence>
                    {blocos.map((b) => {
                        const isExpanded = expandido === b.id;
                        return (
                            <motion.div
                                key={b.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                onClick={() => toggleExpandir(b.id)}
                                className={`
                                    rounded-2xl border p-3.5 cursor-pointer transition-shadow hover:shadow-md
                                    ${isExpanded ? 'col-span-full shadow-lg' : 'col-span-1'}
                                    ${b.concluido
                                        ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50/60 dark:bg-emerald-900/10'
                                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'}
                                `}
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <div className={`shrink-0 w-6 h-6 rounded-md flex items-center justify-center ${b.concluido
                                                ? 'bg-emerald-500 text-white'
                                                : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                                            }`}>
                                            {b.concluido ? <Check size={14} strokeWidth={3} /> : <X size={14} strokeWidth={2.5} />}
                                        </div>
                                        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 truncate">
                                            Bloco {Number(b.ordem) + 1}
                                        </p>
                                        {b.video_url && (
                                            <div className="mt-3">
                                                <VideoYoutube url={b.video_url} titulo={`Bloco ${Number(b.ordem) + 1}`} />
                                            </div>
                                        )}
                                    </div>

                                    <motion.div
                                        animate={{ rotate: isExpanded ? 180 : 0 }}
                                        transition={{ duration: 0.25 }}
                                        className="shrink-0 text-slate-400"
                                    >
                                        {isExpanded ? <ChevronDown size={16} /> : <Maximize2 size={14} />}
                                    </motion.div>
                                </div>

                                {/* Conteúdo — truncado quando está fechado */}
                                <div className={isExpanded ? 'mt-2' : 'mt-2 line-clamp-3'}>
                                    <BlocoTexto conteudo={b.conteudo} />
                                </div>

                                {/* Nota — só visível expandido */}
                                <AnimatePresence>
                                    {isExpanded && b.nota && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="mt-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-2.5">
                                                <p className="text-[10px] font-bold uppercase text-amber-700 dark:text-amber-400 mb-0.5 flex items-center gap-1">
                                                    <StickyNote size={11} /> Minha nota
                                                </p>
                                                <p className="text-xs text-amber-900 dark:text-amber-200 whitespace-pre-line">
                                                    {b.nota}
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Rodapé do card */}
                                <div className="mt-2 flex items-center justify-between text-[10px]">
                                    <span className={b.concluido ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-400'}>
                                        {b.concluido ? 'Concluído' : 'Pendente'}
                                    </span>
                                    {b.nota && (
                                        <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                                            <StickyNote size={10} /> Nota
                                        </span>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* ===== GRÁFICOS ===== */}
            {total > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Donut */}
                    <div className="card-fb p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <PieIcon size={16} className="text-[#0A2540] dark:text-blue-400" />
                            <h3 className="text-sm font-bold !text-slate-900 dark:!text-white  ">Visão geral</h3>
                        </div>
                        <div className="relative w-full h-52">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={dadosPie}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={55}
                                        outerRadius={85}
                                        paddingAngle={3}
                                        animationDuration={900}
                                    >
                                        <Cell fill={CORES.concluido} />
                                        <Cell fill={CORES.pendente} />
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-2xl font-extrabold text-[#0A2540] dark:text-white">{pct}%</span>
                                <span className="text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400">concluído</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-4 mt-1 text-xs flex-wrap">
                            <span className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                                <span className="text-slate-600 dark:text-slate-400">Concluídos ({concluidos})</span>
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                                <span className="text-slate-600 dark:text-slate-400">Pendentes ({pendentes})</span>
                            </span>
                        </div>
                    </div>

                    {/* Barras */}
                    <div className="card-fb p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingUp size={16} className="text-[#0A2540] dark:text-blue-400" />
                            <h3 className="text-sm font-bold !text-slate-900 dark:!text-white">Estado de cada bloco</h3>
                        </div>
                        <div className="w-full h-56">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={dadosBarras} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                                    <XAxis dataKey="bloco" tick={{ fontSize: 11 }} />
                                    <YAxis tick={{ fontSize: 11 }} allowDecimals={false} domain={[0, 1]} ticks={[0, 1]} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend wrapperStyle={{ fontSize: 11 }} />
                                    <Bar dataKey="concluido" name="Concluído" fill={CORES.barra} radius={[4, 4, 0, 0]} animationDuration={900} />
                                    <Bar dataKey="comNota" name="Com nota" fill={CORES.comNota} radius={[4, 4, 0, 0]} animationDuration={900} />
                                    <Bar dataKey="pendente" name="Pendente" fill={CORES.pendente} radius={[4, 4, 0, 0]} animationDuration={900} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 text-center">
                            Cada barra mostra o estado real do bloco — concluído, com nota ou pendente.
                        </p>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
