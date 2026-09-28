// Type scale and button styles from the KLLCTRS style guide.
// Import these instead of repeating raw sizes in each step.

export const displayXl =
  "font-unica-one font-normal text-[32px] leading-[38px] tracking-[-0.01em] sm:text-[48px] sm:leading-[57px]";

export const headingM =
  "font-space-grotesk font-normal text-[20px] leading-[26px] tracking-[-0.01em]";

export const bodyM = "font-inter font-normal text-[14px] leading-[17px]";

export const caption = "font-inter font-normal text-[12px] leading-[15px]";

export const primaryButtonClass = [
  "h-10 rounded-[10px] px-[14px] py-[10px]",
  "font-inter font-normal text-[14px] leading-[17px] tracking-[-0.01em] text-white",
  "bg-[linear-gradient(94.43deg,#5B18BE_35.73%,#9C7CF7_100%)]",
  "shadow-[0px_4px_4px_rgba(0,0,0,0.25)]",
  "transition-opacity hover:opacity-90 active:shadow-none",
  "disabled:cursor-not-allowed disabled:opacity-50",
].join(" ");
