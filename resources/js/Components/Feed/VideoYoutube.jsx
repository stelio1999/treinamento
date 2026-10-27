// resources/js/Components/Feed/VideoYoutube.jsx
import React, { useMemo, useState } from 'react';
import { Maximize2, X } from 'lucide-react';

function extrairIdYoutube(url) {
    if (!url) return null;
    const s = url.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(s)) return s;

    try {
        const u = new URL(s);
        if (u.hostname === 'youtu.be') {
            return u.pathname.replace(/^\/+/, '').split(/[/?#]/)[0] || null;
        }
        if (u.hostname.includes('youtube.com')) {
            const v = u.searchParams.get('v');
            if (v) return v;
            const m = u.pathname.match(/\/(embed|shorts|live|v)\/([^/?&#]+)/);
            if (m) return m[2];
        }
        return null;
    } catch {
        const m =
            s.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/) ||
            s.match(/[?&]v=([a-zA-Z0-9_-]{11})/) ||
            s.match(/\/embed\/([a-zA-Z0-9_-]{11})/);
        return m ? m[1] : null;
    }
}

/**
 * Player do YouTube com botão próprio de ampliar.
 * Ao ampliar, abre um modal fullscreen SOBRE a app inteira —
 * não mexe no bloco original (checkbox, texto e nota ficam intactos).
 */
export default function VideoYoutube({ url, titulo = 'Vídeo do treino' }) {
    const id = useMemo(() => extrairIdYoutube(url), [url]);
    const [ampliado, setAmpliado] = useState(false);

    if (!id) {
        return (
            <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-4 text-center text-xs text-slate-400">
                URL de vídeo inválida — cola um link do YouTube.
            </div>
        );
    }

    // Parâmetros comuns aos dois players
    const params =
        `?rel=0&modestbranding=1&playsinline=1&iv_load_policy=3` +
        `&cc_load_policy=0&disablekb=1&controls=1&mute=1`;

    const embedUrl = `https://www.youtube-nocookie.com/embed/${id}${params}`;

    return (
        <>
            {/* Player pequeno dentro do bloco */}
            <div
                className="relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-md"
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
            >
                <iframe
                    src={embedUrl}
                    title={titulo}
                    loading="lazy"
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    className="absolute inset-0 w-full h-full border-0"
                />

                {/* Botão próprio de ampliar */}
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        setAmpliado(true);
                    }}
                    aria-label="Ampliar vídeo"
                    className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-sm hover:bg-black/80 active:scale-95 transition"
                >
                    <Maximize2 size={15} />
                </button>

                {/* Máscara discreta no canto onde o YouTube põe o nome do canal */}
                <div
                    aria-hidden="true"
                    className="absolute top-0 left-0 w-1/2 h-14 z-[5] pointer-events-none"
                    style={{
                        background:
                            'linear-gradient(to bottom right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 70%)',
                    }}
                />
            </div>

            {/* Modal fullscreen — só existe quando ampliado */}
            {ampliado && (
                <div
                    className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-0"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Botão fechar */}
                    <button
                        type="button"
                        onClick={() => setAmpliado(false)}
                        aria-label="Fechar vídeo"
                        className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center backdrop-blur-md hover:bg-white/20 active:scale-95 transition"
                    >
                        <X size={20} />
                    </button>

                    {/* Player grande */}
                    <div className="relative w-full h-full max-w-6xl mx-auto flex items-center justify-center">
                        <iframe
                            src={embedUrl}
                            title={titulo}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            referrerPolicy="strict-origin-when-cross-origin"
                            className="w-full aspect-video max-h-full border-0"
                        />
                    </div>
                </div>
            )}
        </>
    );
}
