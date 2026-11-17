"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { whenThirdParties } from "@/components/scheduleThirdParties";

const DraggableWhatsAppButton = dynamic(
  () => import("@/components/DraggableWhatsAppButton/DraggableWhatsAppButton"),
  { ssr: false },
);

export default function DeferredWhatsApp() {
  const [on, setOn] = useState(false);
  useEffect(() => whenThirdParties(() => setOn(true)), []);
  if (!on) return null;
  return <DraggableWhatsAppButton />;
}
