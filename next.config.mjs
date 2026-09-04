/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Book covers from Goodreads (lib/goodreads.ts), film posters from
    // Letterboxd (lib/letterboxd.ts).
    remotePatterns: [
      { protocol: "https", hostname: "i.gr-assets.com" },
      { protocol: "https", hostname: "a.ltrbxd.com" },
    ],
  },
};

export default nextConfig;
