'use client';

import { Layout, Progress } from 'antd';
import 'antd/dist/reset.css';
import { useEffect, useState } from 'react';
import { FaArrowUp } from 'react-icons/fa';

import {
    accentColor, backgroundColor,
    primaryColor, secondaryColor, whiteColor
} from '../Utils/Colors';

import FooterComponent from './Footer';
import OfferLetter from './Offerletter';
import Headers from './Header';
import SalarySleep from './SalarySleep';

const { Content } = Layout;

export default function HomePage() {
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [scrollPercent, setScrollPercent] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const percent = Math.min(scrollTop / docHeight, 1);
            setScrollPercent(percent);
            setShowScrollTop(scrollTop > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    /* Dynamic background circle */
    const circleScale = 1 + scrollPercent * 2;
    const gradients = [
        'radial-gradient(circle at center, #0ea5a4, transparent 60%)',
        'radial-gradient(circle at center, #6366f1, transparent 60%)',
        'radial-gradient(circle at center, #22c55e, transparent 60%)',
        'radial-gradient(circle at center, #f97316, transparent 60%)',
    ];
    const activeGradient = gradients[Math.floor(scrollPercent * gradients.length)] || gradients[0];

    return (
        <Layout
            style={{
                minHeight: '100vh',
                background: backgroundColor,
                overflowX: 'hidden',
                position: 'relative',
            }}
        >
            {/* Animated Background Circle */}

            {/* Header */}
            <Headers />
            <SalarySleep />
            <FooterComponent />
        </Layout>
    );
}
