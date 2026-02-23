"use client";

import { motion } from "motion/react";
import {
  MousePointer2,
  Zap,
  Share2,
  FileSpreadsheet,
  Webhook,
  Calendar,
  Image,
  ListChecks,
  LayoutGrid,
} from "lucide-react";

const features = [
  {
    icon: <LayoutGrid className="h-6 w-6 text-slate-700" />,
    title: "Three ways to collect",
    description:
      "Use our hosted form link, drop in headless HTML on your site, or submit programmatically via API.",
  },
  {
    icon: <MousePointer2 className="h-6 w-6 text-slate-700" />,
    title: "Drag & drop builder",
    description:
      "Add and reorder blocks with a single drag. No coding—just point, click, and build.",
  },
  {
    icon: <ListChecks className="h-6 w-6 text-slate-700" />,
    title: "Rich field types",
    description:
      "Short text, long text, email, phone, URL, multiple choice, checkboxes, dropdown, date, star rating, linear scale, yes/no.",
  },
  {
    icon: <Image className="h-6 w-6 text-slate-700" />,
    title: "Content blocks",
    description:
      "Mix in headings, paragraphs, images, YouTube embeds, and dividers to guide respondents.",
  },
  {
    icon: <Zap className="h-6 w-6 text-slate-700" />,
    title: "Real-time responses",
    description:
      "Submissions appear instantly. View and manage responses in one place.",
  },
  {
    icon: <FileSpreadsheet className="h-6 w-6 text-slate-700" />,
    title: "CSV export",
    description:
      "Download all responses as CSV for analysis in Excel, Sheets, or your tools.",
  },
  {
    icon: <Webhook className="h-6 w-6 text-slate-700" />,
    title: "Webhooks & API",
    description:
      "Send submissions to your server via webhooks or submit programmatically with the API.",
  },
  {
    icon: <Share2 className="h-6 w-6 text-slate-700" />,
    title: "Share & embed",
    description:
      "Share a link or custom slug. Embed forms in your site with a simple snippet.",
  },
  {
    icon: <Calendar className="h-6 w-6 text-slate-700" />,
    title: "Form settings",
    description:
      "Limit one response per person, set a close date, confirmation message, or redirect URL.",
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="py-24 bg-slate-50 relative overflow-hidden"
    >
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
            Everything you need to collect responses.
          </h2>
          <p className="text-lg text-slate-500">
            A full-featured form builder without the complexity.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-slate-200 transition-all"
            >
              <div className="w-11 h-11 bg-slate-100 rounded-xl flex items-center justify-center mb-4 text-slate-600">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
