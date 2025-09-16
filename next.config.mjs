// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force Next to treat *this* folder as the workspace root
  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;
