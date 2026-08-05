import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-24 font-mono">
      <p className="text-sm text-muted">
        <span className="text-sage">jeff@portfolio</span>
        <span className="text-muted">:~</span>
        <span className="text-amber">$</span> cd {"<requested-page>"}
      </p>
      <p className="mt-4 text-2xl text-text">
        404<span className="text-muted">: no such file or directory</span>
      </p>
      <p className="mt-6 text-sm text-muted leading-relaxed">
        The page you&apos;re looking for doesn&apos;t exist — but everything worth reading is one
        level up.
      </p>
      <p className="mt-6 text-sm">
        <Link href="/" className="text-sage hover:text-amber transition-colors">
          cd ~ →
        </Link>
      </p>
    </div>
  );
}
