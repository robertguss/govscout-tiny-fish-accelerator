"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  ExternalLink,
  Calendar,
  Building2,
  DollarSign,
} from "lucide-react";

const SET_ASIDE_LABELS: Record<string, string> = {
  "8a": "8(a)",
  hubzone: "HUBZone",
  sdvosb: "SDVOSB",
  wosb: "WOSB",
  small_business: "Small Business",
  unrestricted: "Unrestricted",
  other: "Other",
};

const AGENCY_LEVEL_LABELS: Record<string, string> = {
  federal: "Federal",
  state: "State",
  county: "County",
  municipal: "Municipal",
  school_district: "School District",
  special_district: "Special District",
};

function formatDeadline(timestamp: number | undefined): string {
  if (!timestamp) return "";
  const daysLeft = Math.ceil((timestamp - Date.now()) / (1000 * 60 * 60 * 24));
  if (daysLeft < 0) return "Expired";
  if (daysLeft === 0) return "Due today";
  if (daysLeft === 1) return "Due tomorrow";
  return `${daysLeft}d left`;
}

function formatBudget(amount: number | undefined): string {
  if (!amount) return "";
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$${Math.round(amount / 1_000)}K`;
  return `$${amount.toLocaleString()}`;
}

export default function SearchPage() {
  const [inputValue, setInputValue] = useState("");
  const [query, setQuery] = useState("");
  const [agencyLevel, setAgencyLevel] = useState("");
  const [setAside, setSetAside] = useState("");

  const results = useQuery(api.opportunities.searchOpportunities, {
    query: query || undefined,
    agencyLevel: agencyLevel || undefined,
    setAside: setAside || undefined,
    limit: 50,
  });

  const hasActiveFilters = !!agencyLevel || !!setAside;

  function handleSearch() {
    setQuery(inputValue);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleSearch();
    }
  }

  function handleClearFilters() {
    setAgencyLevel("");
    setSetAside("");
  }

  const isLoading = results === undefined;

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
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 px-4 md:gap-6 md:py-6 lg:px-6">
              {/* Search bar */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    placeholder="Search opportunities..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <Button onClick={handleSearch}>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>

              {/* Filter row */}
              <div className="flex flex-wrap items-center gap-2">
                <Select
                  value={agencyLevel || "all"}
                  onValueChange={(v) => setAgencyLevel(v === "all" ? "" : v)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="federal">Federal</SelectItem>
                    <SelectItem value="state">State</SelectItem>
                    <SelectItem value="county">County</SelectItem>
                    <SelectItem value="municipal">Municipal</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={setAside || "all"}
                  onValueChange={(v) => setSetAside(v === "all" ? "" : v)}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Set-Aside" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="small_business">
                      Small Business
                    </SelectItem>
                    <SelectItem value="8a">8(a)</SelectItem>
                    <SelectItem value="hubzone">HUBZone</SelectItem>
                    <SelectItem value="sdvosb">SDVOSB</SelectItem>
                    <SelectItem value="wosb">WOSB</SelectItem>
                    <SelectItem value="unrestricted">Unrestricted</SelectItem>
                  </SelectContent>
                </Select>

                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearFilters}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Clear filters
                  </Button>
                )}
              </div>

              {/* Loading state */}
              {isLoading && (
                <div className="flex items-center justify-center py-12">
                  <div className="text-muted-foreground">
                    Loading opportunities...
                  </div>
                </div>
              )}

              {/* Results list */}
              {!isLoading && results.length > 0 && (
                <div className="flex flex-col gap-3">
                  {results.map(
                    (opp: {
                      _id: string;
                      title: string;
                      agency: string;
                      agencyLevel: string;
                      setAside?: string;
                      state?: string;
                      deadline?: number;
                      estimatedBudget?: number;
                      description?: string;
                      sourceUrl: string;
                    }) => {
                      const deadline = formatDeadline(opp.deadline);
                      const budget = formatBudget(opp.estimatedBudget);

                      return (
                        <Card key={opp._id}>
                          <CardHeader className="pb-2">
                            <div className="flex items-start justify-between gap-2">
                              <CardTitle className="text-base font-semibold leading-snug">
                                {opp.title}
                              </CardTitle>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 shrink-0"
                                asChild
                              >
                                <a
                                  href={opp.sourceUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  aria-label="Open original opportunity"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                              </Button>
                            </div>

                            {/* Badges */}
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {opp.agencyLevel && (
                                <Badge variant="secondary">
                                  {AGENCY_LEVEL_LABELS[opp.agencyLevel] ??
                                    opp.agencyLevel}
                                </Badge>
                              )}
                              {opp.setAside &&
                                opp.setAside !== "unrestricted" && (
                                  <Badge variant="outline">
                                    {SET_ASIDE_LABELS[opp.setAside] ??
                                      opp.setAside}
                                  </Badge>
                                )}
                              {opp.state && (
                                <Badge variant="outline">{opp.state}</Badge>
                              )}
                            </div>
                          </CardHeader>

                          <CardContent className="pt-0">
                            {/* Meta row */}
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mb-2">
                              {opp.agency && (
                                <span className="flex items-center gap-1">
                                  <Building2 className="h-3.5 w-3.5" />
                                  {opp.agency}
                                </span>
                              )}
                              {deadline && (
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3.5 w-3.5" />
                                  {deadline}
                                </span>
                              )}
                              {budget && (
                                <span className="flex items-center gap-1">
                                  <DollarSign className="h-3.5 w-3.5" />
                                  {budget}
                                </span>
                              )}
                            </div>

                            {/* Description */}
                            {opp.description && (
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {opp.description}
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      );
                    },
                  )}
                </div>
              )}

              {/* Empty state */}
              {!isLoading && results.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <Search className="h-10 w-10 text-muted-foreground/40" />
                  <p className="text-muted-foreground text-sm">
                    {query || hasActiveFilters
                      ? "No opportunities found matching your search."
                      : "Search for government contracting opportunities."}
                  </p>
                </div>
              )}

              {/* Results count */}
              {!isLoading && results.length > 0 && (
                <p className="text-sm text-muted-foreground text-center">
                  Showing {results.length} result
                  {results.length !== 1 ? "s" : ""}
                </p>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
