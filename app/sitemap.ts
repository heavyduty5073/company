import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const lastModified = new Date();

    return [
        { url: 'https://yourcompany.com', lastModified, changeFrequency: 'monthly', priority: 1.0 },
        { url: 'https://yourcompany.com/introduce', lastModified, changeFrequency: 'monthly', priority: 0.7 },
        { url: 'https://yourcompany.com/introduce/about', lastModified, changeFrequency: 'monthly', priority: 0.7 },

        { url: 'https://yourcompany.com/business/construction', lastModified, changeFrequency: 'monthly', priority: 0.8 },
        { url: 'https://yourcompany.com/business/parts', lastModified, changeFrequency: 'monthly', priority: 0.8 },
        { url: 'https://yourcompany.com/business/repair', lastModified, changeFrequency: 'monthly', priority: 0.8 },
        { url: 'https://yourcompany.com/business/trip', lastModified, changeFrequency: 'monthly', priority: 0.8 },

        { url: 'https://yourcompany.com/parts', lastModified, changeFrequency: 'monthly', priority: 0.7 },
        { url: 'https://yourcompany.com/repair', lastModified, changeFrequency: 'monthly', priority: 0.7 },

        { url: 'https://yourcompany.com/support', lastModified, changeFrequency: 'monthly', priority: 0.6 },
        { url: 'https://yourcompany.com/support/write', lastModified, changeFrequency: 'monthly', priority: 0.6 },

        { url: 'https://yourcompany.com/login', lastModified, changeFrequency: 'yearly', priority: 0.3 },
    ];
}
