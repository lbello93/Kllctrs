import HomePageSections from "@/page-components/HomePage/pages";
import { HomePageLoadingGate } from "./HomePageLoadingGate";

export default function Page() {
  return (
    <HomePageLoadingGate>
      <HomePageSections />
    </HomePageLoadingGate>
  );
}
