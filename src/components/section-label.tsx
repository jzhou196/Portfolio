// Numbered mono section marker — encodes the real case-study sequence
// (problem → approach → result → reflection → stack), not decoration.
export function SectionLabel({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <h2 className="font-mono text-sm tracking-widest uppercase text-muted mb-6">
      <span className="text-amber">{n}</span>
      <span className="mx-2 text-line">/</span>
      {children}
    </h2>
  );
}
