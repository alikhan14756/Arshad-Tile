import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, keywords, image, url }) {
  const defaultTitle = 'Arshad Tiles & Sanitary | Premium Showroom Shabqadar';
  const defaultDesc = 'Premium tiles, sanitary ware, and PVC panels near Flying Coach Adda, Shabqadar. Quality solutions since 2012.';
  const defaultKeywords = 'tiles shabqadar, sanitary items, master tiles, shabbir tiles, stile, porta commode, pvc panels';
  const siteUrl = 'https://arshadtiles.com';

  const seoTitle = title ? `${title} | Arshad Tiles` : defaultTitle;
  const seoDesc = description || defaultDesc;
  const seoKeywords = keywords || defaultKeywords;
  const seoImage = image || '/logo-icon.png';
  const seoUrl = url ? `${siteUrl}${url}` : siteUrl;

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDesc} />
      <meta name="keywords" content={seoKeywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={seoUrl} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDesc} />
      <meta property="og:image" content={seoImage} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={seoUrl} />
      <meta property="twitter:title" content={seoTitle} />
      <meta property="twitter:description" content={seoDesc} />
      <meta property="twitter:image" content={seoImage} />
    </Helmet>
  );
}
