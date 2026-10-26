const storageUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL)
  : null;

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [{ source: "/opengraph-image", destination: "/opengraph-image.png", permanent: true }];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      ...(storageUrl
        ? [{
            protocol: storageUrl.protocol.slice(0, -1),
            hostname: storageUrl.hostname,
            port: storageUrl.port,
            pathname: "/storage/v1/object/public/**",
          }]
        : []),
    ],
  },
};

export default nextConfig;
