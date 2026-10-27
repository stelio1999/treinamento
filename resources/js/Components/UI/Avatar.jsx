// resources/js/Components/UI/Avatar.jsx
import React from 'react';

export default function Avatar({ name = '?', src = null, size = 40 }) {
    const initials = name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    return (
        <div
            className="rounded-full overflow-hidden bg-[#0A2540] text-white flex items-center justify-center font-semibold shrink-0"
            style={{ width: size, height: size, fontSize: size * 0.4 }}
        >
            {src ? (
                <img src={src} alt={name} className="w-full h-full object-cover" />
            ) : (
                <span>{initials || '?'}</span>
            )}
        </div>
    );
}
