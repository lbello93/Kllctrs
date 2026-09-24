"use client";

import { useEffect, useState } from "react";

import { AnalyticsResponse } from "@/types/analytics";

import DashboardHeader from "@/components/admin/analytics/DashboardHeader";
import DashboardSection from "@/components/admin/analytics/DashboardSection";
import SummaryCards from "@/components/admin/analytics/SummaryCards";
import LoadingDashboard from "@/components/admin/analytics/LoadingDashboard";
import EmptyDashboard from "@/components/admin/analytics/EmptyDashboard";

import AnalyticsLineChart from "@/components/admin/analytics/charts/AnalyticsLineChart";
import AnalyticsBarChart from "@/components/admin/analytics/charts/AnalyticsBarChart";
import DateFilter, {
  DateRange,
} from "@/components/admin/analytics/filters/DateFilter";

export default function AnalyticsClient() {
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<DateRange>("30d");

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true);
      try {
        const response = await fetch(`/api/admin/analytics?range=${range}`);

        if (!response.ok) {
          throw new Error("Failed to fetch analytics.");
        }

        const analytics: AnalyticsResponse = await response.json();
        setData(analytics);
      } catch (error) {
        console.error("Analytics Error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, [range]);

  // Loading State
  if (loading) {
    return (
      <main className="min-h-screen bg-[#f4f3fb]">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <LoadingDashboard />
        </div>
      </main>
    );
  }

  // Error State
  if (!data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f4f3fb]">
        <div className="rounded-2xl border border-red-200 bg-white px-8 py-6 shadow-sm">
          <p className="text-lg font-medium text-red-600">
            Failed to load analytics.
          </p>
        </div>
      </main>
    );
  }

  // Empty State
  const hasAnalytics =
    data.summary.totalViews > 0 ||
    data.timeline.length > 0 ||
    data.pages.length > 0 ||
    data.countries.length > 0 ||
    data.states.length > 0 ||
    data.cities.length > 0;

  if (!hasAnalytics) {
    return (
      <main className="min-h-screen bg-[#f4f3fb]">
        <div className="mx-auto max-w-7xl space-y-6 px-6 py-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <DashboardHeader />
            <DateFilter value={range} onChange={setRange} />
          </div>
          <EmptyDashboard />
        </div>
      </main>
    );
  }

  // Dashboard
  return (
    <main className="min-h-screen bg-[#f4f3fb]">
      <div className="mx-auto max-w-7xl space-y-8 px-6 py-8">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <DashboardHeader />
          <DateFilter value={range} onChange={setRange} />
        </div>

        <SummaryCards summary={data.summary} />

        <DashboardSection
          title="Traffic Overview"
          description="Daily visitor trend across KLLCTRS."
        >
          <AnalyticsLineChart
            data={data.timeline}
            dataKey="views"
            xKey="date"
            valueLabel="Views"
          />
        </DashboardSection>

        <div className="grid gap-8 xl:grid-cols-2">
          <DashboardSection title="Top Pages" description="Most visited pages.">
            <AnalyticsBarChart
              data={data.pages}
              dataKey="views"
              xKey="page"
              valueLabel="Page views"
            />
          </DashboardSection>

          <DashboardSection
            title="Top Countries"
            description="Visitor distribution by country."
          >
            <AnalyticsBarChart
              data={data.countries}
              dataKey="views"
              xKey="country"
              valueLabel="Views"
            />
          </DashboardSection>

          <DashboardSection
            title="Top States"
            description="Visitor distribution by state."
          >
            <AnalyticsBarChart
              data={data.states}
              dataKey="views"
              xKey="state"
              valueLabel="Views"
            />
          </DashboardSection>

          <DashboardSection
            title="Top Cities"
            description="Visitor distribution by city."
          >
            <AnalyticsBarChart
              data={data.cities}
              dataKey="views"
              xKey="city"
              valueLabel="Views"
            />
          </DashboardSection>
        </div>
      </div>
    </main>
  );
}
