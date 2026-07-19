/** Client-only assistant copy kept separate from the server knowledge base. */
export const ASSISTANT_WELCOME = {
  title: "Ani",
  greeting:
    "Hi, I'm Ani from Ken Beauty Salon! I can help with services, prices, and our locations.",
  namePrompt: "Your name (optional)",
  nameLabel: "Your name (optional)",
  nameSaveLabel: "Save",
  nameDismissLabel: "Dismiss name prompt",
  disclaimer:
    "Ani is an AI assistant; spoken replies use an AI-generated voice. For bookings, payments, and account issues our team helps you directly on WhatsApp or by phone.",
};

export const ASSISTANT_QUICK_CHIPS = [
  "What services do you offer?",
  "Where are you located?",
  "How do I book?",
  "Talk to the salon",
];

/** One-time launcher teaser tips (each shown once for ASSISTANT_LAUNCHER_TIP_MS). */
export const ASSISTANT_LAUNCHER_TIP_MS = 4200;

export const ASSISTANT_LAUNCHER_TIPS = [
  "Ask me anything — we're here to serve you.",
  "Glow with us — explore treatments tailored to you.",
  "Prices, locations, booking tips — tap Ani now.",
];
