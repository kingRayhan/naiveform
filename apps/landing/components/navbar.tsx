"use client";

import Link from "next/link";
import Image from "next/image";
import { CONSOLE_APP_URL, CONSOLE_APP_NEW_FORM_URL } from "@/lib/config";
import { useEffect, useState } from "react";
import { cn } from "@repo/design-system/lib/utils";
import { Button } from "@repo/design-system/button";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        scrolled
          ? "bg-white/80 backdrop-blur-md border-b border-zinc-100 py-3"
          : "bg-transparent py-5",
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src="/naiveform.svg"
            alt="Naiveform"
            width={140}
            height={23}
            className="h-6 w-auto group-hover:opacity-90 transition-opacity"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="#features"
            className="text-sm font-medium text-zinc-600 hover:text-black transition-colors"
          >
            Features
          </Link>
          <Link
            href="#included"
            className="text-sm font-medium text-zinc-600 hover:text-black transition-colors"
          >
            What&apos;s included
          </Link>
          <Link
            href="#"
            className="text-sm font-medium text-zinc-600 hover:text-black transition-colors"
          >
            Resources
          </Link>
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href={CONSOLE_APP_URL}
            className="text-sm font-medium text-zinc-600 hover:text-black transition-colors px-3 py-2"
          >
            Sign In
          </Link>
          <Button asChild className="rounded-full px-5">
            <Link href={CONSOLE_APP_NEW_FORM_URL}>Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
