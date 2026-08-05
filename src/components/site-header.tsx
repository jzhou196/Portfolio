import Link from "next/link";
import { site } from "@/lib/site";

const nav = [
  { href: "/", label: "/main" },
  { href: "/#projects", label: "~/projects" },
  { href: "/about", label: "~/about" },
];

export function SiteHeader() {
  return (
    <header
      className="sticky top-0 z-40 border-b border-line bg-ink/90 backdrop-blur"
      style={{ viewTransitionName: "site-header" }}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="font-mono text-sm text-text hover:text-amber transition-colors"
        >
          <span className="text-sage">jeff</span>
          <span className="text-muted">@</span>
          <span className="text-sage">portfolio</span>
          <span className="text-muted">:~</span>
          <span className="text-amber">$</span>
        </Link>
        <nav className="flex items-center gap-4 sm:gap-6 font-mono text-xs sm:text-sm">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-muted hover:text-amber transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <a
            href={site.resumePath}
            className="border border-line rounded px-2 py-1 text-sage hover:border-sage transition-colors"
            download
          >
            resume.pdf
          </a>
        </nav>
      </div>
    </header>
  );
}
