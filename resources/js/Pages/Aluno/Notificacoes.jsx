// resources/js/Pages/Aluno/Notificacoes.jsx
import React, { useState, useEffect } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import {
    Bell, CheckCheck, Check, X, Mail, Calendar,
    UserPlus, Inbox, Send, Loader2,
} from 'lucide-react';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';

const ICONES = {
    solicitacao:          UserPlus,
    contacto:             Mail,
    contacto_respondido:  Mail,
    treino:               Calendar,
    info:                 Bell,
};

const CORES = {
    solicitacao:          'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    contacto:             'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    contacto_respondido:  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    treino:               'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
    info:                 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
};

export default function Notificacoes({ notificacoes, pendentes = [] }) {
    const { auth } = usePage().props;
    const isAdmin = auth?.user?.role === 'admin';
    const [processandoId, setProcessandoId] = useState(null);
    const [respostaTexto, setRespostaTexto] = useState({});
    const [respondendoId, setRespondendoId] = useState(null);

    // ✅ Estado local para refletir "lida" em tempo real
    const [lista, setLista] = useState(notificacoes.data || []);

    // Sincroniza se o backend enviar uma lista nova (ex.: após filtro/paginação)
    useEffect(() => {
        setLista(notificacoes.data || []);
    }, [notificacoes.data]);

    const pendentesSet = new Set(pendentes);

    const marcarTodasLidas = () => {
        // Atualização otimista
        setLista((prev) =>
            prev.map((n) =>
                n.lida_em ? n : { ...n, lida_em: new Date().toISOString() }
            )
        );
        router.patch('/notificacoes/todas-lidas', {}, { preserveScroll: true });
    };

    const abrirNotificacao = (n) => {
        // 1. Marca como lida localmente (instantâneo)
        if (!n.lida_em) {
            setLista((prev) =>
                prev.map((x) =>
                    x.id === n.id ? { ...x, lida_em: new Date().toISOString() } : x
                )
            );
            // 2. Persiste no backend (silencioso)
            router.patch(
                `/notificacoes/${n.id}/lida`,
                {},
                { preserveScroll: true, preserveState: true }
            );
        }

        // 3. Navega conforme o tipo
        const dados = n.data || {};
        switch (n.tipo) {
            case 'treino':
                router.get(dados.treinamento_id ? `/treino/${dados.treinamento_id}` : '/feed');
                break;
            case 'solicitacao':
            case 'contacto':
            case 'contacto_respondido':
                if (isAdmin) router.get('/admin/solicitacoes');
                break;
            default:
                break;
        }
    };

    const aceitar = (e, n) => {
        e.stopPropagation();
        const id = n.data?.solicitacao_id;
        if (!id) return;
        if (!confirm('Aceitar esta inscrição? O aluno receberá credenciais por e-mail.')) return;

        // Otimista: marca como lida e como respondida localmente
        setLista((prev) =>
            prev.map((x) =>
                x.id === n.id
                    ? {
                          ...x,
                          lida_em: x.lida_em || new Date().toISOString(),
                          respondida_em: new Date().toISOString(),
                      }
                    : x
            )
        );

        setProcessandoId(n.id);
        router.post(
            `/admin/solicitacoes/${id}/aceitar`,
            {},
            {
                preserveScroll: true,
                onFinish: () => setProcessandoId(null),
            }
        );
    };

    const rejeitar = (e, n) => {
        e.stopPropagation();
        const id = n.data?.solicitacao_id;
        if (!id) return;
        const motivo = prompt('Motivo da rejeição (opcional):');
        if (motivo === null) return;

        setLista((prev) =>
            prev.map((x) =>
                x.id === n.id
                    ? {
                          ...x,
                          lida_em: x.lida_em || new Date().toISOString(),
                          respondida_em: new Date().toISOString(),
                      }
                    : x
            )
        );

        setProcessandoId(n.id);
        router.post(
            `/admin/solicitacoes/${id}/rejeitar`,
            { motivo_rejeicao: motivo },
            {
                preserveScroll: true,
                onFinish: () => setProcessandoId(null),
            }
        );
    };

    const enviarRespostaContacto = (e, n) => {
        e.stopPropagation();
        const texto = (respostaTexto[n.id] || '').trim();
        if (!texto) return;

        setLista((prev) =>
            prev.map((x) =>
                x.id === n.id
                    ? {
                          ...x,
                          lida_em: x.lida_em || new Date().toISOString(),
                          respondida_em: new Date().toISOString(),
                          resposta: texto,
                      }
                    : x
            )
        );

        setRespondendoId(n.id);
        router.post(
            `/admin/notificacoes/${n.id}/responder-contacto`,
            { resposta: texto },
            {
                preserveScroll: true,
                onSuccess: () => setRespostaTexto((prev) => ({ ...prev, [n.id]: '' })),
                onFinish: () => setRespondendoId(null),
            }
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="Notificações" />

            <div className="flex items-center justify-between px-2 py-3">
                <h1 className="text-lg font-bold">Notificações</h1>
                <button
                    onClick={marcarTodasLidas}
                    className="text-xs flex items-center gap-1 text-[#0A2540] dark:text-blue-400 font-semibold"
                >
                    <CheckCheck size={14} /> Marcar todas
                </button>
            </div>

            <div className="space-y-2">
                {lista.length === 0 && (
                    <div className="text-center py-16 px-4">
                        <Inbox size={40} className="mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Sem notificações.</p>
                    </div>
                )}

                {lista.map((n) => {
                    const Icone = ICONES[n.tipo] || Bell;
                    const cor = CORES[n.tipo] || CORES.info;
                    const lida = !!n.lida_em;
                    const respondida = !!n.respondida_em;
                    const solicitacaoId = n.data?.solicitacao_id;

                    const mostrarBotoesAceitarRejeitar =
                        isAdmin &&
                        n.tipo === 'solicitacao' &&
                        solicitacaoId &&
                        pendentesSet.has(solicitacaoId) &&
                        !respondida;

                    const mostrarCampoContacto = isAdmin && n.tipo === 'contacto' && !respondida;

                    const processando = processandoId === n.id;
                    const aEnviarResposta = respondendoId === n.id;

                    return (
                        <div
                            key={n.id}
                            onClick={() => abrirNotificacao(n)}
                            className={`card-fb p-3.5 flex gap-3 cursor-pointer active:scale-[.99] transition ${
                                !lida ? 'border-l-4 border-[#0A2540] bg-blue-50/40 dark:bg-blue-900/10' : ''
                            }`}
                        >
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${cor}`}>
                                <Icone size={18} />
                            </div>

                            <div className="min-w-0 flex-1">
                                <div className="flex items-start justify-between gap-2">
                                    <p className={`text-sm ${lida ? 'text-slate-600 dark:text-slate-400' : 'font-semibold text-slate-900 dark:text-white'}`}>
                                        {n.titulo}
                                    </p>
                                    {!lida && (
                                        <span className="shrink-0 w-2 h-2 rounded-full bg-blue-500" />
                                    )}
                                    {respondida && (
                                        <span className="shrink-0 text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                                            Respondida
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{n.mensagem}</p>
                                <p className="text-[10px] text-slate-400 mt-1">
                                    {new Date(n.created_at).toLocaleString('pt-MZ')}
                                </p>

                                {respondida && n.tipo === 'contacto' && n.resposta && (
                                    <div className="mt-2 text-xs bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 rounded-lg p-2">
                                        <strong>Tua resposta:</strong> {n.resposta}
                                    </div>
                                )}

                                {mostrarBotoesAceitarRejeitar && (
                                    <div className="flex gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
                                        <button
                                            onClick={(e) => aceitar(e, n)}
                                            disabled={processando}
                                            className="flex-1 py-1.5 rounded-lg bg-green-600 text-white text-xs font-semibold flex items-center justify-center gap-1 disabled:opacity-60"
                                        >
                                            <Check size={13} /> {processando ? '...' : 'Aceitar'}
                                        </button>
                                        <button
                                            onClick={(e) => rejeitar(e, n)}
                                            disabled={processando}
                                            className="flex-1 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold flex items-center justify-center gap-1 disabled:opacity-60"
                                        >
                                            <X size={13} /> Rejeitar
                                        </button>
                                    </div>
                                )}

                                {mostrarCampoContacto && (
                                    <div className="mt-2 space-y-1.5" onClick={(e) => e.stopPropagation()}>
                                        <textarea
                                            value={respostaTexto[n.id] || ''}
                                            onChange={(e) =>
                                                setRespostaTexto((prev) => ({ ...prev, [n.id]: e.target.value }))
                                            }
                                            placeholder="Escreve a resposta para o e-mail do remetente..."
                                            className="w-full text-xs px-2.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 resize-none outline-none focus:ring-2 focus:ring-[#0A2540]"
                                            rows={3}
                                        />
                                        <button
                                            onClick={(e) => enviarRespostaContacto(e, n)}
                                            disabled={aEnviarResposta || !(respostaTexto[n.id] || '').trim()}
                                            className="w-full py-1.5 rounded-lg bg-[#0A2540] text-white text-xs font-semibold flex items-center justify-center gap-1 disabled:opacity-60"
                                        >
                                            {aEnviarResposta ? (
                                                <Loader2 size={13} className="animate-spin" />
                                            ) : (
                                                <Send size={13} />
                                            )}
                                            {aEnviarResposta ? 'A enviar...' : 'Enviar resposta'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </AuthenticatedLayout>
    );
}
