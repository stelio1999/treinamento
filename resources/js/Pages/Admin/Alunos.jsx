// resources/js/Pages/Admin/Alunos.jsx
import React, { useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import { User, Pencil, Trash2, KeyRound, X } from 'lucide-react';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';

export default function Alunos({ alunos }) {
    const [editar, setEditar] = useState(null);
    const [form, setForm] = useState({ name: '', email: '', telefone: '' });

    const abrirEdicao = (a) => {
        setEditar(a);
        setForm({ name: a.name, email: a.email, telefone: a.telefone || '' });
    };

    const guardar = (e) => {
        e.preventDefault();
        router.put(`/admin/alunos/${editar.id}`, form, {
            preserveScroll: true,
            onSuccess: () => setEditar(null),
        });
    };

    const apagar = (a) => {
        if (confirm(`Remover o aluno "${a.name}"? Esta ação é irreversível.`)) {
            router.delete(`/admin/alunos/${a.id}`, { preserveScroll: true });
        }
    };

    const resetar = (a) => {
        if (confirm(`Redefinir a palavra-passe de ${a.name} para 12345678?`)) {
            router.post(`/admin/alunos/${a.id}/resetar-senha`, {}, { preserveScroll: true });
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Alunos" />

            <div className="px-2 py-3 flex items-center justify-between">
                <h1 className="text-lg font-bold">Alunos</h1>
                <Link href="/admin/solicitacoes" className="text-xs font-semibold !text-slate-900 text-[!#0A2540] dark:!text-blue-100">
                    Ver solicitações
                </Link>
            </div>

            <div className="space-y-2">
                {alunos.data.length === 0 && (
                    <p className="text-center text-sm text-slate-500 py-10">Sem alunos ainda.</p>
                )}
                {alunos.data.map((a) => (
                    <div key={a.id} className="card-fb p-3 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#0A2540] text-white flex items-center justify-center shrink-0 overflow-hidden">
                            {a.avatar
                                ? <img src={a.avatar} alt="" className="w-full h-full object-cover" />
                                : <User size={18} />}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm truncate">{a.name}</p>
                            <p className="text-xs text-slate-500 truncate">{a.email}</p>
                        </div>
                        <button onClick={() => abrirEdicao(a)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                            <Pencil size={16} />
                        </button>
                        <button onClick={() => resetar(a)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                            <KeyRound size={16} />
                        </button>
                        <button onClick={() => apagar(a)} className="p-2 rounded-lg hover:bg-red-50 text-red-500">
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
            </div>

            {/* Modal de edição */}
            {editar && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
                    <form onSubmit={guardar} className="card-fb w-full max-w-sm p-5 space-y-3">
                        <div className="flex items-center justify-between">
                            <h2 className="font-bold">Editar aluno</h2>
                            <button type="button" onClick={() => setEditar(null)}><X size={18} /></button>
                        </div>
                        <input
                            type="text" value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="Nome"
                            className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border text-sm"
                        />
                        <input
                            type="email" value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            placeholder="E-mail"
                            className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border text-sm"
                        />
                        <input
                            type="text" value={form.telefone}
                            onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                            placeholder="Contacto"
                            className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border text-sm"
                        />
                        <button type="submit" className="w-full btn-primary">Guardar</button>
                    </form>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
