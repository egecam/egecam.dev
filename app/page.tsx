import Link from "next/link";
import HoverObject from "@/components/HoverObject";
import Nav from "@/components/Nav";
import Colophon from "@/components/Colophon";
import Plate from "@/components/Plate";
import RecentReads from "@/components/RecentReads";
import RecentWatches from "@/components/RecentWatches";
import { FOLIO_HOME } from "@/lib/writings";

export default function Home() {
  return (
    <div className="page face-spectral display-pirata">
      <div className="measure">
        <Nav current="home" />

        <p className="prose">
          <span className="versal">I</span>am Ege, doing my Master's in
          Information Systems with a focus on Data Science at Friedrich-Alexander-Universität
          Erlangen-Nürnberg, working toward digital humanities and sociological data
          research. <span data-tip="William Edward Burghardt Du Bois was an American sociologist, Marxist, writer, historian, and Pan-Africanist civil rights activist. He pioneered data-driven scientific approaches to social research.">W. E. B. Du Bois</span> is one of my heroes. I also make ambient and electronic
          music, write, and build worlds. I like to read and tell stories about people and their cities through music,
          literature, and data.
        </p>
        <p className="prose prose--loose">
          Lately I have been nerding out on audio harvesting, Disco Elysium, and
          the <span data-tip="Liber Chronicarum or The Nuremberg Chronicle
          is a German illustrated universal history published in 1493.">Schedelsche Weltchronik</span> as
          you may have guessed from the design of this site. 
        </p>

        <h2 className="heading heading--split">
          Now
          <span className="heading__meta">Last written 3 September 2026</span>
        </h2>

        <p className="prose">
          Moving to Nürnberg, Germany, after living in İstanbul, Türkiye, for 24 years. This is my first time moving to a new country,
          and I am excited to explore the city, its history and its culture.
          I am also looking forward to opportunities to collaborate with local artists and researchers here and around the world.
        </p>

        <Plate id="nuremberg-now" />

        <p className="prose prose--loose">
          I released a single called <em>Yabancı</em> in August 2026, using a new technique
          I call <span data-tip="Audio harvesting is a musical technique that involves collecting and processing sounds
          from the physical and digital environment to create sonic textures and atmospheres. It may include field recording,
          sound design, sonic arts and digital manipulation.">audio harvesting</span>. 
          It is about becoming a stranger at home and being a stranger somewhere new, at the same time.
          A line from Erden Kıral's 1983 film {" "}
              <a
                href="https://letterboxd.com/film/a-season-in-hakkari/"
                data-tip="letterboxd.com/film/a-season-in-hakkari"
                target="_blank"
                rel="noreferrer"
              >
                Hakkari'de Bir Mevsim
              </a>{" "} runs through the track as a recurring motif, alongside samples
               from several other Turkish and American films, cut together into a collage of voices.
          </p>

        <div className="pair">
          <HoverObject
            kind="record"
            figureClassName="object__figure--left"
            rear="record-disc"
            front="record-sleeve"
          />
          <div>
            <p className="prose">
              <em>Yabancı</em>, an ambient and electronic single built as sonic storytelling. On{" "}
              <a
                href="https://egecam.bandcamp.com/"
                data-tip="egecam.bandcamp.com"
                target="_blank"
                rel="noreferrer"
              >
                Bandcamp
              </a>{" "}
              and{" "}
              <a
                href="https://open.spotify.com/artist/6vDaoL4XXBtnDOUb5jUiVc"
                data-tip="open.spotify.com/artist/6vDaoL4XXBtnDOUb5jUiVc"
                target="_blank"
                rel="noreferrer"
              >
                Spotify
              </a>
              .
            </p>
            <iframe
              className="embed"
              title="Ege Çam on Spotify"
              src="https://open.spotify.com/embed/artist/6vDaoL4XXBtnDOUb5jUiVc?utm_source=generator&theme=0"
              width="100%"
              height={152}
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
          </div>
        </div>

        <div className="pair">
          <div>
            <p className="prose">
              Halfway through <em>The Creative Act</em> by Rick Rubin, which is less a
              method than a temperament.
            </p>
            <RecentReads />
          </div>
          <HoverObject
            kind="book"
            figureClassName="object__figure--right"
            rear="book-inside"
            front="book-cover"
          />
        </div>

        <div className="pair pair--end">
          <p className="prose prose--loose">
            Watching a lot of films, in cinemas when I can. I keep a record on{" "}
            <a
              href="https://letterboxd.com/egecam/"
              data-tip="letterboxd.com/egecam"
              target="_blank"
              rel="noreferrer"
            >
              Letterboxd
            </a>
            .
          </p>
          <RecentWatches />
        </div>

        <h2 className="heading heading--wide">About me</h2>

        <div className="pair pair--prose">
          <p style={{ margin: 0 }}>
            I was an indie developer as an <span data-tip="BSc in Information Systems and Technologies
            the Turkish equivalent of Wirtschaftsinformatik, weighted toward programming and data rather than management.">
              IT graduate</span> and built a few web and mobile applications,
            until I realised that I wanted to understand the world, people and their problems better.
            Rather than chasing the most efficient solution to a problem,
            I wanted to understand the problem itself and maybe even be the one who mongers it.
          </p>
          <p style={{ margin: 0 }}>
            What holds my attention is the moment a social fact becomes a measurement: what
            survives that translation and what quietly does not.{" "}
            <span data-tip="Data portraits shown at the 1900 Paris Exposition — 63 hand-drawn charts on Black American life.">
              Du Bois's Paris charts
            </span>{" "}
            are the standing example; hand-drawn, insistent, made to argue rather than
            merely describe.
          </p>
        </div>

        <p className="prose prose--loose">
          <span className="versal versal--sm">İ</span>stanbul has been home to me for 24 years
          and as it has been to many for centuries, I too have been shaped by its socio-economic and cultural fabric.
        </p>

        <Plate id="istanbul" />

      <div className="pair pair--prose">
          <p className="prose prose--loose">
            I come from a working-class family. I have been lucky enough to have access to proper education
            and to be able to pursue my self-actualization rather than my material needs.
            While being thankful for that, I have been raised with a strong sense of labour, gender equality
            and a strong reaction to social injustice and inequality since my early childhood.
          </p>
          <p className="prose prose--loose">
            As a home, İstanbul felt like a place to fix rather than to settle in
            since the city has been shaped by the same social injustices and inequalities that I have been raised to fight against,
            and I decided to step back from my physical presence in the class struggle here,
            to deepen my understanding and gain new perspectives elsewhere.
          </p>
        </div>
      <p className="prose prose--loose">
        The plan was never to detach myself from the political and social struggles of my home,
        but I am going to try to understand them better from a distance.
      </p>
      <p className="prose prose--loose">
        <span className="versal versal--sm">I</span>am not a fan of buzzwords or labels, but if I have to pick some: queer, Marxist and atheist.
        I oppose <span data-tip="Suno is an AI music generation service. Systems like it are trained on recordings whose makers were neither asked nor paid, then sold back as a product.">generative systems</span> that are trained on artists' work and sold back to the public without paying them.
        I also oppose the alliance between states and <span data-tip="Palantir and similar firms selling predective policing,
         border control and battlefield targeting systems to governments.">companies</span>, which turns data infrastructure into new fronts of war
        and control, and threatens the privacy, volition and autonomy of society.
      </p>
      <h2 className="heading heading--wide">Pah! What about some fun things, young man?</h2>
      <p className="prose prose--loose">
        As a hobby, I am interested in worldbuilding and I have been creating a fictional world with social, political and cultural
        aspects for some time now. Currently I am writing the world bible, which is a collection of folktales, histories and spatial data of the world.
        Some of the great inspirations for this project are <span data-tip="Disco Elysium is a 2019 role-playing game by ZA/UM,
        set in a city still living inside the failure of its own revolution.
        It has no combat; you argue, remember and fail your way through it,
        and your political convictions are a mechanic rather than a backdrop.">Disco Elysium</span>, <span data-tip="Le Combat 
        Ordinaire is a comic book by Manu Larcenet.">Le Combat Ordinaire</span> and
         our own <span data-tip="Dungeons & Dragons is a tabletop role-playing game.">DnD campaigns</span> which
         we have been playing for years with a couple of friends. 
      </p>
      <p className="prose prose--loose">
        I am not sure if I will ever publish it or what medium I will use to concretise it, but I am enjoying 
        the process of creating it and I am learning a lot about storytelling, worldbuilding and the human condition in the process.
      </p>

        {/* <p className="prose prose--loose prose--indent">
          The writings are political, sociological and cultural texts, in Turkish and
          English, gathered under{" "}
          <Link href="/writings" data-tip="/writings">
            Writings
          </Link>
          . The music is not separate from them: long forms, field recordings, a fictional
          geography the records keep returning to. Write to me at{" "}
          <a href="mailto:hey@egecam.dev" data-tip="mailto:hey@egecam.dev">
            hey@egecam.dev
          </a>
          ; also on{" "}
          <a
            href="https://scholar.google.com/citations?user=sX4HiXoAAAAJ&hl=en"
            data-tip="scholar.google.com/citations"
            target="_blank"
            rel="noreferrer"
          >
            Scholar
          </a>{" "}
          and{" "}
          <a
            href="https://github.com/egecam"
            data-tip="github.com/egecam"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          .
        </p> */}

        <Colophon folio={FOLIO_HOME} note="Plates from the public domain" />
      </div>
    </div>
  );
}
