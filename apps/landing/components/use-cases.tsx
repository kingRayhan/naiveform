"use client";

import { motion } from "motion/react";
import {
  ClipboardList,
  MessageSquare,
  UserPlus,
  Mail,
  Star,
  Users,
} from "lucide-react";

const useCases = [
  {
    icon: <ClipboardList className="h-6 w-6" />,
    title: "Surveys & polls",
    description: "Gather opinions and run quick polls with multiple choice, scales, and open-ended questions.",
  },
  {
    icon: <MessageSquare className="h-6 w-6" />,
    title: "Feedback & NPS",
    description: "Collect customer feedback, satisfaction scores, and net promoter responses.",
  },
  {
    icon: <UserPlus className="h-6 w-6" />,
    title: "Event registration",
    description: "Sign-ups, RSVPs, and waitlists with custom fields and confirmation messages.",
  },
  {
    icon: <Mail className="h-6 w-6" />,
    title: "Contact forms",
    description: "Simple contact or lead forms with email, message, and optional file-like flows.",
  },
  {
    icon: <Star className="h-6 w-6" />,
    title: "Quizzes & ratings",
    description: "Star ratings, linear scales, and yes/no questions for fun or serious assessments.",
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Lead capture",
    description: "Capture leads with custom slugs, redirects, and webhooks to your CRM or tools.",
  },
];

export function UseCases() {
  return (
    <section className="py-24 bg-white border-t border-slate-100">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
            Built for how you work.
          </h2>
          <p className="text-lg text-slate-500">
            One tool for surveys, feedback, registrations, and more.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {useCases.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              className="group flex gap-4 p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 hover:bg-slate-100/80 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 shrink-0 group-hover:text-slate-900 group-hover:border-slate-300 transition-colors">
                {item.icon}
              </div>
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  {item.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
