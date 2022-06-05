/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	async rewrites() {
		return [{ source: '/redirect/:linkId', destination: '/api/redirect/:linkId' }]
	},
}

module.exports = nextConfig
