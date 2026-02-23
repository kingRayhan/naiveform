"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { CONSOLE_APP_NEW_FORM_URL } from "@/lib/config";
import { Button } from "@repo/design-system/button";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-800"
          >
            <Sparkles className="mr-2 h-3.5 w-3.5" />
            <span>Free forever · No credit card required</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1]"
          >
            Create{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-600">
              beautiful forms
            </span>{" "}
            <br className="hidden md:block" />
            in minutes.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed"
          >
            The modern alternative to Google Forms. Drag, drop, and gather
            responses instantly with a clean, intuitive interface.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-slate-600 text-sm"
          >
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              Unlimited forms & responses
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              CSV export & webhooks
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              API & embed support
            </span>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.27 }}
            className="text-slate-500 text-sm md:text-base"
          >
            Collect responses three ways:{" "}
            <span className="font-medium text-slate-700">hosted form link</span>
            ,{" "}
            <span className="font-medium text-slate-700">headless HTML</span>, or{" "}
            <span className="font-medium text-slate-700">API</span>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center justify-center gap-4"
          >
            <Button
              size="lg"
              className="h-12 px-8 rounded-full text-base shadow-xl bg-primary"
              asChild
            >
              <Link href={CONSOLE_APP_NEW_FORM_URL}>
                Start building free <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-12 px-8 rounded-full text-base bg-white/50 backdrop-blur-sm hover:bg-white/80"
              asChild
            >
              <Link href="#features">See features</Link>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Background Grid Pattern */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#e0f2fe,transparent)]" />
      </div>
    </section>
  );
}
