"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { CONSOLE_APP_NEW_FORM_URL } from "@/lib/config";
import { Button } from "@repo/design-system/button";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden bg-background">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center rounded-lg border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm font-mono uppercase tracking-wider text-orange-400"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            <span>FREE FOREVER · NO CREDIT CARD</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.1]"
          >
            The Next Generation
            <br />
            <span className="text-orange-400">Form Builder</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Drag-and-drop form builder reimagined. Create, share, and collect
            responses with a modern interface built for developers and creators.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-muted-foreground text-sm max-w-2xl mx-auto"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-lg border border-border">
              <CheckCircle2 className="h-4 w-4 text-orange-400 shrink-0" />
              <span className="font-medium">Unlimited forms & responses</span>
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-lg border border-border">
              <CheckCircle2 className="h-4 w-4 text-orange-400 shrink-0" />
              <span className="font-medium">CSV export & webhooks</span>
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-lg border border-border">
              <CheckCircle2 className="h-4 w-4 text-orange-400 shrink-0" />
              <span className="font-medium">API & embed support</span>
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6"
          >
            <Button
              size="lg"
              className="h-12 px-8 rounded-lg text-base bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
              asChild
            >
              <Link href={CONSOLE_APP_NEW_FORM_URL}>
                Start building <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-12 px-8 rounded-lg text-base border-border hover:bg-secondary text-foreground"
              asChild
            >
              <Link href="#features">View features →</Link>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Dark Background Elements */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-500/5 via-transparent to-transparent"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500/20 to-transparent"></div>
      </div>
    </section>
  );
}
