import type { ReactNode } from "react";

/** The in-text mark. Its note follows it immediately in source, so the float
 *  begins on this line. */
export function Mark() {
  return <span className="mark">✻</span>;
}

export function MarginalNote({ children }: { children: ReactNode }) {
  return (
    <span className="mnote">
      <span className="mnote__mark">✻</span>
      {children}
    </span>
  );
}
