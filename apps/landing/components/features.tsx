"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";

const features = [
  {
    title: "Drag & drop builder",
    description:
      "Add and reorder blocks with a single drag. No coding—just point, click, and build.",
  },
  {
    title: "Rich field types",
    description:
      "Short text, long text, email, phone, URL, multiple choice, checkboxes, dropdown, date, star rating, linear scale, yes/no.",
  },
  {
    title: "Content blocks",
    description:
      "Mix in headings, paragraphs, images, YouTube embeds, and dividers to guide respondents.",
  },
  {
    title: "Real-time responses",
    description:
      "Submissions appear instantly. View and manage responses in one place.",
  },
  {
    title: "CSV export",
    description:
      "Download all responses as CSV for analysis in Excel, Sheets, or your tools.",
  },
  {
    title: "Webhooks & API",
    description:
      "Send submissions to your server via webhooks or submit programmatically with the API.",
  },
  {
    title: "Share & embed",
    description:
      "Share a link or custom slug. Embed forms in your site with a simple snippet.",
  },
  {
    title: "Form settings",
    description:
      "Limit one response per person, set a close date, confirmation message, or redirect URL.",
  },
  {
    title: "Three ways to collect",
    description:
      "Use our hosted form link, drop in headless HTML on your site, or submit programmatically via API.",
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

        <div className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.07 }}
              whileHover={{ backgroundColor: "#0f0f0f" }}
              className="bg-background p-7 transition-colors duration-150"
            >
              <div className="mb-4 text-orange-500">
                <Check className="h-4.5 w-4.5" />
              </div>
              <h3 className="mb-2 text-sm font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
