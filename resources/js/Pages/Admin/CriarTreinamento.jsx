// resources/js/Pages/Admin/CriarTreinamento.jsx
import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeft, Plus, Trash2, Loader2 } from 'lucide-react';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import EditorTextoRico from '../../Components/Admin/EditorTextoRico';
import BotaoIA from '../../Components/Admin/BotaoIA';
import SeletorImagemFundo from '../../Components/Admin/SeletorImagemFundo';

export default function CriarTreinamento({ alunos = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        titulo: '',
        descricao: '',
        data_hora: '',
        tipo: 'publico',
        aluno_id: '',
        imagem_fundo: null,
        blocos: [{ conteudo: '', ordem: 0 }],
    });

    const addBloco = () =>
        setData('blocos', [...data.blocos, { conteudo: '', ordem: data.blocos.length }]);

    const updateBloco = (i, conteudo) => {
        const copy = [...data.blocos];
        copy[i].conteudo = conteudo;
        setData('blocos', copy);
    };

    const removeBloco = (i) => {
        if (data.blocos.length === 1) return;
        setData('blocos', data.blocos.filter((_, idx) => idx !== i));
    };

    const submit = (e) => {
        e.preventDefault();
        post('/admin/treinamentos');
    };

    return (
        <AuthenticatedLayout>
            <Head title="Novo Treinamento" />

            <div className="flex items-center gap-2 px-2 py-3">
                <Link href="/admin/dashboard" className="p-2 rounded-full bg-white dark:bg-slate-900">
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="text-base font-bold">Criar Treinamento</h1>
            </div>

            <form onSubmit={submit} className="space-y-4 px-1">
                <div>
                    <label className="text-xs font-semibold">Título</label>
                    <input
                        type="text"
                        value={data.titulo}
                        onChange={(e) => setData('titulo', e.target.value)}
                        className="mt-1 w-full px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm"
                    />
                    {errors.titulo && <p className="text-xs text-red-500 mt-1">{errors.titulo}</p>}
                </div>

                <div>
                    <label className="text-xs font-semibold">Data e hora</label>
                    <input
                        type="datetime-local"
                        value={data.data_hora}
                        onChange={(e) => setData('data_hora', e.target.value)}
                        className="mt-1 w-full px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm"
                    />
                    {errors.data_hora && <p className="text-xs text-red-500 mt-1">{errors.data_hora}</p>}
                </div>

                <div>
                    <label className="text-xs font-semibold">Tipo</label>
                    <div className="flex gap-2 mt-1">
                        {['publico', 'privado'].map((t) => (
                            <button
                                type="button"
                                key={t}
                                onClick={() => setData('tipo', t)}
                                className={`flex-1 py-2 rounded-xl text-sm font-medium ${
                                    data.tipo === t
                                        ? 'bg-[#0A2540] text-white'
                                        : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700'
                                }`}
                            >
                                {t === 'publico' ? 'Público' : 'Privado'}
                            </button>
                        ))}
                    </div>
                </div>

                {data.tipo === 'privado' && (
                    <div>
                        <label className="text-xs font-semibold">Aluno</label>
                        <select
                            value={data.aluno_id}
                            onChange={(e) => setData('aluno_id', e.target.value)}
                            className="mt-1 w-full px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm"
                        >
                            <option value="">— Selecionar —</option>
                            {alunos.map((a) => (
                                <option key={a.id} value={a.id}>{a.name}</option>
                            ))}
                        </select>
                        {errors.aluno_id && <p className="text-xs text-red-500 mt-1">{errors.aluno_id}</p>}
                    </div>
                )}

                <div>
                    <label className="text-xs font-semibold">Imagem de fundo</label>
                    <div className="mt-1">
                        <SeletorImagemFundo onChange={(f) => setData('imagem_fundo', f)} />
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-semibold">Blocos de instrução</label>
                        <button type="button" onClick={addBloco} className="text-xs flex items-center gap-1 text-[#0A2540] dark:text-blue-400 font-semibold">
                            <Plus size={14} /> Adicionar
                        </button>
                    </div>

                    <div className="space-y-3">
                        {data.blocos.map((b, i) => (
                            <div key={i} className="space-y-2">
                                <EditorTextoRico value={b.conteudo} onChange={(v) => updateBloco(i, v)} />
                                <div className="flex items-center justify-between">
                                    <BotaoIA texto={b.conteudo} onMelhorado={(v) => updateBloco(i, v)} />
                                    {data.blocos.length > 1 && (
                                        <button type="button" onClick={() => removeBloco(i)} className="text-xs text-red-500 flex items-center gap-1">
                                            <Trash2 size={12} /> Remover
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <button type="submit" disabled={processing} className="w-full btn-primary flex items-center justify-center gap-2">
                    {processing && <Loader2 size={16} className="animate-spin" />}
                    Guardar Treinamento
                </button>
            </form>
        </AuthenticatedLayout>
    );
}
