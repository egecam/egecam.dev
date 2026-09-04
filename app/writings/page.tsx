import type { Metadata } from "next";
import Colophon from "@/components/Colophon";
import Nav from "@/components/Nav";
import Register from "@/components/Register";
import { registerEntries } from "@/lib/writings.server";
import { FOLIO_REGISTER } from "@/lib/writings";

export const metadata: Metadata = {
  title: "Writings — Ege Çam",
  description:
    "A register of political, socio-cultural and data texts by Ege Çam, in Turkish and English.",
  alternates: { types: { "application/rss+xml": "/feed.xml" } },
};

export default function Writings() {
  return (
    <div className="page face-spectral display-pirata">
      <div className="measure">
        <Nav current="writings" />

        <p className="prose">
          <span className="versal">W</span>hat follows is a register of texts on politics,
          society, culture and data. You may browse the register by clicking on the tags at
          the end of each line. New texts are added here as they are
          written. You can{" "}
          <a href="/feed.xml" data-tip="/feed.xml — RSS">
            follow this page by RSS
          </a>
          .
        </p>
        <p>
          Reading and hearing stories of others is my favourite way to keep writing.
          If something here catches you,{" "} please <a href="mailto:hey@egecam.dev" data-tip="mailto:hey@egecam.dev">
            share your thoughts with me
          </a>
          .
        </p>

        <Register entries={registerEntries()} />

        <Colophon folio={FOLIO_REGISTER} note="Texts in Turkish and English" />
      </div>
    </div>
  );
}
