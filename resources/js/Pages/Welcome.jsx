// resources/js/Pages/Welcome.jsx
import React from 'react';
import { Head } from '@inertiajs/react';

import '../App.css'; // CSS global do FitClub (variáveis, .btn, .stroke-text, .blur, etc.)

import Hero from '../Components/Hero/Hero';
import Programs from '../Components/Programs/Programs';
import Reasons from '../Components/Reasons/Reasons';
import Plans from '../Components/Plans/Plans';
import Testimonials from '../Components/Testimonials/Testimonials';
import Join from '../Components/Join/Join';
import Contact from '../Components/Contact/Contact';
import Footer from '../Components/Footer/Footer';

export default function Welcome() {
    return (
        <>
            <Head title="Bem-vindo" />
            <div className="app-welcome">
                <Hero />
                <Programs />
                <Reasons />
              {/*   <Plans />*/}
                <Testimonials />
                <Join />
                <Contact />
                <Footer />
            </div>
        </>
    );
}
