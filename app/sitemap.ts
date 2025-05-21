import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const lastModified = new Date();

    return [
        { url: 'https://deasung.kr', lastModified, changeFrequency: 'monthly', priority: 1.0 },
        { url: 'https://deasung.kr/introduce', lastModified, changeFrequency: 'monthly', priority: 0.7 },
        { url: 'https://deasung.kr/introduce/about', lastModified, changeFrequency: 'monthly', priority: 0.7 },

        { url: 'https://deasung.kr/business/construction', lastModified, changeFrequency: 'monthly', priority: 0.8 },
        { url: 'https://deasung.kr/business/parts', lastModified, changeFrequency: 'monthly', priority: 0.8 },
        { url: 'https://deasung.kr/business/repair', lastModified, changeFrequency: 'monthly', priority: 0.8 },
        { url: 'https://deasung.kr/business/trip', lastModified, changeFrequency: 'monthly', priority: 0.8 },

        { url: 'https://deasung.kr/parts', lastModified, changeFrequency: 'monthly', priority: 0.7 },
        { url: 'https://deasung.kr/repair', lastModified, changeFrequency: 'monthly', priority: 0.7 },

        { url: 'https://deasung.kr/support', lastModified, changeFrequency: 'monthly', priority: 0.6 },
        { url: 'https://deasung.kr/support/write', lastModified, changeFrequency: 'monthly', priority: 0.6 },

        { url: 'https://deasung.kr/login', lastModified, changeFrequency: 'yearly', priority: 0.3 },
    ];
}
