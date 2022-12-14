const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const config = {
	reactStrictMode: true,
	swcMinify: true,
	experimental: {
		appDir: true,
		enableUndici: true,
	},
}

module.exports = withBundleAnalyzer(config)
