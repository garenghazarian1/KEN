"use client";

import ErrorBoundary from "./ErrorBoundary";
import AdsAttributionCapture from "./AdsAttributionCapture";
import { AssistantProvider } from "@/components/AssistantWidget/AssistantWidget";

export default function ClientLayout({ children }) {
  return (
    <ErrorBoundary>
      <AdsAttributionCapture />
      <AssistantProvider>{children}</AssistantProvider>
    </ErrorBoundary>
  );
}
