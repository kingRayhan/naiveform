"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@repo/design-system/button";
import Link from "next/link";
import { useState } from "react";

const PLANS = [
  {
    name: "Hobby",
    description: "Perfect for personal projects and small experiments.",
    price: "$0",
    features: [
      "Unlimited forms",
      "500 submissions / month",
      "Basic analytics",
      "Email notifications",
      "Community support",
    ],
    variant: "outline" as const,
    featured: false,
  },
  {
    name: "Pro",
    description: "For creators and businesses who need more power.",
    price: "$10",
    features: [
      "Unlimited forms",
      "Unlimited submissions",
      "Remove NaiveForm branding",
      "Priority email support",
      "Export to CSV/Excel",
      "Custom redirect after submission",
    ],
    variant: "default" as const,
    featured: true,
  },
];

export const GrowthPlans = () => {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section
      id="pricing"
      className="py-24 bg-white font-dmSans text-black border-t border-zinc-100"
    >
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-semibold tracking-tight mb-4 text-balance">
          Simple, transparent pricing.
        </h2>
        <p className="text-neutral-500 mb-8 text-pretty max-w-2xl mx-auto">
          Start for free, upgrade when you need to scale. No hidden fees.
        </p>

        {/* Toggle */}
        <div className="flex items-center justify-center gap-4 mb-16">
          <span
            className={cn(
              "text-sm",
              !isYearly ? "text-slate-900 font-medium" : "text-slate-500",
            )}
          >
            Monthly
          </span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
          >
            <span
              className={cn(
                "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                isYearly ? "translate-x-6" : "translate-x-1",
              )}
            />
          </button>
          <span
            className={cn(
              "text-sm",
              isYearly ? "text-slate-900 font-medium" : "text-slate-500",
            )}
          >
            Yearly{" "}
            <span className="text-emerald-600 text-xs font-bold ml-1">
              (2 months free)
            </span>
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "rounded-3xl p-8 flex flex-col border transition-all text-left relative overflow-hidden",
                plan.featured
                  ? "bg-neutral-900 text-white shadow-xl ring-1 ring-neutral-900"
                  : "bg-white border-neutral-200 hover:border-neutral-300",
              )}
            >
              {plan.featured && (
                <div className="absolute top-0 right-0 bg-gradient-to-bl from-blue-500 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                  MOST POPULAR
                </div>
              )}

              <div className="mb-8">
                <h4 className="font-bold text-xl mb-2">{plan.name}</h4>
                <p
                  className={cn(
                    "text-sm leading-relaxed",
                    plan.featured ? "text-neutral-400" : "text-neutral-500",
                  )}
                >
                  {plan.description}
                </p>
              </div>

              <div className="flex items-baseline gap-1 mb-8">
                <span
                  className={cn(
                    "text-5xl font-bold tracking-tight",
                    plan.featured ? "text-white" : "text-neutral-900",
                  )}
                >
                  {plan.price === "$0" ? "$0" : isYearly ? "$8" : plan.price}
                </span>
                <span
                  className={cn(
                    "text-sm font-medium",
                    plan.featured ? "text-neutral-400" : "text-neutral-500",
                  )}
                >
                  /month
                </span>
                {isYearly && plan.price !== "$0" && (
                  <span className="ml-2 text-xs text-emerald-500 font-medium">
                    Billed ${parseInt(plan.price.replace("$", "")) * 10} yearly
                  </span>
                )}
              </div>

              <Button
                asChild
                className={cn(
                  "w-full mb-8 rounded-xl h-12 text-base font-medium transition-all",
                  plan.featured
                    ? "bg-white text-black hover:bg-neutral-100 border-0"
                    : "bg-white border border-neutral-200 text-neutral-900 hover:bg-neutral-50 shadow-sm",
                )}
              >
                <Link
                  href={
                    plan.price === "$0"
                      ? "http://localhost:5173/forms/new"
                      : "http://localhost:5173/settings/billing"
                  }
                >
                  {plan.price === "$0" ? "Get Started Free" : "Upgrade to Pro"}
                </Link>
              </Button>

              <div
                className={cn(
                  "space-y-4 pt-8 border-t flex-1",
                  plan.featured ? "border-neutral-800" : "border-neutral-100",
                )}
              >
                <p
                  className={cn(
                    "text-xs font-bold uppercase tracking-widest",
                    plan.featured ? "text-neutral-500" : "text-neutral-400",
                  )}
                >
                  What's included
                </p>
                {plan.features.map((f, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex items-start gap-3 text-sm",
                      plan.featured ? "text-neutral-300" : "text-neutral-600",
                    )}
                  >
                    <Check
                      className={cn(
                        "size-5 shrink-0",
                        plan.featured ? "text-blue-400" : "text-blue-600",
                      )}
                    />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-12 text-sm text-neutral-500">
          Need a custom plan for your enterprise?{" "}
          <a
            href="mailto:enterprise@naiveform.com"
            className="underline hover:text-black"
          >
            Contact us
          </a>
          .
        </p>
      </div>
    </section>
  );
};
