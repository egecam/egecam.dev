# Content

Everything the site says lives in this folder and in `public/plates/`. There is no
CMS and no build step beyond `next build` — edit a file, save, and the page is
different. `next dev` picks changes up on reload; a deploy rebuilds from the same
files.

```
content/
  images.json          the plate registry — every image and its metadata
  writings/*.md        one file per text; the filename is the URL
public/plates/         the image files themselves
```

---

## Writings

One Markdown file per text. **The filename is the slug**, so
`content/writings/yabancilasma-ve-sehir.md` is served at
`/writings/yabancilasma-ve-sehir`. Rename the file and the URL moves with it.

```md
---
title: Yabancılaşma ve şehir
lang: tr
topics: [socio-cultural]
date: 2026-03
place: Nürnberg
placeNote: Written in Nürnberg, Bavaria
---

The first paragraph. It opens with the versal automatically.

Every paragraph after it is indented, with no blank line between them on the
page — that is the chronicle setting, and it is handled for you.
```

### Frontmatter

| Key | | |
|---|---|---|
| `title` | required | Wrap in `"…"` if it contains a colon. |
| `lang` | required | `tr` or `en`. Becomes the first filter tag, and sets the language for hyphenation. |
| `topics` | required | `[political, socio-cultural, data]` — any subset, in the order you want them shown. They become the remaining filter tags. |
| `date` | required | `YYYY-MM` or `YYYY-MM-DD`. Prints as "March 2026" and sorts the register, newest first. |
| `place` | optional | Shown in the byline. |
| `placeNote` | optional | What the cursor label says over the place. |

A file with frontmatter and **no body** is listed in the register but not
linked — that is how a text is announced before it is written. Give it a body
and it becomes a page.

### Writing the body

Blank lines separate paragraphs. Beyond that there are five marks, all of them
things this design can actually show:

| | |
|---|---|
| `*italic*` | Italic. |
| `[text](https://example.com)` | A link. Its label shows the URL without the scheme; `mailto:` links keep theirs. External links open in a new tab. |
| `[word]{a short footnote}` | A dotted word. Its label shows the footnote. Not clickable. |
| `{^a marginal note}` | The `✻` mark, and its note in the right margin. Collapses to a ruled indent under 1180px. |
| `:plate[image-id]` | A plate. Alone on a line it stands at full measure; put text after it and the paragraph runs around it. `:plate[image-id]{right}` floats it right. |

Notes and footnotes may contain `*italic*` and links, but not a `}`.

The closing line — *"This text stays open to revision…"* — is part of the page,
not the file. It appears on every article.

---

## Images

`images.json` is the registry. One entry per plate, keyed by the id you use in
`:plate[…]` and in the pages:

```json
{
  "schedel-1493": {
    "src": "/plates/schedel-1493.jpg",
    "alt": "Woodcut view of Nürnberg, walled and towered",
    "caption": "Schedel, Liber Chronicarum, 1493 — Nürnberg",
    "width": 1400,
    "height": 900
  }
}
```

| Key | | |
|---|---|---|
| `caption` | required* | **The source line.** It prints under the plate *and* it is what the cursor label says. Written once, here. |
| `src` | optional | Path under `public/`. Leave it out and the plate renders as an empty slot — the layout is already correct, the picture just is not in yet. |
| `placeholder` | optional | What the empty slot says while `src` is missing. |
| `tip` | optional | For the rare case the label should differ from the caption — the record sleeve prints "Yabancı, single, 2026" but its label says "…— sleeve". |
| `alt` | optional | Falls back to the caption. |
| `width`, `height` | optional | Intrinsic pixel size. Supply them and the space is reserved before the image loads. |

\* Either `caption` or `tip`. A rear face with no caption of its own — the record
disc, the open book — needs only a `tip`.

### Adding one

1. Put the file in `public/plates/`.
2. Add its entry to `images.json` with a `src` and a `caption`.
3. Reference the id: `:plate[my-id]` in a text, or `<Plate id="my-id" />` on a page.

A typo in an id fails the build with the list of ids it knows, rather than
rendering a hole.

---

## Recent reads

The four covers beside the current read come from Goodreads, not from this
folder. That endpoint is not an API — it serves a JavaScript file that assigns a
blob of HTML to a variable and injects it. `lib/goodreads.ts` fetches it on the
server, lifts the HTML out of the string, and keeps four fields per book: title,
author, cover, link. Goodreads' own markup, stars, logo and stylesheet never
reach the page.

The fetch revalidates once a day. `reads.json` is a snapshot of the same parse
and stands in whenever the fetch fails or the widget changes shape, so the
section cannot render empty or break a build. To refresh the snapshot by hand,
replace it with what the live parse currently returns.

Which books appear is controlled on Goodreads — the shelf is `read`, newest
first. The only thing to change here is `num_books` in the widget URL, and the
`limit` passed to `recentReads()`.

---

## Recently watched

The four posters come from the public Letterboxd RSS feed at
`letterboxd.com/egecam/rss/`. Unlike the Goodreads widget this is a real feed:
the title, year and rating each have their own `letterboxd:` element, so only
the poster has to be lifted out of the description's HTML. `lib/letterboxd.ts`
fetches and parses it on the server.

The feed carries list and review entries alongside watches; anything without a
film title is dropped. Posters are requested at 1000×1500 rather than the 600×900
the feed links to.

Like the books, the fetch revalidates daily and `watches.json` is a snapshot of
the same parse, standing in if Letterboxd is unreachable. What appears is
whatever you have logged most recently — there is nothing to edit here. The
count is the `limit` passed to `recentWatches()`.

### Where the home page's plates are used

`nurnberg-now` and `istanbul` are the two full-measure plates. `record-sleeve` /
`record-disc` and `book-cover` / `book-inside` are the front and rear faces of
the two hoverable objects — the rear one is what slides out from behind the
cover.
