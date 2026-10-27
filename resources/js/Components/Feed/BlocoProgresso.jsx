// resources/js/Components/Feed/BlocoProgresso.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Check, Loader2, Save, StickyNote } from 'lucide-react';
import BlocoTexto from './BlocoTexto';

export default function BlocoProgresso({
    bloco,
    progressoInicial = null,
    abertoPorPadrao = false,
    onToggle,               // ✅ NOVA prop
}) {
    const [concluido, setConcluido] = useState(progressoInicial?.concluido ?? false);
    const [nota, setNota] = useState(progressoInicial?.nota ?? '');
    const [mostrarNota, setMostrarNota] = useState(abertoPorPadrao || !!progressoInicial?.nota);
    const [savingToggle, setSavingToggle] = useState(false);
    const [savingNota, setSavingNota] = useState(false);
    const [guardadoOk, setGuardadoOk] = useState(false);

    const toggleConcluido = async () => {
        const novo = !concluido;
        setConcluido(novo);
        // ✅ Avisa o pai IMEDIATAMENTE (barra muda em tempo real)
        if (onToggle) onToggle(novo);

        setSavingToggle(true);
        try {
            await axios.post('/progresso/toggle', {
                bloco_id: bloco.id,
                concluido: novo,
            });
        } catch (e) {
            // rollback se falhar
            setConcluido(!novo);
            if (onToggle) onToggle(!novo);
        } finally {
            setSavingToggle(false);
        }
    };

    const guardarNota = async () => {
        setSavingNota(true);
        setGuardadoOk(false);
        try {
            await axios.post('/progresso/nota', {
                bloco_id: bloco.id,
                nota,
            });
            setGuardadoOk(true);
            setTimeout(() => setGuardadoOk(false), 2000);
        } catch (e) {
            alert('Não foi possível guardar a nota.');
        } finally {
            setSavingNota(false);
        }
    };

    return (
        <div
            className={`rounded-2xl border transition ${
                concluido
                    ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50/60 dark:bg-emerald-900/10'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
            } p-3.5`}
        >
            <div className="flex items-start gap-3">
                <button
                    type="button"
                    onClick={toggleConcluido}
                    disabled={savingToggle}
                    aria-label={concluido ? 'Desmarcar bloco' : 'Marcar bloco como concluído'}
                    className={`shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition ${
                        concluido
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'border-slate-300 dark:border-slate-600 text-transparent hover:border-emerald-500'
                    }`}
                >
                    {savingToggle ? (
                        <Loader2 size={14} className="animate-spin text-white" />
                    ) : (
                        <Check size={14} strokeWidth={3} />
                    )}
                </button>

                <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-1">
                        Bloco {Number(bloco.ordem) + 1}
                    </p>
                    <BlocoTexto conteudo={bloco.conteudo} />
                </div>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-2.5">
                <button
                    type="button"
                    onClick={() => setMostrarNota((v) => !v)}
                    className="text-xs flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-[#0A2540] dark:hover:text-blue-400 transition"
                >
                    <StickyNote size={13} />
                    {mostrarNota
                        ? 'Esconder nota'
                        : nota
                            ? 'Ver/editar nota'
                            : 'Adicionar nota'}
                </button>

                {concluido && (
                    <span className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400">
                        Concluído
                    </span>
                )}
            </div>

            {mostrarNota && (
                <div className="mt-2 space-y-2">
                    <textarea
                        value={nota}
                        onChange={(e) => setNota(e.target.value)}
                        placeholder="Escreve aqui a tua nota sobre este bloco..."
                        rows={3}
                        className="w-full text-sm px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-[#0A2540] resize-none"
                    />
                    <div className="flex items-center justify-between gap-2">
                        <span className={`text-xs ${guardadoOk ? 'text-emerald-600' : 'text-transparent'}`}>
                            {guardadoOk ? '✓ Guardado' : '·'}
                        </span>
                        <button
                            type="button"
                            onClick={guardarNota}
                            disabled={savingNota}
                            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#0A2540] text-white disabled:opacity-60"
                        >
                            {savingNota ? (
                                <Loader2 size={13} className="animate-spin" />
                            ) : (
                                <Save size={13} />
                            )}
                            Guardar nota
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
