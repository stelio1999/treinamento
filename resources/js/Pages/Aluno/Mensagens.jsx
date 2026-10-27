// resources/js/Pages/Aluno/Mensagens.jsx
import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import ChatBolha from '../../Components/Mensagens/ChatBolha';

export default function Mensagens({ mensagens = [] }) {
    return (
        <AuthenticatedLayout>
            <Head title="Mensagens" />

            <h1 className="text-lg font-bold px-2 py-3">Mensagens</h1>

            <div className="px-2">
                {mensagens.length === 0 ? (
                    <div className="text-center py-16 text-slate-500 dark:text-slate-400 text-sm">
                        Nenhuma mensagem por aqui.
                    </div>
                ) : (
                    mensagens.map((m) => (
                        <ChatBolha
                            key={m.id}
                            mensagem={m.conteudo}
                            minha={false}
                            autor={m.admin?.name}
                        />
                    ))
                )}
            </div>
        </AuthenticatedLayout>
    );
}
