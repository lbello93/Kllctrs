import SponsorshipInsightsClient from "./SponsorshipInsightsClient";

export default function SponsorshipInsightsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Sponsorship Insights</h1>
        <p className="text-muted-foreground">
          What collectors actually favorite, save, and click — the data behind
          allocation recommendations.
        </p>
      </div>

      <SponsorshipInsightsClient />
    </div>
  );
}
