// resources/js/Layouts/AuthenticatedLayout.jsx
import React from 'react';
import AppLayout from '../Components/Layout/AppLayout';

export default function AuthenticatedLayout({ children }) {
    return <AppLayout>{children}</AppLayout>;
}
