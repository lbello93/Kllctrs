import { Eye, Globe, MapPinned, Building2 } from "lucide-react";
import { SummaryStats } from "@/types/analytics";
import StatCard from "./StatCard";

interface SummaryCardsProps {
  summary: SummaryStats;
}

export default function SummaryCards({ summary }: SummaryCardsProps) {
  const cards = [
    {
      title: "Total Views",
      value: summary.totalViews,
      subtitle: "All page visits",
      icon: <Eye size={24} />,
    },
    {
      title: "Countries",
      value: summary.uniqueCountries,
      subtitle: "Unique countries",
      icon: <Globe size={24} />,
    },
    {
      title: "States",
      value: summary.uniqueStates,
      subtitle: "Unique states",
      icon: <MapPinned size={24} />,
    },
    {
      title: "Cities",
      value: summary.uniqueCities,
      subtitle: "Unique cities",
      icon: <Building2 size={24} />,
    },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <StatCard
          key={card.title}
          title={card.title}
          value={card.value.toLocaleString()}
          subtitle={card.subtitle}
          icon={card.icon}
        />
      ))}
    </div>
  );
}
