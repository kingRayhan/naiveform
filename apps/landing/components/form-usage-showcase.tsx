"use client";

import { motion } from "motion/react";
import { useState } from "react";
import {
  Link,
  Code,
  Globe,
  Terminal,
  Copy,
  Check,
  ExternalLink,
  ArrowRight,
} from "lucide-react";

const usageMethods = [
  {
    id: "hosted",
    title: "Hosted Form Link",
    icon: <Link className="h-6 w-6" />,
    description: "Share a direct link to your form",
    features: [
      "Instant form hosting",
      "Custom slugs available",
      "Mobile responsive",
      "Built-in analytics",
    ],
    example: "https://f.naiveform.com/contact-us",
    code: "",
    preview: {
      title: "Contact Us Form",
      fields: ["Name", "Email", "Message"],
      buttonText: "Submit",
    },
  },
  {
    id: "headless",
    title: "HTML Headless Embed",
    icon: <Code className="h-6 w-6" />,
    description: "Drop into your existing website",
    features: [
      "Zero styling conflicts",
      "Full customization",
      "Lightweight integration",
      "Your branding preserved",
    ],
    example: '<form action="https://api.naiveform.com/html-action/form_123">',
    code: `<form action="https://api.naiveform.com/html-action/form_123" method="POST">
  <label for="name">Name</label>
  <input type="text" id="name" name="name" required>
  
  <label for="email">Email</label>
  <input type="email" id="email" name="email" required>
  
  <label for="message">Message</label>
  <textarea id="message" name="message"></textarea>
  
  <button type="submit">Submit</button>
</form>`,
    preview: {
      title: "Embedded Contact Form",
      fields: ["Name", "Email", "Message"],
      buttonText: "Send Message",
    },
  },
  {
    id: "api",
    title: "API Integration",
    icon: <Terminal className="h-6 w-6" />,
    description: "Programmatic form submissions",
    features: [
      "Full programmatic control",
      "Custom validation",
      "Batch submissions",
      "Integration with any system",
    ],
    example: "curl -X POST https://api.naiveform.com/form-submission/form_123",
    code: `curl --request POST \\
  --url https://api.naiveform.com/form-submission/form_123 \\
  --header 'content-type: application/json' \\
  --data '{
    "values": {
      "name": "John Doe",
      "email": "john@example.com",
      "message": "Hello from API!"
    }
  }'`,
    preview: {
      title: "API Submission Example",
      fields: ["name", "email", "message"],
      buttonText: "API Call",
    },
  },
];

