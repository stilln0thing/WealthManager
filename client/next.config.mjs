/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: undefined,
  },
  // Remove the proxy configuration for Vercel deployment
  // Vercel will handle the routing through vercel.json
};

export default nextConfig;
