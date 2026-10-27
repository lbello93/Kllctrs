"use client";

export type ImportStep =
  | "idle"
  | "uploaded"
  | "parsing"
  | "parsed"
  | "geocoding"
  | "importing"
  | "completed"
  | "error";

interface ImportStatusProps {
  currentStep?: ImportStep;

  message?: string;

  eventsFound?: number;

  imported?: number;

  failed?: number;
}

const STEP_LABELS: Record<ImportStep, string> = {
  idle: "Waiting for HTML Upload",
  uploaded: "HTML Uploaded",
  parsing: "Parsing Calendar",
  parsed: "Calendar Parsed",
  geocoding: "Geocoding Venues",
  importing: "Importing Events",
  completed: "Import Completed",
  error: "Import Failed",
};

const STEP_COLORS: Record<ImportStep, string> = {
  idle: "bg-gray-100 text-gray-700",
  uploaded: "bg-blue-100 text-blue-700",
  parsing: "bg-yellow-100 text-yellow-700",
  parsed: "bg-indigo-100 text-indigo-700",
  geocoding: "bg-purple-100 text-purple-700",
  importing: "bg-orange-100 text-orange-700",
  completed: "bg-green-100 text-green-700",
  error: "bg-red-100 text-red-700",
};

export default function ImportStatus({
  currentStep = "idle",
  message = "Generate a TCDB URL and upload the saved HTML page.",
  eventsFound = 0,
  imported = 0,
  failed = 0,
}: ImportStatusProps) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Import Status</h2>

          <p className="mt-1 text-sm text-gray-500">
            Live progress of the TCDB import process.
          </p>
        </div>

        <span
          className={`rounded-full px-4 py-2 text-sm font-semibold ${STEP_COLORS[currentStep]}`}
        >
          {STEP_LABELS[currentStep]}
        </span>
      </div>

      <div className="mt-6 rounded-lg border bg-gray-50 p-4">{message}</div>

      <div className="mt-8 grid grid-cols-3 gap-4">
        <div className="rounded-lg border p-4 text-center">
          <h3 className="text-3xl font-bold">{eventsFound}</h3>

          <p className="mt-2 text-sm text-gray-500">Events Found</p>
        </div>

        <div className="rounded-lg border p-4 text-center">
          <h3 className="text-3xl font-bold text-green-600">{imported}</h3>

          <p className="mt-2 text-sm text-gray-500">Imported</p>
        </div>

        <div className="rounded-lg border p-4 text-center">
          <h3 className="text-3xl font-bold text-red-600">{failed}</h3>

          <p className="mt-2 text-sm text-gray-500">Failed</p>
        </div>
      </div>
    </div>
  );
}
