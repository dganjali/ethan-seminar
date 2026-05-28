import type { Metadata } from 'next';
import { Geist_Mono, Instrument_Serif } from 'next/font/google';
import "./globals.css"

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

const instrumentSerif = Instrument_Serif({
	variable: '--font-instrument',
	subsets: ['latin'],
	weight: '400',
	style: ['italic', 'normal'],
});

export const metadata: Metadata = {
	title: 'Research Proposal | AI in Healthcare Diagnostics',
	description: 'An interactive research proposal exploring the integration of artificial intelligence in modern healthcare diagnostics.',
	generator: 'v0.app'
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="bg-background scroll-smooth">
			<body
				className={`${geistMono.variable} ${instrumentSerif.variable} antialiased`}
			>
				{children}
			</body>
		</html>
	);
}
