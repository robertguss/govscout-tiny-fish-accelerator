"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Globe, Building2, MapPin, TrendingUp } from "lucide-react";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Page() {
  const router = useRouter();

  const stats = useQuery(api.opportunities.getStats, {});
  const recentOpportunities = useQuery(api.opportunities.listRecent, {
    limit: 5,
  });
  const portals = useQuery(api.portals.listPortals, {});
  const profile = useQuery(api.userProfiles.getMyProfile, {});

  // Redirect to onboarding if profile exists but onboarding is not complete
  useEffect(() => {
    if (
      profile !== undefined &&
      profile !== null &&
      profile.onboardingComplete === false
    ) {
      router.push("/dashboard/onboarding");
    }
  }, [profile, router]);

  const statCards = [
    {
      label: "Total Opportunities",
      value: stats?.total,
      icon: Globe,
    },
    {
      label: "Federal",
      value: stats?.federal,
      icon: Building2,
    },
    {
      label: "State",
      value: stats?.state,
      icon: MapPin,
    },
    {
      label: "Local",
      value: stats?.local,
      icon: TrendingUp,
    },
  ];

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {statCards.map((card) => {
                const Icon = card.icon;
                return (
                  <Card key={card.label}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {card.label}
                      </CardTitle>
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">
                        {card.value === undefined
                          ? "—"
                          : card.value.toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Recent Opportunities */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Opportunities</CardTitle>
                <Link
                  href="/dashboard/search"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  View all →
                </Link>
              </CardHeader>
              <CardContent>
                {recentOpportunities === undefined ? (
                  <p className="text-sm text-muted-foreground">Loading...</p>
                ) : recentOpportunities.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No opportunities yet. Run a search or wait for the nightly
                    sync.
                  </p>
                ) : (
                  <ul className="divide-y">
                    {recentOpportunities.map((opp) => (
                      <li
                        key={opp._id}
                        className="flex items-center justify-between gap-4 py-3"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">{opp.title}</p>
                          <p className="text-sm text-muted-foreground truncate">
                            {opp.agency}
                          </p>
                        </div>
                        <Badge
                          variant="secondary"
                          className="shrink-0 capitalize"
                        >
                          {opp.agencyLevel.replace(/_/g, " ")}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            {/* Indexed Portals — only shown when portals exist */}
            {portals && portals.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Indexed Portals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {portals.map((portal) => (
                      <Badge key={portal._id} variant="outline">
                        {portal.name}
                        {portal.lastScrapeCount != null
                          ? ` (${portal.lastScrapeCount} opps)`
                          : ""}
                      </Badge>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Portals are scraped nightly. Coverage expands as new portals
                    are added.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
