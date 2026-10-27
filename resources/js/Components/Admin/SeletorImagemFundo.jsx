// resources/js/Components/Admin/SeletorImagemFundo.jsx
import React, { useRef, useState } from 'react';
import { ImagePlus, X } from 'lucide-react';

export default function SeletorImagemFundo({ onChange }) {
    const inputRef = useRef(null);
    const [preview, setPreview] = useState(null);

    const handleFile = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setPreview(URL.createObjectURL(file));
        onChange(file);
    };

    const limpar = () => {
        setPreview(null);
        onChange(null);
        if (inputRef.current) inputRef.current.value = '';
    };

    return (
        <div>
            {preview ? (
                <div className="relative w-full h-40 rounded-xl overflow-hidden">
                    <img src={preview} alt="preview" className="w-full h-full object-cover" />
                    <button
                        type="button"
                        onClick={limpar}
                        className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full"
                    >
                        <X size={16} />
                    </button>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="w-full h-32 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
                >
                    <ImagePlus size={24} />
                    <span className="text-xs mt-1">Escolher imagem de fundo</span>
                </button>
            )}
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleFile}
                className="hidden"
            />
        </div>
    );
}
