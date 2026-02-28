"use client";

import { motion } from "motion/react";
import { MousePointer2, Globe, Zap, Database } from "lucide-react";
import { Fragment } from "react";

const steps = [
  {
    icon: <MousePointer2 className="h-5 w-5" />,
    title: "Build",
    description:
      "Drag and drop blocks to create your form visually. No coding required.",
  },
  {
    icon: <Globe className="h-5 w-5" />,
    title: "Deploy",
    description:
      "Share via link, embed in your site, or integrate with your systems.",
  },
  {
    icon: <Zap className="h-5 w-5" />,
    title: "Collect",
    description:
      "Real-time responses with instant notifications and organized data.",
  },
  {
    icon: <Database className="h-5 w-5" />,
    title: "Analyze",
    description:
      "Export to CSV, connect webhooks, or access via API for deeper insights.",
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

        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
            {steps.map((step, index) => (
              <Fragment key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex-1"
                >
                  <div className="bg-card border border-border rounded-xl p-6 text-center hover:border-orange-500/30 transition-all duration-300">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-500/10 text-orange-500 mx-auto mb-4">
                      <span className="text-lg font-bold">{index + 1}</span>
                    </div>
                    <div className="text-orange-500 mb-3 flex justify-center">
                      {step.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>

                {/* Arrow connector (except for last item) */}
                {index < steps.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
                    className="hidden md:flex items-center justify-center flex-shrink-0"
                  >
                    <div className="w-8 h-8 flex items-center justify-center">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-orange-500/50"
                      >
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    </div>
                  </motion.div>
                )}
              </Fragment>
            ))}
          </div>

          {/* Mobile arrows */}
          <div className="md:hidden mt-6 space-y-4">
            {steps.slice(0, -1).map((_, index) => (
              <div key={index} className="flex justify-center">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-orange-500/50 rotate-90"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
