// resources/js/Pages/Aluno/Feed.jsx
import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import FiltroDias from '../../Components/Feed/FiltroDias';
import TreinoCard from '../../Components/Feed/TreinoCard';
import SkeletonFeed from '../../Components/UI/SkeletonFeed';

export default function Feed({ treinosHoje = [], dataSelecionada }) {
    const [data, setData] = useState(dataSelecionada);
    const [treinos, setTreinos] = useState(treinosHoje);
    const [loading, setLoading] = useState(false);

    const mudarDia = async (novaData) => {
        setData(novaData);
        setLoading(true);
        try {
            const { data: res } = await axios.get(`/feed/data?data=${novaData}`);
            setTreinos(res.treinos);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Feed" />

            <div className="sticky top-[56px] z-30 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800 -mx-2 px-2">
                <FiltroDias selecionado={data} onChange={mudarDia} />
            </div>

            {loading ? (
                <SkeletonFeed />
            ) : treinos.length === 0 ? (
                <div className="text-center py-16 px-4">
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                        Nenhum treino para este dia.
                    </p>
                </div>
            ) : (
                <div className="pt-3">
                    {treinos.map((t) => (
                        <TreinoCard key={t.id} treino={t} />
                    ))}
                </div>
            )}
        </AuthenticatedLayout>
    );
}
