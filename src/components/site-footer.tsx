import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer id="contact" className="border-t border-line mt-24">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <p className="font-mono text-sm text-muted mb-4">
          <span className="text-amber">$</span> contact --all
        </p>
        <ul className="font-mono text-sm space-y-2">
          <li>
            <span className="text-muted w-24 inline-block">email</span>
            <a href={`mailto:${site.email}`} className="text-sage hover:text-amber transition-colors">
              {site.email}
            </a>
          </li>
          <li>
            <span className="text-muted w-24 inline-block">linkedin</span>
            <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="text-sage hover:text-amber transition-colors">
              in/rotman-mma
            </a>
          </li>
          <li>
            <span className="text-muted w-24 inline-block">github</span>
            <a href={site.github} target="_blank" rel="noopener noreferrer" className="text-sage hover:text-amber transition-colors">
              jzhou196
            </a>
          </li>
          <li>
            <span className="text-muted w-24 inline-block">resume</span>
            <a href={site.resumePath} download className="text-sage hover:text-amber transition-colors">
              Jeff-Zhou-Resume.pdf
            </a>
          </li>
        </ul>
        <p className="mt-8 text-xs text-muted font-mono">
          © {new Date().getFullYear()} Jeff Zhou · built with Next.js · the chatbot on this site is
          itself a project — ask it how it works.
        </p>
      </div>
    </footer>
  );
}
