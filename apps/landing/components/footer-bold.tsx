"use client";

import { CONSOLE_APP_URL } from "@/lib/config";

export const BoldFooter = () => {
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="w-full bg-white text-zinc-900 overflow-hidden border-t border-zinc-200 font-dmSans">
      <div className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8 flex flex-col items-center">
        <div className="w-full flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
          <div className="max-w-md">
            <h2 className="text-3xl font-bold tracking-tight text-pretty mb-6">
              Ready to get started? Build forms in minutes.
            </h2>
            <a
              href="mailto:hello@naiveform.com"
              className="text-lg font-medium border-b-2 border-zinc-900 pb-1 hover:text-zinc-500 hover:border-zinc-500 transition-all"
            >
              hello@naiveform.com
            </a>
          </div>

          {/* <div className="grid grid-cols-2 gap-12 sm:gap-24">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4">
                Platform
              </p>
              <nav className="flex flex-col gap-2">
                <a
                  href="#features"
                  className="text-sm font-medium hover:underline"
                >
                  Features
                </a>
                <a
                  href="#pricing"
                  className="text-sm font-medium hover:underline"
                >
                  Pricing
                </a>
                <a
                  href={CONSOLE_APP_URL}
                  className="text-sm font-medium hover:underline"
                >
                  Login
                </a>
              </nav>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4">
                Social
              </p>
              <nav className="flex flex-col gap-2">
                <a href="#" className="text-sm font-medium hover:underline">
                  Twitter
                </a>
                <a
                  href="https://github.com/Start-with-Naive/naiveform"
                  className="text-sm font-medium hover:underline"
                >
                  GitHub
                </a>
                <a href="#" className="text-sm font-medium hover:underline">
                  LinkedIn
                </a>
              </nav>
            </div>
          </div> */}
        </div>

        <div className="relative w-full">
          <h1 className="text-[12vw] font-black tracking-tighter text-zinc-950 select-none pointer-events-none leading-none -mb-[2vw] opacity-5">
            NAIVEFORM
          </h1>
          <div className="flex justify-between items-end border-t backdrop-blur border-zinc-200 pt-8 pb-6 relative z-10">
            <span className="text-xs font-medium uppercase tracking-widest text-zinc-400">
              © {new Date().getFullYear()} NaiveForm
            </span>
            <div className="flex gap-8">
              <span className="text-xs text-zinc-400">
                v1.0.0 — {new Date().getFullYear()}
              </span>
              <button
                onClick={scrollToTop}
                className="text-xs font-bold uppercase tracking-widest hover:text-zinc-500 transition-colors"
              >
                Back to top ↑
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
