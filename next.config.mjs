/** @type {import('next').NextConfig} */
const nextConfig = {
  // experimental: {
  //   middleware: true, // optional in latest Next.js, but can enable advanced features
  // },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
