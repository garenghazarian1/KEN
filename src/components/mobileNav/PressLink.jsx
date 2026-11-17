"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePressFeedback } from "./usePressFeedback";
import pressStyles from "./pressFeedback.module.css";

function samePlace(href) {
  try {
    const next = new URL(href, window.location.href);
    const now = new URL(window.location.href);
    return next.pathname === now.pathname && next.search === now.search;
  } catch {
    return false;
  }
}

function classNames(...parts) {
  return parts.filter(Boolean).join(" ");
}

export function openingName(busy, name) {
  return busy ? "Opening…" : name;
}

export function OpeningMark({ show }) {
  if (!show) return null;
  return (
    <span className={pressStyles.opening}>
      <span className={pressStyles.spinner} aria-hidden="true" />
      Opening…
    </span>
  );
}

export default function PressLink({
  href,
  external = false,
  blank = false,
  showOpening = false,
  insetFocus = false,
  className,
  onAction,
  children,
  prefetch = false,
  "aria-label": ariaLabel,
  ...rest
}) {
  const router = useRouter();
  const { busy, press } = usePressFeedback();

  const onClick = (event) => {
    press(
      event,
      ({ href: liveHref }) => {
        onAction?.(liveHref);
        if (external) {
          if (blank) {
            window.open(liveHref || href, "_blank", "noopener,noreferrer");
            return;
          }
          window.location.assign(liveHref || href);
          return;
        }
        if (samePlace(href)) return "stay";
        router.push(href);
      },
      { external },
    );
  };

  const shared = {
    ...rest,
    className: classNames(
      pressStyles.press,
      showOpening ? pressStyles.host : "",
      insetFocus ? pressStyles.bar : "",
      className,
    ),
    "aria-busy": busy || undefined,
    "aria-label": showOpening ? openingName(busy, ariaLabel) : ariaLabel,
    onClick,
  };

  const face = (
    <>
      {children}
      {showOpening ? <OpeningMark show={busy} /> : null}
    </>
  );

  if (external) {
    return (
      <a
        {...shared}
        href={href}
        target={blank ? "_blank" : undefined}
        rel={blank ? "noopener noreferrer" : undefined}
      >
        {face}
      </a>
    );
  }

  return (
    <Link {...shared} href={href} prefetch={prefetch}>
      {face}
    </Link>
  );
}
