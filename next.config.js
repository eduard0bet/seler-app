/** @type {import('next').NextConfig} */

module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tdtuczaulgudiuwxhxwc.supabase.co",
      },
    ],
  },
  reactStrictMode: false,
  experimental: {
    serverActions: true,
  },
  webpack(config) {
    (config.infrastructureLogging = { debug: /PackFileCache/ }),
      (config.infrastructureLogging = {
        level: "error",
      });
    return config;
  },
};
