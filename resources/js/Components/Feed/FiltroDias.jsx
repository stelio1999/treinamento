// resources/js/Components/Feed/FiltroDias.jsx
import React, { useMemo } from 'react';

export default function FiltroDias({ selecionado, onChange }) {
    const dias = useMemo(() => {
        const arr = [];
        const hoje = new Date();
        for (let i = -3; i <= 5; i++) {
            const d = new Date(hoje);
            d.setDate(hoje.getDate() + i);
            arr.push(d);
        }
        return arr;
    }, []);

    const fmt = (d) => d.toISOString().slice(0, 10);
    const isHoje = (d) => fmt(d) === fmt(new Date());

    return (
        <div className="flex gap-2 overflow-x-auto no-scrollbar px-3 py-3">
            {dias.map((d) => {
                const val = fmt(d);
                const active = selecionado === val;
                return (
                    <button
                        key={val}
                        onClick={() => onChange(val)}
                        className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition ${
                            active
                                ? 'bg-[#0A2540] text-white'
                                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                        }`}
                    >
                        {isHoje(d)
                            ? 'Hoje'
                            : d.toLocaleDateString('pt-MZ', { weekday: 'short', day: '2-digit' })}
                    </button>
                );
            })}
        </div>
    );
}
