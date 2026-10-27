// resources/js/Pages/Mensagens/Index.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Head, router, usePage, useForm } from '@inertiajs/react';
import { ArrowLeft, Send, MessageSquare } from 'lucide-react';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import ChatBolha from '../../Components/Mensagens/ChatBolha';

export default function Chat({ conversas = [], destinatario = null, mensagens = [] }) {
    const { auth } = usePage().props;
    const isAdmin = auth?.user?.role === 'admin';
    const myId = auth?.user?.id;

    const [lista, setLista] = useState(mensagens);
    const [abrirConversa, setAbrirConversa] = useState(!!destinatario || !isAdmin);
    const inputRef = useRef(null);
    const scrollRef = useRef(null);

    const form = useForm({
        conteudo: '',
        destinatario_id: destinatario?.id || '',
    });

    useEffect(() => {
        setLista(mensagens);
        // auto-scroll para o fim
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [mensagens]);

    const enviar = (e) => {
        e.preventDefault();
        if (!form.data.conteudo.trim()) return;
        form.post('/mensagens', {
            preserveScroll: true,
            onSuccess: () => {
                form.reset('conteudo');
                inputRef.current?.focus();
            },
        });
    };

    const abrirCom = (alunoId) => {
        router.get(`/admin/mensagens/${alunoId}`);
    };

    // ---------- Vista do ALUNO: apenas um chat com o admin ----------
    if (!isAdmin) {
        return (
            <AuthenticatedLayout>
                <Head title="Mensagens" />
                <div className="flex flex-col h-[calc(100vh-8rem)] px-2">
                    <div className="flex items-center gap-2 py-3">
                        <MessageSquare size={18} className="text-[#0A2540] dark:text-blue-400" />
                        <h1 className="text-base font-bold">
                            {destinatario?.name || 'Administração'}
                        </h1>
                    </div>

                    <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-1 pb-3">
                        {lista.length === 0 && (
                            <p className="text-center text-sm text-slate-500 py-10">
                                Sem mensagens ainda. Escreve a primeira!
                            </p>
                        )}
                        {lista.map((m) => (
                            <ChatBolha
                                key={m.id}
                                mensagem={m.conteudo}
                                minha={m.remetente_id === myId}
                            />
                        ))}
                    </div>

                    <form onSubmit={enviar} className="flex gap-2 py-2 border-t border-slate-200 dark:border-slate-800">
                        <input
                            ref={inputRef}
                            type="text"
                            value={form.data.conteudo}
                            onChange={(e) => form.setData('conteudo', e.target.value)}
                            placeholder="Escreve uma mensagem..."
                            className="flex-1 px-3 py-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-sm outline-none"
                        />
                        <button
                            type="submit"
                            disabled={form.processing || !form.data.conteudo.trim()}
                            className="w-10 h-10 rounded-full bg-[#0A2540] text-white flex items-center justify-center disabled:opacity-50"
                        >
                            <Send size={16} />
                        </button>
                    </form>
                </div>
            </AuthenticatedLayout>
        );
    }

    // ---------- Vista do ADMIN: lista de conversas OU chat aberto ----------
    return (
        <AuthenticatedLayout>
            <Head title="Mensagens" />

            {!abrirConversa || !destinatario ? (
                <>
                    <h1 className="text-lg font-bold px-2 py-3">Mensagens</h1>
                    <div className="space-y-2">
                        {conversas.length === 0 && (
                            <p className="text-center text-sm text-slate-500 py-10">Sem conversas.</p>
                        )}
                        {conversas.map((c) => (
                            <button
                                key={c.id}
                                onClick={() => abrirCom(c.id)}
                                className="card-fb w-full p-3 flex items-center gap-3 text-left active:scale-[.99] transition"
                            >
                                <div className="w-10 h-10 rounded-full bg-[#0A2540] text-white flex items-center justify-center shrink-0 overflow-hidden">
                                    {c.avatar
                                        ? <img src={c.avatar} alt="" className="w-full h-full object-cover" />
                                        : <MessageSquare size={18} />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold truncate">{c.name}</p>
                                    <p className="text-xs text-slate-500 truncate">
                                        {c.ultima || 'Sem mensagens'}
                                    </p>
                                </div>
                                {c.nao_lidas > 0 && (
                                    <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">
                                        {c.nao_lidas}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </>
            ) : (
                <div className="flex flex-col h-[calc(100vh-8rem)] px-2">
                    <div className="flex items-center gap-2 py-3">
                        <button onClick={() => router.get('/mensagens')} className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                            <ArrowLeft size={18} />
                        </button>
                        <h1 className="text-base font-bold truncate">{destinatario.name}</h1>
                    </div>

                    <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-1 pb-3">
                        {lista.length === 0 && (
                            <p className="text-center text-sm text-slate-500 py-10">
                                Sem mensagens ainda.
                            </p>
                        )}
                        {lista.map((m) => (
                            <ChatBolha
                                key={m.id}
                                mensagem={m.conteudo}
                                minha={m.remetente_id === myId}
                            />
                        ))}
                    </div>

                    <form onSubmit={enviar} className="flex gap-2 py-2 border-t border-slate-200 dark:border-slate-800">
                        <input
                            ref={inputRef}
                            type="text"
                            value={form.data.conteudo}
                            onChange={(e) => form.setData('conteudo', e.target.value)}
                            placeholder={`Mensagem para ${destinatario.name}...`}
                            className="flex-1 px-3 py-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-sm outline-none"
                        />
                        <button
                            type="submit"
                            disabled={form.processing || !form.data.conteudo.trim()}
                            className="w-10 h-10 rounded-full bg-[#0A2540] text-white flex items-center justify-center disabled:opacity-50"
                        >
                            <Send size={16} />
                        </button>
                    </form>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
