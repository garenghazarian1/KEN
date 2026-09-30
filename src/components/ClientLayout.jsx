"use client";

import ErrorBoundary from "./ErrorBoundary";
import { AssistantProvider } from "@/components/AssistantWidget/AssistantWidget";

export default function ClientLayout({ children }) {
  return (
    <ErrorBoundary>
      <AssistantProvider>{children}</AssistantProvider>
    </ErrorBoundary>
  );
}
