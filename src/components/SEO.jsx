import React from 'react';
import { Helmet } from 'react-helmet-async';
import { site } from '../data/site';

const SITE_URL = "https://keepcoffee.ir";

export default function SEO({
  title,
  description,
  keywords,
  path = "/",
  image,
  type = "website",
  product,
  article,
  breadcrumbs,
  faq
}) {
  const defaultTitle = "کیپ کافی | برشته‌کاری تخصصی قهوه و ملزومات دم‌آوری";
  const defaultDescription = "کیپ کافی؛ کارگاه برشته‌کاری تخصصی قهوه در تهران. تأمین انواع ترکیب‌های تازه برشت، قهوه اسپرسو و ملزومات حرفه‌ای باریستا با ارسال مستقیم کارگاهی.";
  const defaultKeywords = "کیپ کافی, خرید قهوه, خرید قهوه عمده, قیمت دانه قهوه, قهوه روبوستا, قهوه عربیکا, قهوه اسپرسو, برشته کاری قهوه تهران, تجهیزات دم آوری, روستری کیپ کافی, keep coffee";

  const siteTitle = title ? `${title} | کیپ کافی` : defaultTitle;
  const metaDescription = description || defaultDescription;
  const canonicalUrl = `${SITE_URL}${path}`;
  const ogImage = image ? (image.startsWith('http') ? image : `${SITE_URL}${image}`) : `${SITE_URL}/og-image.jpg`;

  // Base Organization & LocalBusiness Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    "@id": `${SITE_URL}/#organization`,
    "name": "کیپ کافی (Keep Coffee Roastery)",
    "alternateName": "Keep Coffee",
    "url": SITE_URL,
    "logo": `${SITE_URL}/apple-touch-icon.png`,
    "image": `${SITE_URL}/og-image.jpg`,
    "description": metaDescription,
    "telephone": "+989120142210",
    "email": site.email,
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "کارگاه تخصصی برشته‌کاری کیپ کافی",
      "addressLocality": "تهران",
      "addressRegion": "تهران",
      "addressCountry": "IR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 35.6892,
      "longitude": 51.3890
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "opens": "09:00",
        "closes": "21:00"
      }
    ],
    "sameAs": [
      "https://instagram.com/keepcoffeeroastery",
      "https://t.me/keepcoffeeRoastery"
    ]
  };

  const schemas = [organizationSchema];

  // Product Schema
  if (product) {
    const productSchema = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.name,
      "image": product.image ? (product.image.startsWith('http') ? product.image : `${SITE_URL}${product.image}`) : ogImage,
      "description": product.description || metaDescription,
      "sku": `KEEP-${product.slug || product.id}`,
      "mpn": `KC-${product.id}`,
      "brand": {
        "@type": "Brand",
        "name": "کیپ کافی (Keep Coffee)"
      },
      "offers": {
        "@type": "Offer",
        "url": canonicalUrl,
        "priceCurrency": "IRR",
        // In Iran Rial is official currency for schema (1 Toman = 10 Rials)
        "price": product.price ? product.price * 10 : 0,
        "priceValidUntil": "2027-12-31",
        "availability": product.price ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
        "itemCondition": "https://schema.org/NewCondition",
        "seller": {
          "@type": "Organization",
          "name": "کیپ کافی"
        }
      }
    };
    schemas.push(productSchema);
  }

  // Article / BlogPosting Schema
  if (article) {
    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": article.title || siteTitle,
      "image": article.image ? (article.image.startsWith('http') ? article.image : `${SITE_URL}${article.image}`) : ogImage,
      "datePublished": article.date || "2026-01-01",
      "dateModified": article.date || "2026-09-01",
      "author": {
        "@type": "Person",
        "name": article.author || "تیم تخصصی کیپ کافی"
      },
      "publisher": {
        "@type": "Organization",
        "name": "کیپ کافی",
        "logo": {
          "@type": "ImageObject",
          "url": `${SITE_URL}/apple-touch-icon.png`
        }
      },
      "description": article.excerpt || metaDescription,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": canonicalUrl
      }
    };
    schemas.push(articleSchema);
  }

  // BreadcrumbList Schema
  if (breadcrumbs && breadcrumbs.length > 0) {
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`
      }))
    };
    schemas.push(breadcrumbSchema);
  }

  // FAQ Schema
  if (faq && faq.length > 0) {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faq.map((q) => ({
        "@type": "Question",
        "name": q.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": q.answer
        }
      }))
    };
    schemas.push(faqSchema);
  }

  return (
    <Helmet>
      <html lang="fa" dir="rtl" />
      <title>{siteTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={keywords || defaultKeywords} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
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

      {/* Structured Data (JSON-LD) */}
      {schemas.map((s, idx) => (
        <script key={idx} type="application/ld+json">
          {JSON.stringify(s)}
        </script>
      ))}
    </Helmet>
  );
}
