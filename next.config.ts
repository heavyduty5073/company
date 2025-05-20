import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'svsrhynrrrgtenezkstd.supabase.co' },
      { protocol: 'https', hostname: 'band.us' },
      // 네이버 밴드 관련 이미지 도메인 추가
      { protocol: 'https', hostname: 'coresos-phinf.pstatic.net' },
      { protocol: 'https', hostname: 'ssl.pstatic.net' },
      { protocol: 'https', hostname: 'phinf.pstatic.net' },
    ],
  },
};

export default nextConfig;
