import type { FormBlock, InputBlock } from "@repo/types";
import { createEmptyInputBlock } from "@repo/types";

export interface FormTemplate {
  id: string;
  name: string;
  description: string;
  form: {
    title: string;
    description?: string;
    blocks: FormBlock[];
  };
}

/** Create an input block for templates. */
function b(
  id: string,
  type: InputBlock["type"],
  title: string,
  required: boolean,
  options?: string[]
): InputBlock {
  const block = createEmptyInputBlock(id, type);
  block.title = title;
  block.settings = { ...block.settings, required };
  if (options && (type === "radio" || type === "checkbox" || type === "dropdown")) {
    (block as InputBlock & { options: string[] }).options = options;
  }
  return block as InputBlock;
}

export const TEMPLATES: FormTemplate[] = [
  {
    id: "feedback",
    name: "Feedback",
    description: "Collect feedback or reviews from customers or users.",
    form: {
      title: "Feedback",
      description: "We'd love to hear from you.",
      blocks: [
        b("q1", "text", "Your name", false),
        b("q2", "dropdown", "How would you rate your experience?", true, ["Excellent", "Good", "Average", "Poor"]),
        b("q3", "long_text", "What did you like most?", false),
        b("q4", "long_text", "What could we improve?", false),
      ],
    },
  },
  {
    id: "event-registration",
    name: "Event registration",
    description: "Sign up for events, workshops, or webinars.",
    form: {
      title: "Event Registration",
      description: "Register for our upcoming event.",
      blocks: [
        b("q1", "text", "Full name", true),
        b("q2", "email", "Email", true),
        b("q3", "phone", "Phone number", false),
        b("q4", "dropdown", "Dietary requirements", false, ["None", "Vegetarian", "Vegan", "Gluten-free", "Other"]),
        b("q5", "long_text", "Any accessibility or special requirements?", false),
      ],
    },
  },
  {
    id: "quiz",
    name: "Quiz",
    description: "Multiple choice or short-answer quiz.",
    form: {
      title: "Quick Quiz",
      description: "Test your knowledge.",
      blocks: [
        b("q1", "radio", "What is the capital of France?", true, ["London", "Paris", "Berlin", "Madrid"]),
        b("q2", "radio", "Which planet is closest to the Sun?", true, ["Venus", "Mercury", "Mars", "Earth"]),
        b("q3", "text", "In one word, what is 2 + 2?", true),
      ],
    },
  },
  {
    id: "contact",
    name: "Contact us",
    description: "Simple contact form for inquiries.",
    form: {
      title: "Contact Us",
      description: "Send us a message and we'll get back to you.",
      blocks: [
        b("q1", "text", "Name", true),
        b("q2", "email", "Email", true),
        b("q3", "dropdown", "Subject", true, ["General inquiry", "Support", "Sales", "Partnership", "Other"]),
        b("q4", "long_text", "Message", true),
      ],
    },
  },
  {
    id: "job-application",
    name: "Job application",
    description: "Collect applications for open positions.",
    form: {
      title: "Job Application",
      description: "Apply for this position.",
      blocks: [
        b("q1", "text", "Full name", true),
        b("q2", "email", "Email", true),
        b("q3", "phone", "Phone", false),
        b("q4", "url", "LinkedIn or portfolio URL", false),
        b("q5", "dropdown", "Years of experience", true, ["0–1", "1–3", "3–5", "5–10", "10+"]),
        b("q6", "long_text", "Why do you want to join us?", true),
        b("q7", "long_text", "Paste or describe your relevant experience", true),
      ],
    },
  },
  {
    id: "order-request",
    name: "Order / request form",
    description: "Let users request a quote or place an order.",
    form: {
      title: "Order Request",
      description: "Submit your order details.",
      blocks: [
        b("q1", "text", "Company or name", true),
        b("q2", "email", "Email", true),
        b("q3", "text", "Product or service of interest", true),
        b("q4", "text", "Quantity or scope", false),
        b("q5", "date", "Preferred delivery or completion date", false),
        b("q6", "long_text", "Additional notes", false),
      ],
    },
  },
  {
    id: "rsvp",
    name: "RSVP",
    description: "Wedding or event RSVP with guest details.",
    form: {
      title: "RSVP",
      description: "Please let us know if you'll be joining us.",
      blocks: [
        b("q1", "text", "Your name(s)", true),
        b("q2", "radio", "Will you attend?", true, ["Yes, happily!", "No, I can't make it"]),
        b("q3", "text", "Number of guests", false),
        b("q4", "dropdown", "Meal preference", false, ["Chicken", "Fish", "Vegetarian", "Vegan", "Kids meal"]),
        b("q5", "long_text", "Dietary restrictions or comments", false),
      ],
    },
  },
  {
    id: "newsletter",
    name: "Newsletter signup",
    description: "Email signup with optional preferences.",
    form: {
      title: "Subscribe to our newsletter",
      description: "Get updates and exclusive content.",
      blocks: [
        b("q1", "email", "Email", true),
        b("q2", "text", "First name (optional)", false),
        b("q3", "checkbox", "Topics you're interested in", false, ["Product updates", "Tips & tutorials", "Events", "Offers"]),
      ],
    },
  },
  {
    id: "support-ticket",
    name: "Support ticket",
    description: "Customer support or help desk request.",
    form: {
      title: "Submit a support request",
      description: "We'll respond as soon as possible.",
      blocks: [
        b("q1", "text", "Name", true),
        b("q2", "email", "Email", true),
        b("q3", "dropdown", "Issue type", true, ["Technical", "Billing", "Account", "Other"]),
        b("q4", "text", "Subject", true),
        b("q5", "long_text", "Describe your issue", true),
      ],
    },
  },
  {
    id: "review",
    name: "Product or service review",
    description: "Collect ratings and written reviews.",
    form: {
      title: "Leave a review",
      description: "Your feedback helps others.",
      blocks: [
        b("q1", "dropdown", "Overall rating", true, ["5 – Excellent", "4", "3", "2", "1 – Poor"]),
        b("q2", "text", "Review title", true),
        b("q3", "long_text", "Your review", true),
        b("q4", "text", "Display name (optional)", false),
      ],
    },
  },
  {
    id: "workshop",
    name: "Workshop registration",
    description: "Register for a workshop or training.",
    form: {
      title: "Workshop Registration",
      description: "Sign up for the workshop.",
      blocks: [
        b("q1", "text", "Full name", true),
        b("q2", "email", "Email", true),
        b("q3", "radio", "Experience level", true, ["Beginner", "Intermediate", "Advanced"]),
        b("q4", "checkbox", "What do you want to learn?", false, ["Basics", "Best practices", "Advanced topics", "Hands-on projects"]),
        b("q5", "long_text", "Any specific questions or goals?", false),
      ],
    },
  },
  {
    id: "volunteer",
    name: "Volunteer signup",
    description: "Recruit volunteers for events or causes.",
    form: {
      title: "Volunteer Signup",
      description: "Join us as a volunteer.",
      blocks: [
        b("q1", "text", "Name", true),
        b("q2", "email", "Email", true),
        b("q3", "phone", "Phone", false),
        b("q4", "checkbox", "Areas of interest", false, ["Events", "Teaching", "Admin", "Outreach", "Other"]),
        b("q5", "dropdown", "Availability", false, ["Weekdays", "Weekends", "Both", "Flexible"]),
        b("q6", "long_text", "Why do you want to volunteer?", false),
      ],
    },
  },
  {
    id: "membership",
    name: "Membership application",
    description: "Apply for membership or subscription.",
    form: {
      title: "Membership Application",
      description: "Apply to become a member.",
      blocks: [
        b("q1", "text", "Full name", true),
        b("q2", "email", "Email", true),
        b("q3", "dropdown", "Membership type", true, ["Individual", "Family", "Student", "Corporate"]),
        b("q4", "long_text", "Tell us about yourself (optional)", false),
      ],
    },
  },
  {
    id: "booking",
    name: "Booking request",
    description: "Request a booking or appointment.",
    form: {
      title: "Booking Request",
      description: "Request a time slot or reservation.",
      blocks: [
        b("q1", "text", "Name", true),
        b("q2", "email", "Email", true),
        b("q3", "phone", "Phone", false),
        b("q4", "date", "Preferred date", true),
        b("q5", "dropdown", "Preferred time", false, ["Morning", "Afternoon", "Evening", "Any"]),
        b("q6", "long_text", "Additional details", false),
      ],
    },
  },
  {
    id: "bug-report",
    name: "Bug report",
    description: "Report bugs with steps to reproduce.",
    form: {
      title: "Bug Report",
      description: "Help us fix issues by reporting bugs.",
      blocks: [
        b("q1", "text", "Bug title", true),
        b("q2", "dropdown", "Severity", false, ["Critical", "High", "Medium", "Low"]),
        b("q3", "long_text", "Steps to reproduce", true),
        b("q4", "long_text", "Expected vs actual behavior", true),
        b("q5", "text", "Browser / device (optional)", false),
      ],
    },
  },
  {
    id: "suggestion",
    name: "Suggestion box",
    description: "Collect ideas and suggestions.",
    form: {
      title: "Suggestion Box",
      description: "We value your ideas.",
      blocks: [
        b("q1", "dropdown", "Category", false, ["Feature request", "Improvement", "Process", "Other"]),
        b("q2", "text", "Suggestion title", true),
        b("q3", "long_text", "Describe your suggestion", true),
      ],
    },
  },
  {
    id: "poll",
    name: "Poll / quick vote",
    description: "Single-question or multi-question poll.",
    form: {
      title: "Quick Poll",
      description: "Your opinion matters.",
      blocks: [
        b("q1", "radio", "What should we focus on next?", true, ["New features", "Performance", "Design", "Documentation"]),
        b("q2", "dropdown", "How often do you use our product?", false, ["Daily", "Weekly", "Monthly", "Rarely"]),
      ],
    },
  },
  {
    id: "pre-event",
    name: "Pre-event survey",
    description: "Survey before an event or session.",
    form: {
      title: "Pre-Event Survey",
      description: "Help us tailor the event for you.",
      blocks: [
        b("q1", "text", "Name", true),
        b("q2", "radio", "What's your main goal for this event?", true, ["Learn", "Network", "Get certified", "Other"]),
        b("q3", "checkbox", "Topics you're most interested in", false, ["Intro", "Advanced", "Case studies", "Q&A"]),
        b("q4", "long_text", "Questions you'd like answered", false),
      ],
    },
  },
  {
    id: "post-event",
    name: "Post-event survey",
    description: "Gather feedback after an event.",
    form: {
      title: "Post-Event Survey",
      description: "Thanks for attending. How was it?",
      blocks: [
        b("q1", "dropdown", "How would you rate the event?", true, ["5 – Excellent", "4", "3", "2", "1 – Poor"]),
        b("q2", "long_text", "What did you find most valuable?", false),
        b("q3", "long_text", "What could we improve?", false),
        b("q4", "checkbox", "Would you recommend this event?", false, ["Yes", "Maybe", "No"]),
      ],
    },
  },
  {
    id: "research-consent",
    name: "Research / study consent",
    description: "Consent and intake for research or studies.",
    form: {
      title: "Research Participation Consent",
      description: "Please read and confirm before participating.",
      blocks: [
        b("q1", "text", "Full name", true),
        b("q2", "email", "Email", true),
        b("q3", "date", "Date of birth (optional, for eligibility)", false),
        b("q4", "checkbox", "I have read and agree to the consent form", true, ["I agree"]),
        b("q5", "long_text", "Any questions before participating?", false),
      ],
    },
  },
];

export function getTemplateById(id: string): FormTemplate | undefined {
  return TEMPLATES.find((t) => t.id === id);
}

/** JSON string of all templates for export or API use */
export const TEMPLATES_JSON = JSON.stringify(
  TEMPLATES.map((t) => ({ id: t.id, name: t.name, description: t.description, form: t.form })),
  null,
  2
);
