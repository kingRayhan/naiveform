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
      className="py-24 bg-white border-t border-slate-100"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
            Everything included. Free.
          </h2>
          <p className="text-lg text-slate-500">
            No tiers, no limits, no credit card. Start building and keep using it.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto bg-slate-50 rounded-3xl border border-slate-200 p-8 md:p-10"
        >
          <ul className="grid sm:grid-cols-2 gap-3 md:gap-4">
            {included.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-slate-700 text-sm md:text-base"
              >
                <Check className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10 pt-8 border-t border-slate-200 text-center">
            <Button
              size="lg"
              className="rounded-full px-8 h-12"
              asChild
            >
              <Link href={CONSOLE_APP_NEW_FORM_URL}>
                Get started — it&apos;s free
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
