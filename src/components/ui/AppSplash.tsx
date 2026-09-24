// src/components/ui/AppSplash.tsx
"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";

const FACET_PATHS = [
  "M4.24335 3.87914L4.33319 10.9585C4.33838 11.4169 4.90163 11.6585 5.26445 11.359L10.9384 6.64105C10.7691 6.32828 10.5946 6.01387 10.4166 5.69614C9.23311 3.5945 8.0185 1.69641 6.83153 0.000213623L4.15869 3.60774C4.21052 3.68717 4.24162 3.77984 4.24335 3.88079V3.87914Z",
  "M9.11218 11.6287L12.5193 16.2324C13.0756 15.132 13.5681 14.0712 14.0017 13.0618C13.4177 11.6519 12.7439 10.1625 11.9664 8.61194L9.20202 10.9105C8.98432 11.0925 8.94458 11.402 9.11218 11.6287Z",
  "M7.48465 13.1197C7.29286 12.8599 6.90757 12.8152 6.65705 13.0254L4.58029 14.7547C4.45589 14.8589 4.38505 15.0095 4.38678 15.1684L4.4127 19.931C5.52537 21.2879 6.63805 22.6432 7.75072 24.0002C8.93942 22.3768 10.1782 20.5035 11.3738 18.3771L7.48465 13.123V13.1197Z",
  "M2.03875 6.46729L0 9.22092L0.387017 15.0211C0.974454 15.7376 1.56189 16.4542 2.14933 17.1707L2.03875 6.46729Z",
];

export default function AppSplash({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(true);
  const panelRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLParagraphElement>(null);
  const facetRefs = useRef<SVGPathElement[]>([]);

  useLayoutEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => setMounted(false),
    });

    tl.set(markRef.current, { scale: 0.15, opacity: 0, filter: "blur(10px)" })
      .set(flashRef.current, { scale: 0.3, opacity: 0 })
      .set(facetRefs.current, { opacity: 0.2 })
      .set(wordmarkRef.current, { scale: 0.7, opacity: 0, filter: "blur(6px)" })

      // gem rushes toward the viewer
      .to(markRef.current, {
        scale: 1,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.8,
        ease: "power4.out",
      })
      .to(
        flashRef.current,
        { scale: 1.8, opacity: 0.6, duration: 0.5, ease: "power2.out" },
        "<",
      )
      .to(flashRef.current, {
        opacity: 0,
        duration: 0.4,
        ease: "power1.out",
      })

      // facets light up one after another once the gem has landed
      .to(
        facetRefs.current,
        { opacity: 1, duration: 0.25, stagger: 0.08, ease: "power1.out" },
        "-=0.3",
      )

      // wordmark uses the same rush and settle language as the gem
      .to(
        wordmarkRef.current,
        {
          scale: 1,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.5,
          ease: "power4.out",
        },
        "-=0.1",
      )

      // brief hold so it actually registers
      .to({}, { duration: 0.4 })

      // whole panel rises up and off screen, page emerges from underneath
      .to(panelRef.current, {
        yPercent: -100,
        duration: 0.9,
        ease: "power3.inOut",
      });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <>
      {mounted && (
        <div
          ref={panelRef}
          className="fixed inset-0 z-[100000] flex flex-col items-center justify-center gap-6 bg-[#FEF9FF]"
        >
          <div
            ref={markRef}
            className="relative flex items-center justify-center w-[104px] h-[104px]"
          >
            <div
              ref={flashRef}
              className="absolute inset-0 rounded-full bg-white blur-2xl"
            />

            <svg
              viewBox="0 0 14 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="relative z-10 w-[44px] h-[75px]"
            >
              {FACET_PATHS.map((d, i) => (
                <path
                  key={i}
                  ref={(el) => {
                    if (el) facetRefs.current[i] = el;
                  }}
                  fill="#8B5CF6"
                  d={d}
                />
              ))}
            </svg>
          </div>

          <p
            ref={wordmarkRef}
            className="font-space-grotesk text-[26px] sm:text-[30px] font-medium tracking-[0.35em] text-[#5B18BE]"
          >
            KLLCTRS
          </p>
        </div>
      )}
      {children}
    </>
  );
}
