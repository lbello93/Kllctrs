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
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="max-w-4xl mx-auto bg-[#1a0a3d] border border-violet-800 rounded-xl p-4 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="text-sm text-violet-200 flex-1">
          We use essential cookies for authentication and session management. No
          tracking or advertising cookies are used.{" "}
          <a
            href="/privacy"
            className="text-violet-400 hover:text-violet-300 hover:underline"
          >
            Privacy Policy
          </a>
        </p>
        <div className="flex gap-2 shrink-0">
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
