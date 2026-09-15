import React, { Suspense, lazy } from 'react';
import SEO from '../components/SEO';
import HeroSection from '../components/HeroSection';
import Categories from '../components/Categories';
import CoffeeFinder from '../components/CoffeeFinder';
import ProductList from '../components/ProductList';
import Loader from '../components/Loader';

const Features = lazy(() => import('../components/Features'));
const OurStory = lazy(() => import('../components/OurStory'));
const WholesaleBanner = lazy(() => import('../components/WholesaleBanner'));
const CustomerClub = lazy(() => import('../components/CustomerClub'));
const BlogSnippet = lazy(() => import('../components/BlogSnippet'));
const Newsletter = lazy(() => import('../components/Newsletter'));

const SectionLoader = () => <Loader minHeight="40vh" />;

export default function HomePage() {
  const homeFAQ = [
    {
      question: "کیپ کافی چه نوع قهوه‌هایی عرضه می‌کند؟",
      answer: "کارگاه برشته‌کاری کیپ کافی انواع ترکیب‌های تخصصی دانه قهوه روبوستا و عربیکا (۱۰۰٪ روبوستا، ۸۰/۲۰، ۷۰/۳۰ و ۵۰/۵۰) را به‌صورت تازه برشت هفتگی همراه با ادوات دم‌آوری خانگی و صنعتی عرضه می‌کند."
    },
    {
      question: "شرایط ارسال سفارش‌ها در تهران و شهرستان‌ها چگونه است؟",
      answer: "سفارش‌های دانه‌های قهوه در تهران با پیک سریع ارسال می‌شوند و سفارش‌های بالای ۲۰ کیلوگرم مشمول ارسال رایگان هستند. برای سایر شهرستان‌ها، ارسال از طریق باربری و پست پیشتاز انجام می‌پذیرد."
    }
  ];

  return (
    <>
      <SEO
        path="/"
        title="طعم اصیل قهوه، مستقیم از کارگاه برشته‌کاری"
        description="از شکوه خاستگاه‌های دوردست تا طنین عطر تازه در فنجان شما؛ کارگاه برشته‌کاری تخصصی کیپ کافی در تهران. تأمین مستقیم دانه تازه برشت، قهوه اسپرسو و ملزومات باریستا."
        keywords="کیپ کافی, خرید قهوه, خرید قهوه عمده, قهوه اسپرسو, برشته کاری قهوه تهران, قیمت دانه قهوه, قهوه تازه برشت, keep coffee"
        faq={homeFAQ}
      />
      <HeroSection />
      <Categories />
      <CoffeeFinder />
      <ProductList limit={4} />

      <Suspense fallback={<SectionLoader />}>
        <Features />
        <OurStory />
        <WholesaleBanner />
        <CustomerClub />
        <BlogSnippet limit={3} />
        <Newsletter />
      </Suspense>
    </>
  );
}
