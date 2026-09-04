import Link from "next/link";
import Candle from "./Candle";

/**
 * No bar, no background, no border, no active underline. The current page is a
 * span in the accent; the others are links in the same colour.
 */
export default function Nav({ current }: { current: "home" | "writings" }) {
  return (
    <nav className="nav">
      {current === "home" ? (
        <span className="nav__current">Home</span>
      ) : (
        <Link href="/">Home</Link>
      )}
      {current === "writings" ? (
        <span className="nav__current">Writings</span>
      ) : (
        <Link href="/writings">Writings</Link>
      )}
      <Candle />
    </nav>
  );
}
