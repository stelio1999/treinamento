// resources/js/Components/Layout/TopBar.jsx
import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Bell, MessageSquare, Users, Inbox, Trophy, Home } from 'lucide-react';
import ThemeToggle from '../UI/ThemeToggle';
import Avatar from '../UI/Avatar';

// ✅ Importa as duas imagens
import LogoAdmin from '../../assets/logo-admin.png';
import LogoAluno from '../../assets/logo-aluno.png';

function Badge({ count }) {
    if (!count || count <= 0) return null;
    return (
        <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
            {count > 99 ? '99+' : count}
        </span>
    );
}

function IconButton({ href, active, label, badge, children }) {
    return (
        <Link
            href={href}
            aria-label={label}
            className={`relative flex items-center justify-center p-2.5 rounded-full transition active:scale-95 ${
                active
                    ? '!text-[#0A2540] dark:!text-white'
                    : '!text-slate-600 dark:!text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
        >
            {React.cloneElement(children, {
                fill: active ? 'currentColor' : 'none',
                strokeWidth: active ? 1.8 : 2,
            })}
            {badge != null && <Badge count={badge} />}
        </Link>
    );
}

export default function TopBar({ user }) {
    const { props, url } = usePage();
    const { contadores, auth } = props;

    const isAdmin = (user?.role ?? auth?.user?.role) === 'admin';
    const homeHref = isAdmin ? '/admin/dashboard' : '/feed';

    // ✅ Logo dinâmico conforme role
    const logo = isAdmin ? LogoAdmin : LogoAluno;
    const logoAlt = isAdmin ? 'Área de Administração' : 'FitClub';

    const isActive = (href) => (url ?? '').startsWith(href.split('?')[0]);

    return (
        <header className="sticky top-0 z-40 glass-strong border-b border-slate-200/60 dark:border-slate-800">
            <div className="flex items-center justify-between px-4 py-2.5 max-w-[480px] mx-auto">
                {/* ✅ Logo em vez de texto */}
                <Link
                    href={homeHref}
                    aria-label={logoAlt}
                    className="flex items-center shrink-0 active:scale-95 transition"
                >
                    <img
                        src={logo}
                        alt={logoAlt}
                        className="h-9 w-auto object-contain"
                    />
                </Link>

                <div className="flex items-center gap-1">
                    {isAdmin ? (
                        <>
                            <IconButton href="/admin/alunos" active={isActive('/admin/alunos')} label="Alunos">
                                <Users size={20} />
                            </IconButton>

                            <IconButton href="/admin/solicitacoes" active={isActive('/admin/solicitacoes')} label="Solicitações">
                                <Inbox size={20} />
                            </IconButton>
                        </>
                    ) : (
                        <>
                            <IconButton href="/feed" active={isActive('/feed')} label="Início">
                                <Home size={20} />
                            </IconButton>

                            <IconButton href="/resultados" active={isActive('/resultados')} label="Resultados">
                                <Trophy size={20} />
                            </IconButton>
                        </>
                    )}

                    <IconButton
                        href="/notificacoes"
                        active={isActive('/notificacoes')}
                        label="Notificações"
                        badge={contadores?.notificacoes}
                    >
                        <Bell size={20} />
                    </IconButton>

                    <IconButton
                        href="/mensagens"
                        active={isActive('/mensagens')}
                        label="Mensagens"
                        badge={contadores?.mensagens}
                    >
                        <MessageSquare size={20} />
                    </IconButton>

                    <ThemeToggle />

                    <Link href="/perfil" aria-label="Perfil">
                        <Avatar name={user?.name || 'Aluno'} src={user?.avatar} size={36} />
                    </Link>
                </div>
            </div>
        </header>
    );
}
