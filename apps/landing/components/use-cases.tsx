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
    description:
      "Gather opinions and run quick polls with multiple choice, scales, and open-ended questions.",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    icon: <MessageSquare className="h-6 w-6" />,
    title: "Feedback & NPS",
    description:
      "Collect customer feedback, satisfaction scores, and net promoter responses.",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  {
    icon: <UserPlus className="h-6 w-6" />,
    title: "Event registration",
    description:
      "Sign-ups, RSVPs, and waitlists with custom fields and confirmation messages.",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    icon: <Mail className="h-6 w-6" />,
    title: "Contact forms",
    description:
      "Simple contact or lead forms with email, message, and optional file-like flows.",
    color: "text-rose-600",
    bgColor: "bg-rose-50",
  },
  {
    icon: <Star className="h-6 w-6" />,
    title: "Quizzes & ratings",
    description:
      "Star ratings, linear scales, and yes/no questions for fun or serious assessments.",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Lead capture",
    description:
      "Capture leads with custom slugs, redirects, and webhooks to your CRM or tools.",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
  },
];

export function UseCases() {
  return (
    <section className="py-24 bg-background border-t border-border">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto mb-20">
          <div className="w-16 h-0.5 bg-orange-500 mb-8"></div>
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6 tracking-tight">
            Use cases
            <br />
            <span className="text-orange-400">that matter</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl">
            From simple surveys to complex data collection workflows.
          </p>
        </div>

        <div className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {useCases.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ backgroundColor: '#0f0f0f' }}
              className="bg-background p-7 transition-colors duration-150"
            >
              <div className="mb-4 text-orange-500">
                {item.icon}
              </div>
              <h3 className="mb-2 text-sm font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
