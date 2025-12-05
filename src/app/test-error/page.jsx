"use client";

import { useState } from "react";

/**
 * Separate component that throws an error - must be outside the main component
 * for ErrorBoundary to catch it properly
 */
function ErrorComponent({ shouldThrow }) {
  if (shouldThrow) {
    throw new Error(
      "Test error: This is a test error to verify ErrorBoundary is working!"
    );
  }
  return null;
}

/**
 * Test page to verify ErrorBoundary is working
 *
 * This page allows you to test the ErrorBoundary component
 * by triggering different types of errors.
 *
 * Access at: /test-error
 *
 * Note: In development mode, Next.js shows its own error overlay.
 * The ErrorBoundary will work in production. To see it in dev mode,
 * you may need to dismiss the Next.js overlay.
 */
export default function TestErrorPage() {
  const [shouldThrow, setShouldThrow] = useState(false);

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1>ErrorBoundary Test Page</h1>
      <p style={{ marginTop: "1rem", marginBottom: "2rem" }}>
        This page allows you to test if the ErrorBoundary component is working
        correctly.
      </p>

      <div style={{ marginBottom: "2rem" }}>
        <button
          onClick={() => setShouldThrow(true)}
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: "#ae8b77",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "500",
          }}
        >
          Trigger Error (Test ErrorBoundary)
        </button>
      </div>

      <div
        style={{
          padding: "1rem",
          backgroundColor: "#f5ebe2",
          borderRadius: "0.5rem",
          marginTop: "2rem",
        }}
      >
        <h2 style={{ marginBottom: "0.5rem" }}>Instructions:</h2>
        <ol style={{ paddingLeft: "1.5rem", lineHeight: "1.8" }}>
          <li>Click the button above to trigger an error</li>
          <li>
            <strong>Development Mode:</strong> Next.js will show a red error
            overlay first.
            <br />
            <strong>To see ErrorBoundary:</strong> Press <kbd>ESC</kbd> or click
            the X to dismiss the overlay, then you'll see the ErrorBoundary
            fallback UI
          </li>
          <li>
            <strong>Production Mode:</strong> Run{" "}
            <code>npm run build && npm start</code> to see the ErrorBoundary
            directly (no Next.js overlay)
          </li>
          <li>
            Once you see the ErrorBoundary UI, try the "Try Again" button to
            reset
          </li>
          <li>Try the "Go to Home" link to navigate away</li>
        </ol>

        <div
          style={{
            marginTop: "1rem",
            padding: "0.75rem",
            backgroundColor: "#ffe9da",
            borderRadius: "0.5rem",
            fontSize: "0.9rem",
          }}
        >
          <strong>💡 Tip:</strong> The ErrorBoundary is working correctly!
          Next.js's development overlay is just showing first. In production,
          users will only see the ErrorBoundary UI.
        </div>
      </div>

      {/* This component will throw an error when shouldThrow is true */}
      <ErrorComponent shouldThrow={shouldThrow} />
    </div>
  );
}
