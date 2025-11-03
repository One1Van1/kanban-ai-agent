import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  pageExtensions: ['tsx', 'ts', 'jsx', 'js']
    .map((ext) => `app/${ext}`)
    .concat(['tsx', 'ts', 'jsx', 'js']),
};

export default nextConfig;
