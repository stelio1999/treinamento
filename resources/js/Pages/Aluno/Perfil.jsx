// resources/js/Pages/Aluno/Perfil.jsx
import React, { useRef, useState } from 'react';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import {
    LogOut, Mail, Phone, ShieldCheck, User as UserIcon,
    Camera, KeyRound, Save, Loader2, CheckCircle2, AlertCircle,
} from 'lucide-react';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';

export default function Perfil({ user }) {
    const { props } = usePage();
    const flash = props.flash || {};

    const [tab, setTab] = useState('dados'); // dados | senha

    // ---------- Form dados ----------
    const dados = useForm({
        name: user.name || '',
        email: user.email || '',
        telefone: user.telefone || '',
    });

    const submitDados = (e) => {
        e.preventDefault();
        dados.post('/perfil', { preserveScroll: true });
    };

    // ---------- Form senha ----------
    const senha = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submitSenha = (e) => {
        e.preventDefault();
        senha.post('/perfil/senha', {
            preserveScroll: true,
            onSuccess: () => senha.reset(),
        });
    };

    // ---------- Foto ----------
    const fileRef = useRef(null);
    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);

    const onPickFile = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setPreview(URL.createObjectURL(file));
        setUploading(true);
        router.post(
            '/perfil/foto',
            { avatar: file },
            {
                forceFormData: true,
                preserveScroll: true,
                onFinish: () => setUploading(false),
            }
        );
    };

    const logout = () => router.post('/logout');

    return (
        <AuthenticatedLayout>
            <Head title="Perfil" />

            <div className="px-2 py-4 space-y-4">
                {/* Flash messages */}
                {flash.success && (
                    <div className="rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 text-sm px-4 py-3 flex items-center gap-2">
                        <CheckCircle2 size={16} /> {flash.success}
                    </div>
                )}
                {flash.error && (
                    <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm px-4 py-3 flex items-center gap-2">
                        <AlertCircle size={16} /> {flash.error}
                    </div>
                )}

                {/* ---------- Cartão do utilizador com foto ---------- */}
                <div className="card-fb p-5 flex flex-col items-center text-center">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full overflow-hidden bg-[#0A2540] flex items-center justify-center text-white text-2xl font-bold">
                            {preview || user.avatar ? (
                                <img
                                    src={preview || user.avatar}
                                    alt={user.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span>
                                    {user.name
                                        .split(' ')
                                        .map((n) => n[0])
                                        .slice(0, 2)
                                        .join('')
                                        .toUpperCase()}
                                </span>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={() => fileRef.current?.click()}
                            disabled={uploading}
                            className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#0A2540] text-white flex items-center justify-center shadow-lg active:scale-95 transition"
                            aria-label="Alterar foto"
                        >
                            {uploading ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <Camera size={16} />
                            )}
                        </button>
                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={onPickFile}
                        />
                    </div>

                    <h1 className="mt-3 text-lg font-bold text-slate-900 dark:text-white">
                        {user.name}
                    </h1>
                    <span className="mt-1 inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                        <ShieldCheck size={14} />{' '}
                        {user.role === 'admin' ? 'Administrador' : 'Aluno'}
                    </span>
                </div>

                {/* ---------- Tabs ---------- */}
                <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-900">
                    <button
                        onClick={() => setTab('dados')}
                        className={`py-2 rounded-lg text-sm font-semibold transition ${
                            tab === 'dados'
                                ? 'bg-white dark:bg-slate-800 text-[#0A2540] dark:text-white shadow'
                                : 'text-slate-500 dark:text-slate-400'
                        }`}
                    >
                        Dados
                    </button>
                    <button
                        onClick={() => setTab('senha')}
                        className={`py-2 rounded-lg text-sm font-semibold transition ${
                            tab === 'senha'
                                ? 'bg-white dark:bg-slate-800 text-[#0A2540] dark:text-white shadow'
                                : 'text-slate-500 dark:text-slate-400'
                        }`}
                    >
                        Palavra-passe
                    </button>
                </div>

                {/* ---------- Aba Dados ---------- */}
                {tab === 'dados' && (
                    <form onSubmit={submitDados} className="card-fb p-4 space-y-4">
                        <Field
                            label="Nome completo"
                            icon={<UserIcon size={16} />}
                            error={dados.errors.name}
                        >
                            <input
                                type="text"
                                value={dados.data.name}
                                onChange={(e) => dados.setData('name', e.target.value)}
                                className="input-line"
                            />
                        </Field>

                        <Field
                            label="E-mail"
                            icon={<Mail size={16} />}
                            error={dados.errors.email}
                        >
                            <input
                                type="email"
                                value={dados.data.email}
                                onChange={(e) => dados.setData('email', e.target.value)}
                                className="input-line"
                            />
                        </Field>

                        <Field
                            label="Contacto"
                            icon={<Phone size={16} />}
                            error={dados.errors.telefone}
                        >
                            <input
                                type="text"
                                value={dados.data.telefone}
                                onChange={(e) => dados.setData('telefone', e.target.value)}
                                placeholder="+258 84 ..."
                                className="input-line"
                            />
                        </Field>

                        <button
                            type="submit"
                            disabled={dados.processing}
                            className="w-full btn-primary flex items-center justify-center gap-2"
                        >
                            {dados.processing ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <Save size={16} />
                            )}
                            Guardar alterações
                        </button>
                    </form>
                )}

                {/* ---------- Aba Palavra-passe ---------- */}
                {tab === 'senha' && (
                    <form onSubmit={submitSenha} className="card-fb p-4 space-y-4">
                        <Field
                            label="Palavra-passe atual"
                            icon={<KeyRound size={16} />}
                            error={senha.errors.current_password}
                        >
                            <input
                                type="password"
                                value={senha.data.current_password}
                                onChange={(e) => senha.setData('current_password', e.target.value)}
                                className="input-line"
                            />
                        </Field>

                        <Field
                            label="Nova palavra-passe"
                            icon={<KeyRound size={16} />}
                            error={senha.errors.password}
                        >
                            <input
                                type="password"
                                value={senha.data.password}
                                onChange={(e) => senha.setData('password', e.target.value)}
                                className="input-line"
                            />
                        </Field>

                        <Field
                            label="Confirmar nova palavra-passe"
                            icon={<KeyRound size={16} />}
                        >
                            <input
                                type="password"
                                value={senha.data.password_confirmation}
                                onChange={(e) =>
                                    senha.setData('password_confirmation', e.target.value)
                                }
                                className="input-line"
                            />
                        </Field>

                        <button
                            type="submit"
                            disabled={senha.processing}
                            className="w-full btn-primary flex items-center justify-center gap-2"
                        >
                            {senha.processing ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <Save size={16} />
                            )}
                            Alterar palavra-passe
                        </button>
                    </form>
                )}

                {/* ---------- Logout ---------- */}
                <button
                    onClick={logout}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-semibold text-sm active:scale-[.98] transition"
                >
                    <LogOut size={18} /> Terminar sessão
                </button>
            </div>

            {/* Estilo local (Tailwind) para os inputs */}
            <style>{`
                .input-line {
                    width: 100%;
                    padding: 0.65rem 0.85rem;
                    border-radius: 0.75rem;
                    border: 1px solid rgb(226 232 240);
                    background: #fff;
                    font-size: 0.875rem;
                    outline: none;
                    transition: border-color .15s, box-shadow .15s;
                }
                .dark .input-line {
                    background: rgb(15 23 42);
                    border-color: rgb(51 65 85);
                    color: #fff;
                }
                .input-line:focus {
                    border-color: #0A2540;
                    box-shadow: 0 0 0 3px rgba(10,37,64,.15);
                }
            `}</style>
        </AuthenticatedLayout>
    );
}

function Field({ label, icon, error, children }) {
    return (
        <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                {icon} {label}
            </label>
            {children}
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );
}
