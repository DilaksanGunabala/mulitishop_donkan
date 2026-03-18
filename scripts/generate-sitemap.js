#!/usr/bin/env node
/**
 * Dynamic sitemap generator using firebase-admin.
 * Run: node scripts/generate-sitemap.js
 * Requires: npm install firebase-admin (dev dependency)
 * Set FIREBASE_SERVICE_ACCOUNT env var to path of your service account JSON.
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { writeFileSync } from 'fs';
import { resolve } from 'path';

const BASE_URL = process.env.SITE_URL || 'https://your-domain.com';
const SERVICE_ACCOUNT = process.env.FIREBASE_SERVICE_ACCOUNT;

if (!SERVICE_ACCOUNT) {
  console.error('Error: Set FIREBASE_SERVICE_ACCOUNT env var to path of service account JSON');
  process.exit(1);
}

initializeApp({ credential: cert(JSON.parse(SERVICE_ACCOUNT)) });
const db = getFirestore();

async function generate() {
  const staticRoutes = ['/', '/products', '/contact'];
  const snapshot = await db.collection('products').get();
  const productSlugs = snapshot.docs.map((d) => d.data().slug).filter(Boolean);

  const urls = [
    ...staticRoutes.map((r) => ({
      loc: `${BASE_URL}${r}`,
      changefreq: r === '/' ? 'weekly' : r === '/products' ? 'daily' : 'monthly',
      priority: r === '/' ? '1.0' : r === '/products' ? '0.9' : '0.7',
    })),
    ...productSlugs.map((slug) => ({
      loc: `${BASE_URL}/products/${slug}`,
      changefreq: 'weekly',
      priority: '0.8',
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  const outPath = resolve('public/sitemap.xml');
  writeFileSync(outPath, xml, 'utf8');
  console.log(`Sitemap written to ${outPath} (${urls.length} URLs)`);
}

generate().catch((err) => {
  console.error('Sitemap generation failed:', err);
  process.exit(1);
});
