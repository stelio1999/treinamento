// resources/js/Components/UI/SkeletonFeed.jsx
import React from 'react';

export default function SkeletonFeed({ count = 3 }) {
    return (
        <div className="space-y-4 px-3 pt-3">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="card-fb p-4 animate-pulse">
                    <div className="w-full h-40 rounded-xl bg-slate-200 dark:bg-slate-800 mb-3" />
                    <div className="h-5 w-2/3 bg-slate-200 dark:bg-slate-800 rounded mb-2" />
                    <div className="h-3 w-1/3 bg-slate-200 dark:bg-slate-800 rounded mb-4" />
                    <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded mb-2" />
                    <div className="h-3 w-5/6 bg-slate-200 dark:bg-slate-800 rounded mb-2" />
                    <div className="h-3 w-4/6 bg-slate-200 dark:bg-slate-800 rounded" />
                </div>
            ))}
        </div>
    );
}
