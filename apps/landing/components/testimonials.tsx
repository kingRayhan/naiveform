"use client";

import { motion } from "motion/react";
import { Quote, Star, Users, TrendingUp, Award } from "lucide-react";

const stats = [
  {
    icon: <Users className="h-6 w-6" />,
    value: "10K+",
    label: "Forms created",
  },
  {
    icon: <TrendingUp className="h-6 w-6" />,
    value: "1M+",
    label: "Responses collected",
  },
  {
    icon: <Award className="h-6 w-6" />,
    value: "4.9",
    label: "User rating",
    suffix: "/5",
  },
];

const testimonials = [
  {
    quote:
      "NaiveForm helped us collect 500+ survey responses in just 3 days. The drag-and-drop interface is incredibly intuitive.",
    author: "Sarah Chen",
    role: "Product Manager at TechCorp",
    avatar: "SC",
  },
  {
    quote:
      "Finally, a Google Forms alternative that doesn't look generic. Our customers love the clean, professional forms we create.",
    author: "Michael Rodriguez",
    role: "Marketing Director",
    avatar: "MR",
  },
  {
    quote:
      "The webhook integration saved us hours of manual data entry. Responses flow directly to our CRM seamlessly.",
    author: "Priya Sharma",
    role: "Startup Founder",
    avatar: "PS",
  },
];

export function Testimonials() {
  return (
    <section
      className="py-24 bg-background border-t border-border"
      id="testimonials"
    >
      <div className="container mx-auto px-4 md:px-6">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="text-center p-6 bg-card rounded-xl border border-border hover:border-orange-500/30 transition-all duration-300"
            >
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-secondary rounded-lg text-muted-foreground">
                  {stat.icon}
                </div>
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">
                {stat.value}
                {stat.suffix && (
                  <span className="text-lg text-muted-foreground">
                    {stat.suffix}
                  </span>
                )}
              </div>
              <div className="text-muted-foreground font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Testimonials Section */}
        <div className="max-w-4xl mx-auto">
          <div className="max-w-4xl mx-auto mb-20">
            <div className="w-16 h-0.5 bg-orange-500 mb-8"></div>
            <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6 tracking-tight">
              Loved by creators
              <br />
              <span className="text-orange-400">worldwide</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Join thousands of teams who trust NaiveForm for their form needs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.15 }}
                className="bg-card p-6 rounded-xl border border-border hover:border-orange-500/30 transition-all duration-300"
              >
                <Quote className="h-6 w-6 text-muted-foreground mb-4" />
                <p className="text-foreground mb-6 leading-relaxed">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-600 to-orange-800 flex items-center justify-center text-white font-medium text-sm">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-foreground">
                      {testimonial.author}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
                <div className="flex mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 text-orange-400 fill-current"
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
