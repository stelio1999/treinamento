// resources/js/Components/Layout/MobileNav.jsx
import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Home, Calendar, Bell, MessageSquare, User } from 'lucide-react';

const items = [
    { href: '/feed', label: 'Início', icon: Home },
    { href: '/feed?tab=calendario', label: 'Calendário', icon: Calendar },
    { href: '/notificacoes', label: 'Notificações', icon: Bell },
    { href: '/mensagens', label: 'Mensagens', icon: MessageSquare },
    { href: '/perfil', label: 'Perfil', icon: User },
];

export default function MobileNav() {
    const { url } = usePage();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-40 glass-strong border-t border-slate-200/60 dark:border-slate-800 safe-bottom">
            <div className="max-w-[480px] mx-auto grid grid-cols-5">
                {items.map(({ href, label, icon: Icon }) => {
                    const active = url.startsWith(href.split('?')[0]);
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium transition ${
                                active
                                    ? 'text-[#0A2540] dark:text-blue-400'
                                    : 'text-slate-500 dark:text-slate-400'
                            }`}
                        >
                            <Icon size={22} strokeWidth={active ? 2.4 : 2} />
                            <span>{label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
