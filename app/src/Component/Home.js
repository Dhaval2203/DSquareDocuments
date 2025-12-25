'use client';

import { Layout } from 'antd';
import {
    backgroundColor,
} from '../Utils/Colors';

import SalarySleep from './SalarySleep';

export default function HomePage() {
    return (
        <Layout
            style={{
                minHeight: '100vh',
                background: backgroundColor,
                overflowX: 'hidden',
            }}
        >
            <SalarySleep />
        </Layout>
    );
}
