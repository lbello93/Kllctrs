"use client";

import { useSyncExternalStore } from "react";

const CONSENT_KEY = "kllctbls-cookie-consent";

function subscribeToConsent(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener("cookie-consent-change", onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener("cookie-consent-change", onChange);
  };
}

function hasNoConsent() {
  return localStorage.getItem(CONSENT_KEY) === null;
}

export default function CookieBanner() {
  const visible = useSyncExternalStore(
    subscribeToConsent,
    hasNoConsent,
    () => false,
  );

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    window.dispatchEvent(new Event("cookie-consent-change"));
  };

  const decline = () => {
    localStorage.setItem(CONSENT_KEY, "declined");
    window.dispatchEvent(new Event("cookie-consent-change"));
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-3 left-3 right-3 z-50 sm:bottom-4 sm:left-4 sm:right-4">
      <div className="mx-auto flex max-h-[60dvh] w-full max-w-4xl min-w-0 flex-col items-start gap-3 overflow-y-auto rounded-xl border border-violet-800 bg-[#1a0a3d] p-3 shadow-2xl sm:flex-row sm:items-center sm:gap-4 sm:p-4">
        <p className="w-full min-w-0 break-words text-sm text-violet-200 sm:flex-1">
          We use essential cookies for authentication and session management. No
          tracking or advertising cookies are used.{" "}
          <a
            href="/privacy"
            className="text-violet-400 hover:text-violet-300 hover:underline"
          >
            Privacy Policy
          </a>
        </p>
        <div className="flex w-full shrink-0 justify-end gap-2 sm:w-auto">
          <button
            onClick={decline}
            className="h-9 px-4 rounded-md border border-violet-300 text-violet-600 text-sm hover:bg-violet-50"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="h-9 px-4 rounded-md bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
