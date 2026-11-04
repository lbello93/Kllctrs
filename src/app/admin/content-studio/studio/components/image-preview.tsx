"use client";

import { useMemo, useState } from "react";
import { Check, Copy, Download, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { ImageTemplate, StudioInput } from "@/lib/content-studio";

interface Props {
  template: ImageTemplate;
  input: StudioInput;
}

const MAX_PREVIEW_W = 420;

export function ImagePreview({ template, input }: Props) {
  const html = useMemo(() => template.render(input), [template, input]);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  const scale = Math.min(1, MAX_PREVIEW_W / template.width);

  const copyHtml = async () => {
    await navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const downloadPng = async () => {
    setDownloading(true);
    const iframe = document.createElement("iframe");
    iframe.style.cssText = `position:fixed;left:-9999px;top:0;width:${template.width}px;height:${template.height}px;border:none;`;
    document.body.appendChild(iframe);
    try {
      const doc = iframe.contentDocument;
      if (!doc) throw new Error("no iframe doc");
      doc.open();
      doc.write(html);
      doc.close();

      // Wait for webfonts to load before capturing.
      await new Promise((r) => setTimeout(r, 600));
      try {
        if (doc.fonts?.ready) await doc.fonts.ready;
      } catch {
        /* ignore */
      }

      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(doc.body, {
        width: template.width,
        height: template.height,
        scale: 1,
        useCORS: true,
        backgroundColor: null,
      });

      const slug = `${input.topic.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "image"}_${template.id}`;
      const link = document.createElement("a");
      link.download = `${slug}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (e) {
      console.error("PNG export failed", e);
    } finally {
      document.body.removeChild(iframe);
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-white">{template.name}</p>
          <p className="text-xs text-white/40">{template.aspect} · {template.width}×{template.height}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={copyHtml}>
            {copied ? <Check className="size-3.5 text-amethyst-400" /> : <Copy className="size-3.5" />}
            Copy HTML
          </Button>
          <Button
            size="sm"
            onClick={downloadPng}
            disabled={downloading}
            style={{ background: input.accent, color: "#FEF9FF" }}
          >
            {downloading ? <Loader2 className="size-3.5 animate-spin" /> : <Download className="size-3.5" />}
            Download PNG
          </Button>
        </div>
      </div>

      <div className="flex justify-center rounded-xl border border-white/10 bg-black/40 p-4">
        <div
          style={{ width: template.width * scale, height: template.height * scale, overflow: "hidden" }}
          className="rounded-lg"
        >
          <iframe
            title={`${template.name} preview`}
            srcDoc={html}
            width={template.width}
            height={template.height}
            style={{ transform: `scale(${scale})`, transformOrigin: "top left", border: "none" }}
            scrolling="no"
          />
        </div>
      </div>
    </div>
  );
}
