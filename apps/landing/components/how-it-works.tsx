"use client";

import { motion } from "motion/react";
import { PenLine, Share2, Inbox, Download } from "lucide-react";
import Link from "next/link";
import { CONSOLE_APP_NEW_FORM_URL } from "@/lib/config";
import { Button } from "@repo/design-system/button";

const steps = [
  {
    icon: <PenLine className="h-6 w-6" />,
    title: "Create",
    description:
      "Add blocks with drag and drop. Mix questions and content—headings, images, video—to build the form you need.",
    cta: "Build your form",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: <Share2 className="h-6 w-6" />,
    title: "Share",
    description:
      "Send a link or use a custom slug. Embed the form on your site with a single snippet.",
    cta: null,
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: <Inbox className="h-6 w-6" />,
    title: "Collect",
    description:
      "Responses arrive in real time. View them in the console, one response at a time or as a list.",
    cta: null,
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: <Download className="h-6 w-6" />,
    title: "Export & integrate",
    description:
      "Download CSV or send submissions to your app via webhooks and the API.",
    cta: null,
    color: "from-amber-500 to-orange-500",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-background border-t border-border">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto mb-20">
          <div className="w-16 h-0.5 bg-orange-500 mb-8"></div>
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6 tracking-tight">
            How it works
            <br />
            <span className="text-orange-400">in 4 simple steps</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl">
            From concept to deployment in minutes, not hours.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto relative">
          {/* Connecting Lines */}
          <div className="hidden lg:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-border via-orange-500/20 to-border z-0">
            <div className="absolute top-0 left-1/4 w-1/2 h-full bg-gradient-to-r from-transparent via-orange-500/40 to-transparent"></div>
          </div>

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.12 }}
              whileHover={{ y: -8 }}
              className="relative z-10"
            >
              <div className="bg-card p-6 rounded-xl border border-border h-full flex flex-col hover:border-orange-500/30 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className={`flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br ${step.color} text-white text-sm font-bold`}
                  >
                    {index + 1}
                  </span>
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground group-hover:bg-secondary/80 transition-colors">
                    {step.icon}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-orange-400 transition-colors">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                  {step.description}
                </p>
                {step.cta && (
                  <Button
                    asChild
                    size="sm"
                    className="mt-4 w-fit rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300"
                  >
                    <Link href={CONSOLE_APP_NEW_FORM_URL}>{step.cta}</Link>
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
