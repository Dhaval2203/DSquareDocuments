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
            <div
                aria-hidden
                style={{
                    position: 'fixed',
                    width: 600,
                    height: 600,
                    borderRadius: '50%',
                    top: '50%',
                    left: '50%',
                    transform: `translate(-50%, -50%) scale(${circleScale})`,
                    background: activeGradient,
                    opacity: 0.25,
                    filter: 'blur(80px)',
                    transition: 'transform 0.3s ease, background 0.3s ease',
                    zIndex: 0,
                    pointerEvents: 'none',
                }}
            />

            {/* Header */}
            <Headers />

            {/* Content */}
            <Content style={{ flex: 1, marginTop: 90, position: 'relative', zIndex: 1 }}>
                <section id="salarySleep" style={{ padding: '40px 16px', textAlign: 'center', background: whiteColor, scrollMarginTop: 90 }}>
                    <SalarySleep />
                </section>

            </Content>

            {/* Footer */}
            <FooterComponent />

            {/* Scroll To Top with Circular Progress */}
            {showScrollTop && (
                <div
                    onClick={scrollToTop}
                    style={{
                        position: 'fixed',
                        right: 'calc(24px + env(safe-area-inset-right))',
                        bottom: 'calc(24px + env(safe-area-inset-bottom))',
                        width: 48,
                        height: 48,
                        cursor: 'pointer',
                        zIndex: 1000,
                        transition: 'transform 0.2s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                    {/* Progress Ring */}
                    <Progress
                        type="circle"
                        percent={Math.round(scrollPercent * 100)}
                        size={48}
                        strokeWidth={8}
                        strokeColor={primaryColor}
                        trailColor={secondaryColor}
                        format={() => null} // disable default centering
                    />

                    {/* Center Arrow Icon */}
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            pointerEvents: 'none',
                        }}
                    >
                        <FaArrowUp size={18} color={accentColor} />
                    </div>
                </div>
            )}
        </Layout>
    );
}
