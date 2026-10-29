// resources/js/Pages/Admin/EditarTreinamento.jsx
import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeft, Plus, Trash2, Loader2, Video } from 'lucide-react';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import EditorTextoRico from '../../Components/Admin/EditorTextoRico';
import BotaoIA from '../../Components/Admin/BotaoIA';
import SeletorImagemFundo from '../../Components/Admin/SeletorImagemFundo';
import VideoYoutube from '../../Components/Feed/VideoYoutube';

export default function EditarTreinamento({ treinamento, alunos = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'put',
        titulo: treinamento.titulo,
        descricao: treinamento.descricao || '',
        data_hora: treinamento.data_hora?.slice(0, 16),
        tipo: treinamento.tipo,
        aluno_id: treinamento.aluno_id || '',
        imagem_fundo: null,
        blocos: treinamento.blocos?.length
            ? treinamento.blocos.map((b) => ({
                  conteudo: b.conteudo,
                  ordem: b.ordem,
                  video_url: b.video_url || '',
              }))
            : [{ conteudo: '', ordem: 0, video_url: '' }],
    });

    const addBloco = () =>
        setData('blocos', [
            ...data.blocos,
            { conteudo: '', ordem: data.blocos.length, video_url: '' }, // ✅ video_url incluído
        ]);

    const updateBloco = (i, v) => {
        const copy = [...data.blocos];
        copy[i].conteudo = v;
        setData('blocos', copy);
    };

    const updateVideo = (i, url) => {
        const copy = [...data.blocos];
        copy[i].video_url = url;
        setData('blocos', copy);
    };

    const removeBloco = (i) => {
        if (data.blocos.length === 1) return;
        setData('blocos', data.blocos.filter((_, idx) => idx !== i));
    };

    const submit = (e) => {
        e.preventDefault();
        post(`/admin/treinamentos/${treinamento.id}`);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Editar Treinamento" />

            <div className="flex items-center gap-2 px-2 py-3">
                <Link href="/admin/dashboard" className="p-2 rounded-full !text-slate-900 !bg-white dark:!bg-slate-100">
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="text-base font-bold">Editar Treinamento</h1>
            </div>

            <form onSubmit={submit} className="space-y-4 px-1">
                {/* Título */}
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

                {/* Data e hora */}
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

                {/* Tipo */}
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

                {/* Aluno (só se privado) */}
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
                                <option key={a.id} value={a.id}>
                                    {a.name}
                                </option>
                            ))}
                        </select>
                        {errors.aluno_id && <p className="text-xs text-red-500 mt-1">{errors.aluno_id}</p>}
                    </div>
                )}

                {/* Imagem de fundo */}
                <div>
                    <label className="text-xs font-semibold">Imagem de fundo (opcional)</label>
                    <div className="mt-1">
                        {treinamento.imagem_url && (
                            <img
                                src={treinamento.imagem_url}
                                alt=""
                                className="w-full h-32 object-cover rounded-xl mb-2"
                            />
                        )}
                        <SeletorImagemFundo onChange={(f) => setData('imagem_fundo', f)} />
                    </div>
                </div>

                {/* Blocos */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-semibold">Blocos de instrução</label>
                        <button
                            type="button"
                            onClick={addBloco}
                            className="text-xs flex items-center gap-1 text-[#0A2540] dark:text-blue-400 font-semibold"
                        >
                            <Plus size={14} /> Adicionar
                        </button>
                    </div>

                    <div className="space-y-4">
                        {data.blocos.map((b, i) => (
                            <div
                                key={i}
                                className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 space-y-3 bg-slate-50/50 dark:bg-slate-900/50"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                        Bloco {i + 1}
                                    </span>
                                    {data.blocos.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeBloco(i)}
                                            className="text-xs text-red-500 flex items-center gap-1"
                                        >
                                            <Trash2 size={12} /> Remover
                                        </button>
                                    )}
                                </div>

                                {/* Editor de texto */}
                                <EditorTextoRico
                                    value={b.conteudo}
                                    onChange={(v) => updateBloco(i, v)}
                                />
                                {errors[`blocos.${i}.conteudo`] && (
                                    <p className="text-xs text-red-500">
                                        {errors[`blocos.${i}.conteudo`]}
                                    </p>
                                )}

                                {/* ✅ Campo Vídeo do YouTube */}
                                <div>
                                    <label className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                                        <Video size={13} /> Vídeo do YouTube (opcional)
                                    </label>
                                    <input
                                        type="url"
                                        placeholder="https://www.youtube.com/watch?v=..."
                                        value={b.video_url || ''}
                                        onChange={(e) => updateVideo(i, e.target.value)}
                                        className="mt-1 w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                                    />
                                    {errors[`blocos.${i}.video_url`] && (
                                        <p className="text-xs text-red-500 mt-1">
                                            {errors[`blocos.${i}.video_url`]}
                                        </p>
                                    )}

                                    {/* Pré-visualização se o URL for válido */}
                                    {b.video_url && b.video_url.includes('youtu') && (
                                        <div className="mt-2">
                                            <VideoYoutube
                                                url={b.video_url}
                                                titulo={`Pré-visualização bloco ${i + 1}`}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* IA */}
                                <BotaoIA
                                    texto={b.conteudo}
                                    onMelhorado={(v) => updateBloco(i, v)}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={processing}
                    className="w-full btn-primary flex items-center justify-center gap-2"
                >
                    {processing && <Loader2 size={16} className="animate-spin" />}
                    Atualizar Treinamento
                </button>
            </form>
        </AuthenticatedLayout>
    );
}
