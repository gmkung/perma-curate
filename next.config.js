/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix: "",
  trailingSlash: true,
  output: "export",
  webpack: (config, { isServer, dev }) => {
    if (!isServer) {
      config.output.publicPath = "./_next/";
    }
    return config;
  },
};

module.exports = nextConfig;
