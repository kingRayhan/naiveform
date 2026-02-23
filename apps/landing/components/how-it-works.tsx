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
    description: "Add blocks with drag and drop. Mix questions and content—headings, images, video—to build the form you need.",
    cta: "Build your form",
  },
  {
    icon: <Share2 className="h-6 w-6" />,
    title: "Share",
    description: "Send a link or use a custom slug. Embed the form on your site with a single snippet.",
    cta: null,
  },
  {
    icon: <Inbox className="h-6 w-6" />,
    title: "Collect",
    description: "Responses arrive in real time. View them in the console, one response at a time or as a list.",
    cta: null,
  },
  {
    icon: <Download className="h-6 w-6" />,
    title: "Export & integrate",
    description: "Download CSV or send submissions to your app via webhooks and the API.",
    cta: null,
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-slate-50 border-t border-slate-100">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
            Simple from start to finish.
          </h2>
          <p className="text-lg text-slate-500">
            Four steps from idea to insights.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="relative"
            >
              {index < steps.length - 1 && (
                <div
                  className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-slate-200 -translate-y-1/2"
                  style={{ width: "calc(100% + 2rem)" }}
                />
              )}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-full flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-900 text-white text-sm font-bold">
                    {index + 1}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                    {step.icon}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed flex-1">
                  {step.description}
                </p>
                {step.cta && (
                  <Button asChild size="sm" className="mt-4 w-fit rounded-full">
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
