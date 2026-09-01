import { SiteNav } from "@/components/site-nav";
import { Hero } from "@/components/hero";
import { MarketsGrid } from "@/components/markets-grid";
import { LaunchSection } from "@/components/launch-section";
import { HowItWorks } from "@/components/how-it-works";
import { TrustToken } from "@/components/trust-token";
import { ApiSection } from "@/components/api-section";
import { SiteFooter } from "@/components/site-footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteNav />
      <main className="flex-1">
        <Hero />
        <MarketsGrid />
        <HowItWorks />
        <LaunchSection />
        <TrustToken />
        <ApiSection />
      </main>
      <SiteFooter />
    </div>
  );
}
