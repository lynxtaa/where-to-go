import { type Metadata } from 'next'
import '../styles/global.css'

export const metadata: Metadata = {
	title: 'Where To Go',
	description: 'Where To Go',
	metadataBase: new URL(
		process.env.VERCEL_URL !== undefined
			? `https://${process.env.VERCEL_URL}`
			: `http://localhost:${process.env.PORT ?? 3000}`,
	),
	icons: {
		apple: '/apple-touch-icon.png',
		icon: [
			{
				type: 'image/png',
				sizes: '32x32',
				url: '/favicon-32x32.png',
			},
			{
				type: 'image/png',
				sizes: '16x16',
				url: '/favicon-16x16.png',
			},
		],
	},
	manifest: '/site.webmanifest',
	openGraph: {
		title: 'Where To Go',
		description: 'Where To Go',
		images: [{ url: '/android-chrome-512x512.png' }],
	},
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	)
}
