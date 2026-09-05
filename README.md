# egecam.dev

A personal site built as a manuscript: a register of texts, plates from the
public domain, marginal notes, and a candle that keeps the hours.

Next.js 15 (App Router), React 18, TypeScript. No CSS framework — one
stylesheet, `app/globals.css`, sectioned and numbered.

## Running

```bash
npm install
npm run dev      # http://localhost:3000
```

`npm run build` for the production build, `npm run lint` for eslint.

## Content

Nothing is hardcoded in the pages. Three sources feed the site:

**Writings** — `content/writings/*.md`, one file per text, with a small
frontmatter block (`title`, `lang`, `topics`, `date`, `place`). A file with
frontmatter but no body is listed in the register without a link, which is how
a planned text is announced before it exists. Read by `lib/writings.server.ts`.

**Plates** — `content/images.json` is the registry; the image itself goes in
`public/plates/`. The caption written here is what prints under the plate *and*
what the cursor label says, so it is written once. See `content/README.md`.

**Reads and watches** — pulled live. Books come from the Goodreads widget
endpoint, films from the Letterboxd RSS feed, both parsed server-side so none
of their markup reaches the page. Each revalidates daily and falls back to a
committed snapshot (`content/reads.json`, `content/watches.json`) if the source
is unreachable, so a build never fails on someone else's downtime.

## Layout

```
app/          routes; feed.xml is the RSS route handler
components/   Nav, Plate, HoverObject, Candle, CursorLabel, Register, …
lib/          content loaders, markdown, night mode, feed sources
content/      writings, image registry, snapshots
public/plates images
```

## Conventions worth knowing

**The cursor label** is one mechanism driven by a single attribute. Put
`data-tip="…"` on anything — a link, a dotted word, an image — and the label
follows the pointer with that line. Inside a plate it takes the caption's place.

**Typography is tokenised.** `.page` carries two classes, a body face and a
display face (`face-spectral display-pirata`). Sizes travel with the display
face, since a blackletter at 35px reads smaller than a roman at 35px. Swapping
the pairing is a two-class edit.

**Folios** run through the site: home is `i`, the register `ii`, texts `iii`
onward, oldest first, so a new text never renumbers the ones before it.

**Night** follows the reader's clock, dark from 19:00 to 07:00. The candle
overrides it, but only until the period turns over.

**Shadows** are rare on purpose — the record, the book, the cursor label, and
the two stacks. Motion is transform-only.

## Feed

`/feed.xml`, with autodiscovery in the document head. Only texts with a body
appear in it.
