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
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: <MousePointer2 className="h-6 w-6 text-slate-700" />,
    title: "Drag & drop builder",
    description:
      "Add and reorder blocks with a single drag. No coding—just point, click, and build.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: <ListChecks className="h-6 w-6 text-slate-700" />,
    title: "Rich field types",
    description:
      "Short text, long text, email, phone, URL, multiple choice, checkboxes, dropdown, date, star rating, linear scale, yes/no.",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: <Image className="h-6 w-6 text-slate-700" />,
    title: "Content blocks",
    description:
      "Mix in headings, paragraphs, images, YouTube embeds, and dividers to guide respondents.",
    gradient: "from-orange-500 to-red-500",
  },
  {
    icon: <Zap className="h-6 w-6 text-slate-700" />,
    title: "Real-time responses",
    description:
      "Submissions appear instantly. View and manage responses in one place.",
    gradient: "from-yellow-500 to-amber-500",
  },
  {
    icon: <FileSpreadsheet className="h-6 w-6 text-slate-700" />,
    title: "CSV export",
    description:
      "Download all responses as CSV for analysis in Excel, Sheets, or your tools.",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: <Webhook className="h-6 w-6 text-slate-700" />,
    title: "Webhooks & API",
    description:
      "Send submissions to your server via webhooks or submit programmatically with the API.",
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    icon: <Share2 className="h-6 w-6 text-slate-700" />,
    title: "Share & embed",
    description:
      "Share a link or custom slug. Embed forms in your site with a simple snippet.",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    icon: <Calendar className="h-6 w-6 text-slate-700" />,
    title: "Form settings",
    description:
      "Limit one response per person, set a close date, confirmation message, or redirect URL.",
    gradient: "from-violet-500 to-fuchsia-500",
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="py-24 bg-background relative overflow-hidden border-t border-border"
    >
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto mb-20">
          <div className="w-16 h-0.5 bg-orange-500 mb-8"></div>
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6 tracking-tight">
            Powerful features
            <br />
            <span className="text-orange-400">built for developers</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Everything you need to create, deploy, and manage forms at scale.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.07 }}
              whileHover={{ y: -8 }}
              className="group bg-card p-6 rounded-xl border border-border hover:border-orange-500/30 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-10 h-10 bg-gradient-to-br ${feature.gradient} rounded-lg flex items-center justify-center text-white flex-shrink-0`}
                >
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-orange-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
