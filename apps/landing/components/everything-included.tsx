"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";
import Link from "next/link";
import { CONSOLE_APP_NEW_FORM_URL } from "@/lib/config";
import { Button } from "@repo/design-system/button";

const included = [
  "Unlimited forms",
  "Unlimited responses",
  "Drag-and-drop builder",
  "All field types (text, choice, date, rating, scale, yes/no)",
  "Content blocks (heading, paragraph, image, YouTube, divider)",
  "Real-time response list",
  "CSV export",
  "Webhooks",
  "Submit via API",
  "Custom slug",
  "Confirmation message & redirect URL",
  "Limit one response per person",
  "Close date",
  "Embed on your site",
];

export function EverythingIncluded() {
  return (
    <section
      id="included"
      className="py-24 bg-background border-t border-border"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto mb-20">
          <div className="w-16 h-0.5 bg-orange-500 mb-8"></div>
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6 tracking-tight">
            Everything included.
            <br />
            <span className="text-orange-400">Absolutely free.</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl">
            No tiers, no limits, no credit card. Just pure form building power.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto bg-card rounded-xl border border-border p-8 md:p-10"
        >
          <ul className="grid sm:grid-cols-2 gap-4">
            {included.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-foreground text-sm md:text-base"
              >
                <Check className="h-5 w-5 text-orange-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10 pt-8 border-t border-border text-center">
            <Button
              size="lg"
              className="rounded-lg px-8 h-12 bg-primary hover:bg-primary/90 text-primary-foreground"
              asChild
            >
              <Link href={CONSOLE_APP_NEW_FORM_URL}>Get started →</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
