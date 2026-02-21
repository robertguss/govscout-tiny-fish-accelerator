"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
import { Check } from "lucide-react";

const stats = [
  { value: "$2.3T+", label: "government procurement market" },
  { value: "350,000+", label: "SAM.gov registrants" },
  { value: "90,000+", label: "local government entities indexed" },
];

const pricingTiers = [
  {
    name: "Free",
    price: "$0",
    period: "/mo",
    description: "Get started with federal contract search",
    popular: false,
    features: [
      "10 searches per month",
      "Federal contracts only",
      "1 saved search",
      "Email support",
    ],
    cta: "Get Started",
    ctaVariant: "outline" as const,
  },
  {
    name: "Starter",
    price: "$49",
    period: "/mo",
    description: "Everything you need to win your first contract",
    popular: true,
    features: [
      "Unlimited searches",
      "Federal + 1 state",
      "AI-powered matching",
      "Daily email alerts",
      "Unlimited saved searches",
      "Priority support",
    ],
    cta: "Get Started",
    ctaVariant: "default" as const,
  },
  {
    name: "Professional",
    price: "$99",
    period: "/mo",
    description: "For growing businesses pursuing multiple contracts",
    popular: false,
    trialNote: "14-day free trial",
    features: [
      "Everything in Starter",
      "Federal + 5 states",
      "Set-aside filtering",
      "Pipeline tracking",
      "Team collaboration",
      "Dedicated support",
    ],
    cta: "Start Free Trial",
    ctaVariant: "outline" as const,
  },
];

export default function Home() {
  const router = useRouter();
  const session = authClient.useSession();

  useEffect(() => {
    if (session.data?.user) {
      router.push("/dashboard");
    }
  }, [session.data, router]);

  return (
    <div className="min-h-screen bg-white text-zinc-900 antialiased">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-zinc-100 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-xl font-bold tracking-tight text-zinc-900">
            GovScout
          </span>
          <nav className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Start Free</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-6 pb-20 pt-24 text-center">
          <Badge
            variant="secondary"
            className="mb-6 px-3 py-1 text-sm font-medium"
          >
            The Stripe of Government Contracting
          </Badge>
          <h1 className="mx-auto max-w-3xl text-balance text-5xl font-bold leading-tight tracking-tight text-zinc-900 sm:text-6xl">
            Find government contracts your competitors miss
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-balance text-lg leading-relaxed text-zinc-500">
            AI-powered search across federal, state, and local procurement
            portals. GovWin charges $13,000/year. GovDash requires a sales call.
            We charge $49/month, and you start in 30 seconds.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/signup">
              <Button size="lg" className="h-12 px-8 text-base font-semibold">
                Start Free — No Card Required
              </Button>
            </Link>
            <a href="#pricing">
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 text-base font-semibold"
              >
                See Pricing
              </Button>
            </a>
          </div>
        </section>

        {/* Stats bar */}
        <section className="border-y border-zinc-100 bg-zinc-50 py-12">
          <div className="mx-auto max-w-4xl px-6">
            <div className="grid grid-cols-1 gap-8 text-center sm:grid-cols-3">
              {stats.map((stat, i) => (
                <div key={i}>
                  <div className="text-3xl font-bold text-zinc-900">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-sm text-zinc-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="mx-auto max-w-6xl px-6 py-24">
          <div className="mb-14 text-center">
            <h2 className="text-4xl font-bold tracking-tight text-zinc-900">
              Simple, honest pricing
            </h2>
            <p className="mt-3 text-zinc-500">
              No annual contracts. No sales calls. Cancel anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {pricingTiers.map((tier) => (
              <Card
                key={tier.name}
                className={`relative flex flex-col ${
                  tier.popular
                    ? "border-zinc-900 shadow-lg ring-1 ring-zinc-900"
                    : "border-zinc-200"
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3.5 left-0 right-0 flex justify-center">
                    <span className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-semibold text-white">
                      Most popular
                    </span>
                  </div>
                )}
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-semibold text-zinc-900">
                      {tier.name}
                    </CardTitle>
                    {tier.trialNote && (
                      <Badge variant="secondary" className="text-xs">
                        {tier.trialNote}
                      </Badge>
                    )}
                  </div>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-zinc-900">
                      {tier.price}
                    </span>
                    <span className="text-sm text-zinc-500">{tier.period}</span>
                  </div>
                  <p className="mt-1 text-sm text-zinc-500">
                    {tier.description}
                  </p>
                </CardHeader>
                <Separator />
                <CardContent className="flex flex-1 flex-col pt-6">
                  <ul className="flex-1 space-y-3">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2.5">
                        <Check
                          className="h-4 w-4 shrink-0 text-zinc-900"
                          strokeWidth={2.5}
                        />
                        <span className="text-sm text-zinc-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <Link href="/signup" className="block">
                      <Button
                        variant={tier.ctaVariant}
                        className="w-full"
                        size="lg"
                      >
                        {tier.cta}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-100 bg-zinc-50 py-10">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
            <div>
              <p className="font-semibold text-zinc-900">GovScout</p>
              <p className="mt-1 max-w-sm text-sm text-zinc-500">
                Government contracts, found by AI, priced for small business.
              </p>
            </div>
            <nav className="flex items-center gap-6 text-sm text-zinc-500">
              <a
                href="#pricing"
                className="hover:text-zinc-900 transition-colors"
              >
                Pricing
              </a>
              <Link
                href="/login"
                className="hover:text-zinc-900 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="hover:text-zinc-900 transition-colors"
              >
                Sign Up
              </Link>
            </nav>
          </div>
          <Separator className="my-6" />
          <p className="text-center text-xs text-zinc-400">
            &copy; {new Date().getFullYear()} GovScout. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
