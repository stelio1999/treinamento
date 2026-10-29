// resources/js/Pages/Admin/Dashboard.jsx
import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Plus, Calendar, Lock, Globe, Pencil, Users, Inbox } from 'lucide-react';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';

export default function Dashboard({ treinos }) {
    return (
        <AuthenticatedLayout>
            <Head title="Dashboard Admin" />

            <div className="flex items-center justify-between px-2 py-3">
                <h1 className="text-lg font-bold">Treinamentos</h1>

                <div className="flex items-center gap-2">

                    <Link
                        href="/admin/treinamentos/criar"
                        className="btn-primary text-xs flex items-center gap-1 !py-2"
                    >
                        <Plus size={14} /> Novo
                    </Link>
                </div>
            </div>

            <div className="space-y-2">
                {treinos?.data?.length === 0 && (
                    <p className="text-center text-sm text-slate-500 dark:text-slate-400 py-10">
                        Ainda não há treinamentos criados.
                    </p>
                )}

                {treinos?.data?.map((t) => (
                    <div key={t.id} className="card-fb p-3.5 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#0A2540] text-white flex items-center justify-center shrink-0">
                            <Calendar size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm truncate">{t.titulo}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {new Date(t.data_hora).toLocaleString('pt-MZ')}
                                {' · '}
                                {t.tipo === 'privado' ? (
                                    <span className="inline-flex items-center gap-1">
                                        <Lock size={11} /> {t.aluno?.name ?? 'Privado'}
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1">
                                        <Globe size={11} /> Público
                                    </span>
                                )}
                            </p>
                        </div>
                        <Link
                            href={`/admin/treinamentos/${t.id}/editar`}
                            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800  !text-slate-900 !bg-white dark:!text-white dark:!bg-[#0A2540]"
                        >
                            <Pencil size={16} />
                        </Link>
                    </div>
                ))}
            </div>
        </AuthenticatedLayout>
    );
}
