// resources/js/Components/Layout/AppLayout.jsx
import React from 'react';
import { usePage } from '@inertiajs/react';
import TopBar from './TopBar';
import MobileNav from './MobileNav';

export default function AppLayout({ children }) {
    const { auth } = usePage().props;

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
            <TopBar user={auth?.user} />
            <main className="flex-1 w-full max-w-[480px] mx-auto pb-20 pt-2 px-2">
                {children}
            </main>
           {/* <MobileNav />*/}
        </div>
    );
}
