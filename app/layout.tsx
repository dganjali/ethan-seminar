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
	title: 'Research Proposal | Ethan Li Ngan Sun',
	description: 'Research Proposal | Ethan Li Ngan Sun',
	icons: {
		icon: '/icon.svg',
		apple: '/apple-icon.png',
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="bg-background scroll-smooth overflow-x-hidden">
			<body
				className={`${geistMono.variable} ${instrumentSerif.variable} antialiased overflow-x-hidden`}
			>
				{children}
			</body>
		</html>
	);
}
