// resources/js/Pages/Admin/Solicitacoes.jsx
import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Check, X, Mail, Clock } from 'lucide-react';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';

export default function Solicitacoes({ solicitacoes }) {
    const [rejeitar, setRejeitar] = useState(null);
    const [motivo, setMotivo] = useState('');

    const aceitar = (s) => {
        if (confirm(`Aceitar a inscrição de ${s.email}? Vai ser criada uma conta com senha 12345678.`)) {
            router.post(`/admin/solicitacoes/${s.id}/aceitar`, {}, { preserveScroll: true });
        }
    };

    const confirmarRejeicao = (e) => {
        e.preventDefault();
        router.post(`/admin/solicitacoes/${rejeitar.id}/rejeitar`, { motivo_rejeicao: motivo }, {
            preserveScroll: true,
            onSuccess: () => { setRejeitar(null); setMotivo(''); },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Solicitações" />

            <h1 className="text-lg font-bold px-2 py-3">Solicitações</h1>

            <div className="space-y-2">
                {solicitacoes.data.length === 0 && (
                    <p className="text-center text-sm text-slate-500 py-10">Sem solicitações.</p>
                )}
                {solicitacoes.data.map((s) => (
                    <div key={s.id} className="card-fb p-4 space-y-2">
                        <div className="flex items-center justify-between">
                            <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${
                                s.estado === 'pendente' ? 'bg-yellow-100 text-yellow-700'
                                : s.estado === 'aceite'  ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                                {s.estado}
                            </span>
                            <span className="text-xs text-slate-400 inline-flex items-center gap-1">
                                <Clock size={12} /> {new Date(s.created_at).toLocaleString('pt-MZ')}
                            </span>
                        </div>

                        <div>
                            <p className="font-semibold text-sm flex items-center gap-1">
                                <Mail size={14} /> {s.email}
                            </p>
                            <p className="text-xs text-slate-500">Tipo: {s.tipo}</p>
                            {s.mensagem && (
                                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                                    {s.mensagem}
                                </p>
                            )}
                        </div>

                        {s.estado === 'pendente' && s.tipo === 'inscricao' && (
                            <div className="flex gap-2 pt-1">
                                <button
                                    onClick={() => aceitar(s)}
                                    className="flex-1 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold flex items-center justify-center gap-1"
                                >
                                    <Check size={14} /> Aceitar
                                </button>
                                <button
                                    onClick={() => setRejeitar(s)}
                                    className="flex-1 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold flex items-center justify-center gap-1"
                                >
                                    <X size={14} /> Rejeitar
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Modal de rejeição */}
            {rejeitar && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
                    <form onSubmit={confirmarRejeicao} className="card-fb w-full max-w-sm p-5 space-y-3">
                        <div className="flex items-center justify-between">
                            <h2 className="font-bold">Rejeitar inscrição</h2>
                            <button type="button" onClick={() => setRejeitar(null)}><X size={18} /></button>
                        </div>
                        <p className="text-xs text-slate-500">E-mail: {rejeitar.email}</p>
                        <textarea
                            value={motivo}
                            onChange={(e) => setMotivo(e.target.value)}
                            placeholder="Motivo (opcional)"
                            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border text-sm"
                            rows={3}
                        />
                        <button type="submit" className="w-full py-2 rounded-lg bg-red-600 text-white font-semibold">
                            Confirmar rejeição
                        </button>
                    </form>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
