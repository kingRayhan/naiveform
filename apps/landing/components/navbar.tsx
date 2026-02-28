"use client";

import Link from "next/link";
import Image from "next/image";
import { CONSOLE_APP_URL, CONSOLE_APP_NEW_FORM_URL } from "@/lib/config";
import { useEffect, useState } from "react";
import { cn } from "@repo/design-system/lib/utils";
import { Button } from "@repo/design-system/button";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 w-full z-50 bg-background border-b border-border backdrop-blur-xl">
      <div className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative h-6 w-32">
              <Image
                src="/naiveform.svg"
                alt="Naiveform"
                fill
                className="object-contain group-hover:opacity-90 transition-opacity duration-300"
                priority
              />
            </div>
          </Link>
          <span className="text-xs font-mono uppercase tracking-wider text-orange-500 bg-orange-500/10 px-2 py-1 rounded">
            BETA
          </span>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden z-50 p-2 rounded-lg hover:bg-secondary transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6 text-foreground" />
          ) : (
            <Menu className="h-6 w-6 text-foreground" />
          )}
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="#features"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Features
          </Link>
          <Link
            href="#included"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            What&apos;s included
          </Link>
          <Link
            href="#testimonials"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Testimonials
          </Link>
        </nav>

        {/* Mobile Navigation Overlay */}
        <div
          className={cn(
            "fixed inset-0 bg-background/80 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden",
            mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Mobile Navigation Menu */}
        <nav
          className={cn(
            "fixed top-0 right-0 h-full w-80 bg-background border-l border-border z-40 p-6 pt-20 transition-transform duration-300 md:hidden",
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex flex-col gap-6">
            <Link
              href="#features"
              className="text-lg font-medium text-foreground hover:text-foreground/80 transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="#included"
              className="text-lg font-medium text-foreground hover:text-foreground/80 transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              What&apos;s included
            </Link>
            <Link
              href="#testimonials"
              className="text-lg font-medium text-foreground hover:text-foreground/80 transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Testimonials
            </Link>
          </div>
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href={CONSOLE_APP_URL}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-4 py-2 rounded-lg hover:bg-secondary"
          >
            Sign In
          </Link>
          <Button 
            asChild 
            className="rounded-lg px-6 h-10 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Link href={CONSOLE_APP_NEW_FORM_URL}>Get Started</Link>
          </Button>
        </div>

        {/* Mobile Auth Buttons */}
        <div className="md:hidden flex items-center gap-3">
          <Button 
            asChild 
            variant="outline"
            className="rounded-lg px-4 h-10 text-sm border-border hover:bg-secondary text-foreground"
          >
            <Link href={CONSOLE_APP_URL}>Sign In</Link>
          </Button>
          <Button 
            asChild 
            className="rounded-lg px-4 h-10 text-sm bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Link href={CONSOLE_APP_NEW_FORM_URL}>Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}