"use client";

import { recordOutbound } from "@/lib/leads/trackLead";

/** Anchor that records a lead click without delaying the native open. */
export default function LeadLink({ href, branch, children, onClick, ...rest }) {
  return (
    <a
      href={href}
      {...rest}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        recordOutbound(href, { branch });
      }}
    >
      {children}
    </a>
  );
}
