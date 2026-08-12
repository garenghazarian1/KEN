/**
 * Campaign single source of truth.
 * Update this file when a promo starts, changes, or ends.
 */

export const CAMPAIGN_TIMEZONE = "Asia/Dubai";

export const CAMPAIGNS = [
  {
    id: "august-2026",
    slug: "august-2026",
    path: "/offers",
    startsOn: "2026-08-01",
    endsOn: "2026-08-31",
    timezone: CAMPAIGN_TIMEZONE,
    branches: "both",
    theme: {
      en: "KEN Beauty August Offers",
      ar: "عروض كين بيوتي لشهر أغسطس",
    },
    primaryCta: {
      en: "Save now more than 50%",
      ar: "استمتعي بخصم يصل إلى 50%",
    },
    heroKicker: {
      en: "Save up to",
      ar: "وفّري حتى",
    },
    heroSubtitle: {
      en: "Our special offers in August — limited time at both Abu Dhabi branches.",
      ar: "عروضنا الخاصة في أغسطس — لفترة محدودة في فرعي أبوظبي.",
    },
    discountPercent: 50,
    packages: [
      {
        id: "mermaid",
        name: {
          en: "Mermaid Package",
          ar: "باقة حورية البحر",
        },
        promoPrice: 600,
        originalPrice: 2000,
        currency: "AED",
        inclusions: [
          {
            en: "10x Wash & Blow Dry",
            ar: "10x غسيل & سيشوار",
          },
          {
            en: "1x Moremo Hair Treatment",
            ar: "جلسة علاج للشعر - موريمو",
          },
          {
            en: "1x Hands & Feet Treatment + Normal Polish",
            ar: "جلسة عناية لليدين والقدمين مع لون",
          },
        ],
      },
      {
        id: "glow-up",
        name: {
          en: "Glow Up Package",
          ar: "باقة جلو أب",
        },
        promoPrice: 700,
        originalPrice: 1350,
        currency: "AED",
        inclusions: [
          {
            en: "2x Deep Cleansing Facial",
            ar: "جلستان تنظيف عميق للبشرة",
          },
          {
            en: "1x Hair Trimming & Blow Dry",
            ar: "قص اطراف الشعر مع سيشوار",
          },
          {
            en: "1x Lash Lifting",
            ar: "جلسة ليفت للرموش",
          },
          {
            en: "1x Brow Lamination",
            ar: "جلسة تثبيت الحواجب",
          },
        ],
      },
      {
        id: "princess-hands",
        name: {
          en: "Princess Hands Package",
          ar: "باقة أيدي الأميرة",
        },
        promoPrice: 400,
        originalPrice: 800,
        currency: "AED",
        inclusions: [
          {
            en: "1x Hard Gel Extension + Color",
            ar: "تركيب اظافر هارد جل مع لون",
          },
          {
            en: "1x Refill and Cleaning",
            ar: "جلسة اعادة تعبئة وتنظيف الاظافر",
          },
          {
            en: "1x Hands Treatment",
            ar: "جلسة عناية لليدين",
          },
          {
            en: "1x Session Solarium - unlimited minutes",
            ar: "جلسة سولاريوم - تان",
          },
        ],
      },
    ],
    weeklyOffer: {
      id: "hot-tuesday",
      title: {
        en: "Hot Tuesday Offer",
        ar: "عرض الثلاثاء المميز",
      },
      discountPercent: 20,
      description: {
        en: "20% off every service",
        ar: "خصم 20% على كل خدمة",
      },
      constraint: {
        en: "Excluding the August Special Packages",
        ar: "باستثناء باقات عروض أغسطس الخاصة",
      },
      duration: {
        en: "Only in August",
        ar: "خلال شهر أغسطس فقط",
      },
    },
    endsLabel: {
      en: "Ends 31 August",
      ar: "ينتهي 31 أغسطس",
    },
  },
];
