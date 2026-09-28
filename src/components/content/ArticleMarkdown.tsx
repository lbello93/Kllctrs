"use client";

import ReactMarkdown from "react-markdown";
import slugify from "slugify";
import type { ReactNode } from "react";

function getText(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getText).join("");
  if (node && typeof node === "object" && "props" in (node as any)) {
    return getText((node as any).props.children);
  }
  return "";
}

export default function ArticleMarkdown({ body }: { body: string }) {
  return (
    <ReactMarkdown
      components={{
        h2: ({ children, ...props }) => {
          const id = slugify(getText(children), { lower: true, strict: true });
          return (
            <h2 id={id} {...props}>
              {children}
            </h2>
          );
        },
        h3: ({ children, ...props }) => {
          const id = slugify(getText(children), { lower: true, strict: true });
          return (
            <h3 id={id} {...props}>
              {children}
            </h3>
          );
        },
      }}
    >
      {body}
    </ReactMarkdown>
  );
}
