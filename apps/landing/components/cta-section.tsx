"use client";

import Link from "next/link";
import { CONSOLE_APP_NEW_FORM_URL } from "@/lib/config";
import { Button } from "@repo/design-system/button";

export function CtaSection() {
  return (
    <section className="py-24 bg-white border-t border-slate-100">
      <div className="container mx-auto px-4 md:px-6">
        <div className="bg-slate-900 rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
              Ready to build better forms?
            </h2>
            <p className="text-xl text-slate-300">
              Join thousands of creators who are already using NaiveForm to
              gather insights.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button
                size="lg"
                className="h-14 px-8 rounded-full text-lg bg-white text-slate-900 hover:bg-slate-100"
                asChild
              >
                <Link href={CONSOLE_APP_NEW_FORM_URL}>
                  Get Started for Free
                </Link>
              </Button>
            </div>
            <p className="text-sm text-slate-400">
              No credit card required · Free plan available
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
