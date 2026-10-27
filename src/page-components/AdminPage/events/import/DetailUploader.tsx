"use client";

import { parseEventDetail } from "@/lib/tcdb/parser/detail-parser";
import { CheckCircle2, FileText, Upload } from "lucide-react";

export interface UploadedDetailPage {
  eventId: string;
  fileName: string;
  html: string;
}

interface DetailUploaderProps {
  detailPages: Record<string, UploadedDetailPage>;
  onUploaded: (
    files: File[],
    pages: Record<string, UploadedDetailPage>,
  ) => void;
}

export default function DetailUploader({
  detailPages,
  onUploaded,
}: DetailUploaderProps) {
  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    const pages: Record<string, UploadedDetailPage> = {};
    for (const file of files) {
      const html = await file.text();

      const detail = parseEventDetail(html);

      pages[detail.eventId] = {
        eventId: detail.eventId,
        fileName: file.name,
        html,
      };
    }

    onUploaded(files, pages);

    // Allow re-selecting the same file(s) again.
    e.target.value = "";
  }

  const uploaded = Object.values(detailPages);
  const count = uploaded.length;

  return (
    <div className="space-y-6 rounded-xl border bg-background p-6 shadow-sm">
      <div className="flex items-center gap-2">
        <Upload className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Upload Detail Pages</h2>
      </div>

      <p className="text-sm text-muted-foreground">
        Select downloaded TCDB event HTML pages. Uploads accumulate — add more
        at any time.
      </p>

      <input
        type="file"
        multiple
        accept=".html,.htm"
        onChange={handleFiles}
        className="block w-full rounded-lg border p-3"
      />

      {count > 0 && (
        <div className="rounded-lg border border-green-300 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950/40">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
            <span className="font-medium">{count} detail page(s) uploaded</span>
          </div>
        </div>
      )}

      {count > 0 && (
        <div className="overflow-x-auto rounded-lg border">
          <table className="min-w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">
                  Event ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">
                  File
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {uploaded.map((page) => (
                <tr key={page.eventId}>
                  <td className="px-4 py-3">
                    <code className="rounded bg-muted px-2 py-1 text-xs">
                      {page.eventId}
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {page.fileName}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900/50 dark:text-green-300">
                      Uploaded
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
