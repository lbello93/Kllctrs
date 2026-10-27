import AnalyticsClient from "./AnalyticsClient";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">
          See where visitors are accessing KLLCTRS from.
        </p>
      </div>

      <AnalyticsClient />
    </div>
  );
}
