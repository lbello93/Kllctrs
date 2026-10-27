"use client";

import { useEffect, useState, type ReactNode } from "react";
import { KllctrsLoader } from "./KllctrsLoader";

export function HomePageLoadingGate({
  children,
}: {
  children: ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 1600);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      <div aria-hidden={isLoading} inert={isLoading}>
        {children}
      </div>
      {isLoading && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#FEF9FF]">
          <KllctrsLoader size={72} label="KLLCTRS" />
        </div>
      )}
    </>
  );
}
