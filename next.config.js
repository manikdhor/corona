/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "coronapropertiesltd.com",
      },
      {
        protocol: "https",
        hostname: "cdn.goldsandsgroup.com",
      },
    ],
  },
};

module.exports = nextConfig;
