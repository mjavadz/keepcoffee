import React from 'react';
import { Helmet } from 'react-helmet-async';

const SITE_URL = "https://keepcoffee.ir";

export default function SEO({ title, description, keywords, path = "/" }) {
  const defaultTitle = "کیپ کافی | برشته‌کاری تخصصی قهوه و ملزومات دم‌آوری";
  const defaultDescription = "کیپ کافی؛ برشته‌کاری تخصصی قهوه در تهران. ارائه ۶ میکس اصیل دانه تازه برشت با دستگاه صنعتی کرون KORON، تجهیزات تخصصی و ارسال رایگان بالای ۲۰ کیلوگرم در تهران.";
  const defaultKeywords = "کیپ کافی, خرید قهوه, قهوه روبوستا, اسپرسو, برشته کاری قهوه تهران, تجهیزات دم آوری, فروش عمده قهوه, keep coffee";

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
          "name": "کیپ کافی (Keep Coffee Roastery)",
          "description": description || defaultDescription,
          "url": "https://keepcoffee.ir",
          "telephone": "+989335333499",
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
