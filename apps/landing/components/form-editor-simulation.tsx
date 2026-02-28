"use client";

import { motion } from "motion/react";
import { useState, useEffect } from "react";
import {
  GripVertical,
  Text,
  Mail,
  SquareCheckBig,
  ChevronDown,
  Plus,
  Trash2,
  Save,
  Eye,
} from "lucide-react";

const sampleBlocks = [
  {
    id: "1",
    type: "heading",
    content: "Contact Information",
    level: 2,
  },
  {
    id: "2", 
    type: "text",
    label: "Full Name",
    placeholder: "Enter your full name",
    required: true,
  },
  {
    id: "3",
    type: "email",
    label: "Email Address",
    placeholder: "you@example.com",
    required: true,
  },
  {
    id: "4",
    type: "radio",
    label: "How did you hear about us?",
    options: ["Social Media", "Search Engine", "Friend Referral", "Other"],
    required: false,
  },
  {
    id: "5",
    type: "long_text",
    label: "Tell us about your project",
    placeholder: "Describe what you're working on...",
    required: false,
  },
];

export function FormEditorSimulation() {
  const [activeBlock, setActiveBlock] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);

  // Auto-play animation sequence
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationStep((prev) => (prev + 1) % 4);
    }, 2000);
    return () => clearTimeout(timer);
  }, [animationStep]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "heading": return <span className="font-bold text-lg">H2</span>;
      case "text": return <Text className="h-4 w-4" />;
      case "email": return <Mail className="h-4 w-4" />;
      case "radio": return <SquareCheckBig className="h-4 w-4" />;
      case "long_text": return <span className="text-xs">📝</span>;
      default: return <Text className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "heading": return "Heading";
      case "text": return "Short Text";
      case "email": return "Email";
      case "radio": return "Multiple Choice";
      case "long_text": return "Long Text";
      default: return type;
    }
  };

  return (
    <section className="py-24 bg-background relative overflow-hidden border-t border-border">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto mb-20 text-center">
          <div className="w-16 h-0.5 bg-orange-500 mx-auto mb-8"></div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
            Intuitive form builder
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Drag, drop, and customize. No coding required.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Editor Simulation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-card border border-border rounded-xl overflow-hidden shadow-xl"
          >
            <div className="p-4 border-b border-border bg-muted/30">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-foreground">Form Editor</h3>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-md hover:bg-muted transition-colors">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </button>
                  <button className="px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-sm font-medium flex items-center gap-1.5">
                    <Save className="h-3.5 w-3.5" />
                    Save
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-4 space-y-3 min-h-[400px]">
              {sampleBlocks.map((block, index) => (
                <motion.div
                  key={block.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    backgroundColor: animationStep === index ? "rgba(255, 107, 53, 0.1)" : "transparent"
                  }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`group relative bg-background border border-border rounded-lg p-3 hover:border-orange-500/30 transition-all duration-200 cursor-move ${
                    activeBlock === block.id ? "ring-2 ring-orange-500/50" : ""
                  }`}
                  onMouseEnter={() => setActiveBlock(block.id)}
                  onMouseLeave={() => setActiveBlock(null)}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <GripVertical className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1.5">
                          <div className="p-1.5 bg-muted rounded">
                            {getTypeIcon(block.type)}
                          </div>
                          <span className="text-xs font-medium text-muted-foreground">
                            {getTypeLabel(block.type)}
                          </span>
                        </div>
                        {block.required && (
                          <span className="text-xs text-orange-500 font-medium">Required</span>
                        )}
                      </div>
                      
                      {"label" in block && (
                        <h4 className="font-medium text-foreground mb-1">
                          {block.label}
                          {block.required && <span className="text-orange-500 ml-1">*</span>}
                        </h4>
                      )}
                      
                      {"content" in block && (
                        <h4 className="font-bold text-lg text-foreground">{block.content}</h4>
                      )}
                      
                      {"placeholder" in block && (
                        <div className="text-sm text-muted-foreground italic">
                          {block.placeholder}
                        </div>
                      )}
                      
                      {"options" in block && (
                        <div className="space-y-1 mt-2">
                          {block.options?.map((option: string, optIndex: number) => (
                            <div key={optIndex} className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full border border-muted-foreground"></div>
                              <span className="text-sm text-foreground">{option}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      <button className="p-1.5 rounded hover:bg-muted">
                        <Plus className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                      <button className="p-1.5 rounded hover:bg-muted">
                        <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {/* Add Block Button */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="w-full p-4 border-2 border-dashed border-border rounded-lg text-muted-foreground hover:border-orange-500/50 hover:text-orange-500 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="h-5 w-5" />
                Add block
              </motion.button>
            </div>
          </motion.div>

          {/* Preview & Features */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">Live Preview</h3>
              <div className="bg-muted/30 rounded-lg p-6 space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Contact Information</h2>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Full Name <span className="text-orange-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="Enter your full name"
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Email Address <span className="text-orange-500">*</span>
                  </label>
                  <input 
                    type="email" 
                    placeholder="you@example.com"
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    How did you hear about us?
                  </label>
                  <div className="space-y-2">
                    {["Social Media", "Search Engine", "Friend Referral", "Other"].map((option) => (
                      <label key={option} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="source" className="text-orange-500" />
                        <span className="text-foreground">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Tell us about your project
                  </label>
                  <textarea 
                    placeholder="Describe what you're working on..."
                    rows={3}
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground resize-none"
                  />
                </div>
                
                <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2.5 rounded-md transition-colors">
                  Submit
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-card border border-border rounded-lg p-5">
                <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center mb-3">
                  <GripVertical className="h-5 w-5 text-orange-500" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">Drag & Drop</h4>
                <p className="text-sm text-muted-foreground">
                  Reorder blocks with simple drag gestures
                </p>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-5">
                <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-orange-500 font-bold">⚡</span>
                </div>
                <h4 className="font-semibold text-foreground mb-2">No Coding</h4>
                <p className="text-sm text-muted-foreground">
                  Build forms visually without writing code
                </p>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-5">
                <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-orange-500 font-bold">🔄</span>
                </div>
                <h4 className="font-semibold text-foreground mb-2">Real-time Preview</h4>
                <p className="text-sm text-muted-foreground">
                  See changes instantly as you build
                </p>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-5">
                <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-orange-500 font-bold">🎨</span>
                </div>
                <h4 className="font-semibold text-foreground mb-2">Customizable</h4>
                <p className="text-sm text-muted-foreground">
                  Adjust labels, options, and requirements easily
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}