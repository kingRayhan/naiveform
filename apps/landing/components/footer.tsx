import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 py-12">
      <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-bold text-sm">
            N
          </div>
          <span className="font-semibold text-slate-900">NaiveForm</span>
        </div>

        <div className="flex items-center gap-8 text-sm text-slate-500">
          <Link href="#" className="hover:text-slate-900">
            Privacy
          </Link>
          <Link href="#" className="hover:text-slate-900">
            Terms
          </Link>
          <Link href="#" className="hover:text-slate-900">
            Twitter
          </Link>
          <Link
            href="https://github.com/Start-with-Naive/naiveform"
            className="hover:text-slate-900"
          >
            GitHub
          </Link>
        </div>

        <p className="text-sm text-slate-400">
          © {new Date().getFullYear()} NaiveForm. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
