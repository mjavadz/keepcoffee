import React from 'react';
import { Helmet } from 'react-helmet-async';

const SITE_URL = "https://keepc.ir";

export default function SEO({ title, description, keywords, path = "/" }) {
  const defaultTitle = "کیپ کافی | خرید آنلاین قهوه تخصصی و تجهیزات دم‌آوری";
  const defaultDescription = "کیپ کافی عرضه کننده بهترین دانه‌های قهوه تخصصی (اسپشیالتی)، لوازم دم‌آوری و تجهیزات کافه در ایران. طعم واقعی قهوه را با ما تجربه کنید.";
  const defaultKeywords = "قهوه, خرید قهوه, قهوه تخصصی, اسپرسو, تجهیزات قهوه, رستری قهوه";

  const siteTitle = title ? `${title} | کیپ کافی` : defaultTitle;
  const metaDescription = description || defaultDescription;
  const canonicalUrl = `${SITE_URL}${path}`;
  const ogImage = `${SITE_URL}/og-image.jpg`;

  return (
    <Helmet>
      <html lang="fa" dir="rtl" />
      <title>{siteTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={keywords || defaultKeywords} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="کیپ کافی" />
      <meta property="og:locale" content="fa_IR" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonicalUrl} />
      <meta property="twitter:title" content={siteTitle} />
      <meta property="twitter:description" content={metaDescription} />
      <meta property="twitter:image" content={ogImage} />

      {/* JSON-LD Schema for Local Business */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CafeOrCoffeeShop",
          "name": "کیپ کافی (Keep Coffee)",
          "description": description || defaultDescription,
          "url": "https://keepc.ir",
          "telephone": "+982100000000",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Tehran",
            "addressCountry": "IR"
          }
        })}
      </script>
    </Helmet>
  );
}
