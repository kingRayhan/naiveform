"use client";

import Link from "next/link";
import { CONSOLE_APP_NEW_FORM_URL } from "@/lib/config";
import { Button } from "@repo/design-system/button";

export function CtaSection() {
  return (
    <section className="py-24 bg-background border-t border-border">
      <div className="container mx-auto px-4 md:px-6">
        <div className="bg-card border border-border rounded-xl p-12 md:p-20 text-center relative overflow-hidden">
          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-6xl font-bold text-foreground tracking-tight">
              Start building
              <br />
              <span className="text-orange-400">free forever.</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              No credit card. No limits. Create your first form in minutes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button
                size="lg"
                className="h-14 px-8 rounded-lg text-lg bg-primary hover:bg-primary/90 text-primary-foreground"
                asChild
              >
                <Link href={CONSOLE_APP_NEW_FORM_URL}>Get started →</Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              FREE FOREVER · NO CREDIT CARD REQUIRED
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
