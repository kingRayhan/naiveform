"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "@repo/design-system/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-sm font-medium text-sky-800"
          >
            <Sparkles className="mr-2 h-3.5 w-3.5" />
            <span>Introducing NaiveForm 1.0</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1]"
          >
            Create{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary">
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
            responses instantly with a beautiful, branded interface.
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
              <Link href="http://localhost:5173/forms/new">
                Start Building Free <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-12 px-8 rounded-full text-base bg-white/50 backdrop-blur-sm hover:bg-white/80"
              asChild
            >
              <Link href="#features">View Features</Link>
            </Button>
          </motion.div>
        </div>

        {/* Mockup Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-20 relative mx-auto max-w-5xl"
        >
          <div className="rounded-2xl border border-slate-200 bg-white/50 backdrop-blur-xl p-2 shadow-2xl">
            <div className="rounded-xl bg-slate-50 border border-slate-100 overflow-hidden aspect-[16/9] relative group">
              <div className="absolute inset-0 flex items-center justify-center bg-slate-100/50">
                <span className="text-slate-400 font-medium">
                  ✨ Product Mockup Here (Form Builder Interface)
                </span>
              </div>
            </div>
          </div>
          {/* Decorative blurs */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl -z-10 animate-pulse" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-100/50 rounded-full blur-3xl -z-10 animate-pulse delay-700" />
        </motion.div>
      </div>

      {/* Background Grid Pattern */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]"></div>
      </div>
    </section>
  );
}
