"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

const US_STATES = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
  "DC",
];

const CERTIFICATIONS = [
  {
    id: "8a",
    label: "8(a) Business Development",
    description: "SBA-certified socially/economically disadvantaged",
  },
  {
    id: "hubzone",
    label: "HUBZone",
    description: "Historically Underutilized Business Zone",
  },
  {
    id: "sdvosb",
    label: "SDVOSB",
    description: "Service-Disabled Veteran-Owned Small Business",
  },
  {
    id: "wosb",
    label: "WOSB",
    description: "Women-Owned Small Business",
  },
];

const TOTAL_STEPS = 3;

export default function OnboardingPage() {
  const router = useRouter();
  const upsertProfile = useMutation(api.userProfiles.upsertProfile);
  const completeOnboarding = useMutation(api.userProfiles.completeOnboarding);

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1 state
  const [companyName, setCompanyName] = useState("");
  const [selectedStates, setSelectedStates] = useState<string[]>([]);

  // Step 2 state
  const [naicsInput, setNaicsInput] = useState("");
  const [keywordsInput, setKeywordsInput] = useState("");

  // Step 3 state
  const [selectedCerts, setSelectedCerts] = useState<string[]>([]);
  const [noneSelected, setNoneSelected] = useState(false);

  function toggleState(state: string) {
    setSelectedStates((prev) =>
      prev.includes(state) ? prev.filter((s) => s !== state) : [...prev, state],
    );
  }

  function toggleCert(certId: string) {
    setNoneSelected(false);
    setSelectedCerts((prev) =>
      prev.includes(certId)
        ? prev.filter((c) => c !== certId)
        : [...prev, certId],
    );
  }

  function toggleNone(checked: boolean) {
    if (checked) {
      setSelectedCerts([]);
      setNoneSelected(true);
    } else {
      setNoneSelected(false);
    }
  }

  async function handleFinish() {
    setIsSubmitting(true);
    try {
      const naicsCodes = naicsInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const keywords = keywordsInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      await upsertProfile({
        companyName: companyName.trim() || undefined,
        naicsCodes,
        certifications: selectedCerts,
        states: selectedStates,
        keywords,
      });

      await completeOnboarding();
      router.push("/dashboard");
    } catch (err) {
      console.error("Onboarding error:", err);
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12">
      <div className="w-full max-w-2xl space-y-6">
        {/* Progress indicator */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Step {step} of {TOTAL_STEPS}
            </span>
            <span>
              {step === 1 && "Company & Location"}
              {step === 2 && "NAICS Codes & Keywords"}
              {step === 3 && "Certifications"}
            </span>
          </div>
          <div className="flex gap-2">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => (
              <div
                key={i}
                className={cn(
                  "h-2 flex-1 rounded-full transition-colors",
                  i + 1 <= step ? "bg-primary" : "bg-muted",
                )}
              />
            ))}
          </div>
        </div>

        {/* Step 1: Company name + State selection */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">
                Tell us about your business
              </CardTitle>
              <CardDescription>
                We&apos;ll use this to find the most relevant government
                contracts for you.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="company-name">Company Name</Label>
                <Input
                  id="company-name"
                  placeholder="Acme Federal Solutions LLC"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>

              <div className="space-y-3">
                <div>
                  <Label>States of Interest</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Select the states where you want to find contracts. Select
                    none to search nationwide.
                  </p>
                </div>
                <div className="h-56 overflow-y-auto rounded-lg border p-3">
                  <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-8 md:grid-cols-10">
                    {US_STATES.map((state) => (
                      <button
                        key={state}
                        type="button"
                        onClick={() => toggleState(state)}
                        className={cn(
                          "rounded px-2 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          selectedStates.includes(state)
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground",
                        )}
                      >
                        {state}
                      </button>
                    ))}
                  </div>
                </div>
                {selectedStates.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {selectedStates.length} state
                    {selectedStates.length !== 1 ? "s" : ""} selected
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: NAICS codes + Keywords */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Scope your search</CardTitle>
              <CardDescription>
                Add NAICS codes and keywords to surface the right opportunities.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="naics-codes">NAICS Codes</Label>
                <Input
                  id="naics-codes"
                  placeholder="541512, 541519"
                  value={naicsInput}
                  onChange={(e) => setNaicsInput(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Enter comma-separated NAICS codes (e.g., 541512, 541519)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="keywords">Keywords</Label>
                <Input
                  id="keywords"
                  placeholder="cybersecurity, cloud migration, DevSecOps"
                  value={keywordsInput}
                  onChange={(e) => setKeywordsInput(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Enter comma-separated keywords relevant to your work
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Certifications */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Business certifications</CardTitle>
              <CardDescription>
                Select any small business certifications your company holds.
                These unlock set-aside opportunities.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {CERTIFICATIONS.map((cert) => (
                <div
                  key={cert.id}
                  className={cn(
                    "flex items-start gap-3 rounded-lg border p-4 transition-colors cursor-pointer",
                    selectedCerts.includes(cert.id)
                      ? "border-primary bg-primary/5"
                      : "hover:bg-muted/50",
                  )}
                  onClick={() => toggleCert(cert.id)}
                >
                  <Checkbox
                    id={cert.id}
                    checked={selectedCerts.includes(cert.id)}
                    onCheckedChange={() => toggleCert(cert.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="mt-0.5"
                  />
                  <div className="space-y-0.5">
                    <Label
                      htmlFor={cert.id}
                      className="font-semibold cursor-pointer"
                    >
                      {cert.label}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {cert.description}
                    </p>
                  </div>
                </div>
              ))}

              {/* None / Not sure option */}
              <div
                className={cn(
                  "flex items-start gap-3 rounded-lg border p-4 transition-colors cursor-pointer",
                  noneSelected
                    ? "border-primary bg-primary/5"
                    : "hover:bg-muted/50",
                )}
                onClick={() => toggleNone(!noneSelected)}
              >
                <Checkbox
                  id="none"
                  checked={noneSelected}
                  onCheckedChange={(checked) => toggleNone(!!checked)}
                  onClick={(e) => e.stopPropagation()}
                  className="mt-0.5"
                />
                <div className="space-y-0.5">
                  <Label
                    htmlFor="none"
                    className="font-semibold cursor-pointer"
                  >
                    None / Not sure
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    I don&apos;t hold any certifications or I&apos;m not sure
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between">
          {step > 1 ? (
            <Button
              variant="outline"
              onClick={() => setStep((s) => s - 1)}
              disabled={isSubmitting}
            >
              Back
            </Button>
          ) : (
            <div />
          )}

          {step < TOTAL_STEPS ? (
            <Button onClick={() => setStep((s) => s + 1)}>Continue</Button>
          ) : (
            <Button onClick={handleFinish} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Start Finding Contracts"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
