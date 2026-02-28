"use client";

import Link from "next/link";
import Image from "next/image";
import { CONSOLE_APP_URL } from "@/lib/config";

export const BoldFooter = () => {
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="w-full bg-background text-foreground overflow-hidden border-t border-border">
      <div className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8 flex flex-col items-center">
        <div className="w-full flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
          <div className="max-w-md">
            <h2 className="text-3xl font-bold tracking-tight text-pretty mb-6 text-foreground">
              Ready to get started?
              <br />
              <span className="text-orange-400">Build forms in minutes.</span>
            </h2>
            <a
              href="mailto:hello@naiveform.com"
              className="text-lg font-medium text-foreground hover:text-orange-400 transition-colors duration-300"
            >
              hello@naiveform.com
            </a>
          </div>

          <div className="grid grid-cols-2 gap-12 sm:gap-24">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                Product
              </p>
              <nav className="flex flex-col gap-2">
                <a
                  href="#features"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Features
                </a>
                <a
                  href="#included"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  What&apos;s Included
                </a>
                <a
                  href={CONSOLE_APP_URL}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Login
                </a>
              </nav>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                Connect
              </p>
              <nav className="flex flex-col gap-2">
                <a 
                  href="https://twitter.com" 
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Twitter
                </a>
                <a
                  href="https://github.com/Start-with-Naive/naiveform"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
                <a 
                  href="https://linkedin.com" 
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
              </nav>
            </div>
          </div>
        </div>

        <div className="relative w-full">
          <h1 className="text-[10vw] md:text-[8vw] font-black tracking-tighter text-muted-foreground select-none pointer-events-none leading-none -mb-[2vw] opacity-5">
            NAIVEFORM
          </h1>
          <div className="flex flex-col md:flex-row justify-between items-center border-t backdrop-blur border-border pt-8 pb-6 relative z-10 gap-4">
            <div className="flex items-center gap-3">
              <Link href="/" className="shrink-0 relative h-4 w-24">
                <Image
                  src="/naiveform.svg"
                  alt="Naiveform"
                  fill
                  className="object-contain"
                />
              </Link>
              <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                © {new Date().getFullYear()} NaiveForm
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-6 justify-center">
              <span className="text-xs text-muted-foreground">
                v1.0.0 — {new Date().getFullYear()}
              </span>
              <button
                onClick={scrollToTop}
                className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                Back to top <span className="text-lg">↑</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};