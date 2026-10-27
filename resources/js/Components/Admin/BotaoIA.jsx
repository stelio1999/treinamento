// resources/js/Components/Admin/BotaoIA.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Sparkles, Loader2 } from 'lucide-react';

export default function BotaoIA({ texto, onMelhorado }) {
    const [loading, setLoading] = useState(false);

    const melhorar = async () => {
        if (!texto || loading) return;
        setLoading(true);
        try {
            const { data } = await axios.post('/admin/ia/melhorar', { texto });
            if (data?.texto_melhorado) {
                onMelhorado(data.texto_melhorado);
            } else {
                alert('A IA não devolveu texto melhorado.');
            }
        } catch (e) {
            const msg = e?.response?.data?.message
                || e?.response?.data?.errors?.texto?.[0]
                || 'Erro ao contactar a IA. Vê a consola/log do Laravel.';
            alert(msg);
            console.error('Erro IA:', e?.response || e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            type="button"
            onClick={melhorar}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 px-3 py-1.5 rounded-full disabled:opacity-60"
        >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
            {loading ? 'A melhorar...' : 'Melhorar com IA'}
        </button>
    );
}
