import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AntdRegistry from './antd-registry';
import Headers from "./src/Component/Header";
import FooterComponent from "./src/Component/Footer";

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
	display: "swap",
});

export const metadata: Metadata = {
	title: "D Square Infotech",
	description: "D Square Infotech - Unlock the future",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${inter.variable} antialiased`}>
				<AntdRegistry>
					<Headers />
					<div
						style={{
							paddingTop: typeof window !== 'undefined' && window.innerWidth < 768 ? 64 : 80,
							paddingInline: 12,
							minHeight: '100vh',
						}}
					>
						{children}
					</div>
					<FooterComponent />
				</AntdRegistry>
			</body>
		</html>
	);
}