export function FormUsageShowcase() {
  const [activeMethod, setActiveMethod] = useState("hosted");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const currentMethod = usageMethods.find(
    (method) => method.id === activeMethod
  )!;

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <section className="py-24 bg-background relative overflow-hidden border-t border-border">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto mb-20 text-center">
          <div className="w-16 h-0.5 bg-orange-500 mx-auto mb-8"></div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
            Three ways to collect responses
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Flexible deployment options for every use case
          </p>
        </div>

        <div className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto mb-12">
          {usageMethods.map((method, index) => (
            <motion.button
              key={method.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{
                backgroundColor:
                  activeMethod === method.id ? "#0f0f0f" : "#121212",
              }}
              onClick={() => setActiveMethod(method.id)}
              className={`bg-background p-7 transition-all duration-200 text-left relative overflow-hidden ${
                activeMethod === method.id
                  ? "bg-[#0f0f0f] ring-2 ring-orange-500/30"
                  : ""
              }`}
            >
              {/* Active indicator */}
              {activeMethod === method.id && (
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-orange-500"></div>
              )}

              <div
                className={`mb-4 ${activeMethod === method.id ? "text-orange-400" : "text-orange-500"}`}
              >
                {method.icon}
              </div>
              <h3
                className={`mb-2 text-sm font-semibold ${
                  activeMethod === method.id
                    ? "text-foreground"
                    : "text-foreground"
                }`}
              >
                {method.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {method.description}
              </p>

              {/* Active border glow */}
              {activeMethod === method.id && (
                <div className="absolute inset-0 rounded-lg shadow-[0_0_0_1px_rgba(255,107,53,0.3)] pointer-events-none"></div>
              )}
            </motion.button>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Code Example */}
          <motion.div
            key={currentMethod.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-card border border-border rounded-xl overflow-hidden"
          >
            <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
              <h3 className="font-medium text-foreground flex items-center gap-2">
                {currentMethod.icon}
                {currentMethod.title}
              </h3>
              <button
                onClick={() =>
                  copyToClipboard(
                    currentMethod.code || currentMethod.example,
                    currentMethod.id
                  )
                }
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {copiedId === currentMethod.id ? (
                  <>
                    <Check className="h-4 w-4 text-green-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </button>
            </div>

            <div className="p-6">
              {currentMethod.id === "hosted" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Share this link:
                    </label>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 px-3 py-2 bg-muted rounded-md text-sm font-mono text-foreground border border-border">
                        {currentMethod.example}
                      </code>
                      <button
                        onClick={() =>
                          copyToClipboard(currentMethod.example, "link")
                        }
                        className="p-2 rounded-md hover:bg-muted transition-colors"
                      >
                        {copiedId === "link" ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <h4 className="font-medium text-foreground mb-3">
                      Key Features:
                    </h4>
                    <ul className="space-y-2">
                      {currentMethod.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                          <span className="text-muted-foreground text-sm">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {currentMethod.id === "headless" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      HTML Snippet:
                    </label>
                    <pre className="p-4 bg-muted rounded-lg overflow-x-auto text-sm">
                      <code className="text-foreground font-mono">
                        {currentMethod.code}
                      </code>
                    </pre>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <h4 className="font-medium text-foreground mb-3">
                      Benefits:
                    </h4>
                    <ul className="space-y-2">
                      {currentMethod.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                          <span className="text-muted-foreground text-sm">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {currentMethod.id === "api" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      cURL Command:
                    </label>
                    <pre className="p-4 bg-muted rounded-lg overflow-x-auto text-sm">
                      <code className="text-foreground font-mono">
                        {currentMethod.code}
                      </code>
                    </pre>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <h4 className="font-medium text-foreground mb-3">
                      Use Cases:
                    </h4>
                    <ul className="space-y-2">
                      {currentMethod.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                          <span className="text-muted-foreground text-sm">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Live Preview */}
          <motion.div
            key={`${currentMethod.id}-preview`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <h3 className="text-xl font-semibold text-foreground mb-6">
              Live Preview
            </h3>

            <div className="bg-muted/30 rounded-lg p-6 space-y-4">
              <h2 className="text-2xl font-bold text-foreground">
                {currentMethod.preview.title}
              </h2>

              {currentMethod.preview.fields.map((field, index) => (
                <div key={index}>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    {field}
                    {index < 2 && (
                      <span className="text-orange-500 ml-1">*</span>
                    )}
                  </label>
                  {field === "Message" ? (
                    <textarea
                      placeholder={`Enter your ${field.toLowerCase()}...`}
                      rows={3}
                      className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground resize-none"
                    />
                  ) : (
                    <input
                      type={field === "Email" ? "email" : "text"}
                      placeholder={`Enter your ${field.toLowerCase()}...`}
                      className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground"
                    />
                  )}
                </div>
              ))}

              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2.5 rounded-md transition-colors flex items-center justify-center gap-2">
                {currentMethod.preview.buttonText}
                {currentMethod.id === "hosted" && (
                  <ExternalLink className="h-4 w-4" />
                )}
                {currentMethod.id === "headless" && (
                  <Code className="h-4 w-4" />
                )}
                {currentMethod.id === "api" && <Terminal className="h-4 w-4" />}
              </button>

              {currentMethod.id === "hosted" && (
                <div className="pt-4 text-center">
                  <p className="text-xs text-muted-foreground">
                    Form opens in new tab with NaiveForm branding
                  </p>
                </div>
              )}

              {currentMethod.id === "headless" && (
                <div className="pt-4 text-center">
                  <p className="text-xs text-muted-foreground">
                    Form submits to your endpoint, styled with your CSS
                  </p>
                </div>
              )}

              {currentMethod.id === "api" && (
                <div className="pt-4 text-center">
                  <p className="text-xs text-muted-foreground">
                    Programmatic submission with full control
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  Ready to try?
                </span>
                <button className="text-orange-500 hover:text-orange-600 text-sm font-medium flex items-center gap-1 transition-colors">
                  Get started
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
