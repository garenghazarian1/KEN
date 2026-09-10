"use client";

import ErrorBoundary from "./ErrorBoundary";
import AdsAttributionCapture from "./AdsAttributionCapture";

export default function ClientLayout({ children }) {
  return (
    <ErrorBoundary>
      <AdsAttributionCapture />
      {children}
    </ErrorBoundary>
  );
}
