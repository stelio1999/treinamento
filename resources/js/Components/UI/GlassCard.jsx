// resources/js/Components/UI/GlassCard.jsx
import React from 'react';

export default function GlassCard({ children, className = '', strong = false, ...props }) {
    return (
        <div
            className={`${strong ? 'glass-strong' : 'glass'} rounded-2xl shadow-lg ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}
