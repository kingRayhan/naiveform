"use client";

import { motion } from "motion/react";
import { Copy, LayoutTemplate, MousePointer2, Zap } from "lucide-react";

const features = [
  {
    icon: <MousePointer2 className="h-6 w-6 text-blue-600" />,
    title: "Drag & Drop Builder",
    description:
      "Build complex forms in minutes with our intuitive drag-and-drop interface. No coding required.",
  },
  {
    icon: <Zap className="h-6 w-6 text-indigo-600" />,
    title: "Instant Responses",
    description:
      "Receive submissions in real-time. Analyze data instantly with built-in charts and summaries.",
  },
  {
    icon: <LayoutTemplate className="h-6 w-6 text-purple-600" />,
    title: "Beautiful Templates",
    description:
      "Start with professionally designed templates for surveys, feedback, registrations, and more.",
  },
  {
    icon: <Copy className="h-6 w-6 text-pink-600" />,
    title: "Easy Sharing",
    description:
      "Share your form via link, email, or embed it directly into your website with a simple copy-paste.",
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
            Everything you need to <br /> gather data.
          </h2>
          <p className="text-lg text-slate-500">
            Powerful features packaged in a simple, elegant interface.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-500 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
