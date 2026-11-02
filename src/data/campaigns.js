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
  {
    id: "pink-october-2026",
    slug: "pink-october-2026",
    path: "/offers",
    startsOn: "2026-10-01",
    endsOn: "2026-10-31",
    timezone: CAMPAIGN_TIMEZONE,
    branches: "both",
    theme: {
      en: "Pink October Special",
      ar: "عرض أكتوبر الوردي",
    },
    titleLines: {
      en: ["Pink October", "Special"],
      ar: ["أكتوبر الوردي", "عرض خاص"],
    },
    primaryCta: {
      en: "Get a free haircut every Monday",
      ar: "قصة شعر مجانية كل يوم اثنين",
    },
    heroSubtitle: {
      en: "Available throughout October",
      ar: "متاح طوال شهر أكتوبر",
    },
    bookLabel: {
      en: "Book a Monday",
      ar: "احجزي يوم الاثنين",
    },
    bookMessage: {
      en: "Hello KEN Beauty, I would like to book the free Monday haircut for Pink October.",
      ar: "مرحبا كين بيوتي، أود حجز قصة الشعر المجانية ليوم الاثنين ضمن أكتوبر الوردي.",
    },
    readMoreLabel: { en: "Read more", ar: "اقرئي المزيد" },
    readLessLabel: { en: "Read less", ar: "اقرئي أقل" },
    details: [
      {
        id: "uae",
        title: {
          en: "Pink October in the UAE",
          ar: "أكتوبر الوردي في الإمارات",
        },
        body: {
          en: "October is Breast Cancer Awareness Month. In the UAE it is marked as Pink October: a time for early checks, for standing with people in treatment, and for pink as a sign of care. Clinics, malls, and community groups take part every year.",
          ar: "أكتوبر شهر التوعية بسرطان الثدي. في الإمارات يُعرف بأكتوبر الوردي: وقت للفحوصات المبكرة، وللوقوف مع من يخضعون للعلاج، وللون الوردي كعلامة اهتمام. تشارك فيه العيادات والمجمعات التجارية والمجتمع كل عام.",
        },
      },
      {
        id: "values",
        title: { en: "What we value", ar: "ما نعتز به" },
        body: {
          en: "At Ken, care is personal. Through October a haircut is free every Monday at both Abu Dhabi branches, The Galleria and Rixos Marina. It is how we take part in the month, and how we make one visit easier.",
          ar: "في كين، العناية شخصية. طوال أكتوبر قصة الشعر مجانية كل يوم اثنين في فرعي أبوظبي، الغاليريا وريكسوس مارينا. هكذا نشارك في الشهر، وهكذا نسهّل زيارة واحدة.",
        },
      },
    ],
    endsLabel: {
      en: "Throughout October",
      ar: "طوال شهر أكتوبر",
    },
  },
  {
    id: "iphone-nov-2026",
    slug: "iphone-nov-2026",
    path: "/offers",
    startsOn: "2026-11-01",
    endsOn: "2026-11-30",
    timezone: CAMPAIGN_TIMEZONE,
    branches: "both",
    // Set true when the 200 places are gone. Hides the offer before endsOn.
    soldOut: false,
    theme: {
      en: "Win an iPhone",
      ar: "اربحي آيفون",
    },
    primaryCta: {
      en: "3 blow-dry sessions + 1 Moremo session for AED 500",
      ar: "3 جلسات سيشوار + جلسة موريمو واحدة مقابل 500 درهم",
    },
    description: {
      en: "Win an iPhone at KEN! 3 blow-dry sessions + 1 Moremo session for AED 500. Every subscriber enters the iPhone draw. Limited to 200 subscribers. Book now.",
      ar: "اربحي آيفون في كين! 3 جلسات سيشوار + جلسة موريمو واحدة مقابل 500 درهم. كل مشتركة تدخل سحب الآيفون. العدد محدود بـ 200 مشتركة. احجزي الآن.",
    },
    price: { amount: 500, currency: "AED" },
    subscriberLimit: 200,
    bookLabel: {
      en: "Book now",
      ar: "احجزي الآن",
    },
    bookMessage: {
      en: "Hello KEN Beauty, I would like to book the iPhone offer: 3 blow-dry sessions + 1 Moremo session for AED 500.",
      ar: "مرحبا كين بيوتي، أود حجز عرض الآيفون: 3 جلسات سيشوار + جلسة موريمو واحدة مقابل 500 درهم.",
    },
    watchLabel: {
      en: "Watch with sound",
      ar: "شاهدي مع الصوت",
    },
    watchUrl: "https://youtube.com/shorts/vgNf5H-Tbqs",
    soundLabel: {
      en: "Tap for sound",
      ar: "اضغطي للصوت",
    },
    muteLabel: {
      en: "Mute",
      ar: "كتمي الصوت",
    },
    media: {
      av1: "/videos/offers/iphone-nov2026/ken-iphone-offer-nov2026-av1.mp4",
      h264: "/videos/offers/iphone-nov2026/ken-iphone-offer-nov2026-h264.mp4",
      poster: "/videos/offers/iphone-nov2026/ken-iphone-offer-nov2026-poster.jpg",
    },
    endsLabel: {
      en: "Ends 30 November",
      ar: "ينتهي 30 نوفمبر",
    },
  },
];
