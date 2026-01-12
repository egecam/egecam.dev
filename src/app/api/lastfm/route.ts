import { NextResponse } from "next/server";

const LASTFM_API_KEY = process.env.LASTFM_API_KEY;
const LASTFM_USERNAME = process.env.LASTFM_USERNAME || "egecam"; // Update with your username

export interface LastFmTrack {
  name: string;
  artist: string;
  album: string;
  albumArt: string;
  url: string;
  nowPlaying: boolean;
  userPlayCount: number;
}

export async function GET() {
  if (!LASTFM_API_KEY) {
    return NextResponse.json(
      { error: "Last.fm API key not configured", track: null },
      { status: 500 }
    );
  }

  try {
    // Fetch recent tracks
    const response = await fetch(
      `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LASTFM_USERNAME}&api_key=${LASTFM_API_KEY}&format=json&limit=1`,
      { next: { revalidate: 30 } }
    );

    if (!response.ok) {
      throw new Error(`Last.fm API error: ${response.status}`);
    }

    const data = await response.json();
    const tracks = data.recenttracks?.track;

    if (!tracks || tracks.length === 0) {
      return NextResponse.json({ track: null });
    }

    const latestTrack = tracks[0];
    const isNowPlaying = latestTrack["@attr"]?.nowplaying === "true";
    const trackName = latestTrack.name || "Unknown Track";
    const artistName = latestTrack.artist?.["#text"] || "Unknown Artist";

    // Fetch track info to get user's play count
    let userPlayCount = 0;

    try {
      const trackInfoResponse = await fetch(
        `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${LASTFM_API_KEY}&artist=${encodeURIComponent(artistName)}&track=${encodeURIComponent(trackName)}&username=${LASTFM_USERNAME}&autocorrect=1&format=json`,
        { next: { revalidate: 30 } }
      );

      if (trackInfoResponse.ok) {
        const trackInfo = await trackInfoResponse.json();
        // userplaycount is returned as a string
        userPlayCount = parseInt(trackInfo.track?.userplaycount || "0", 10);
      }
    } catch (e) {
      // If track info fetch fails, continue without play count
      console.error("Error fetching track info:", e);
    }

    const track: LastFmTrack = {
      name: trackName,
      artist: artistName,
      album: latestTrack.album?.["#text"] || "",
      albumArt: latestTrack.image?.[2]?.["#text"] || "", // Medium size image
      url: latestTrack.url || "",
      nowPlaying: isNowPlaying,
      userPlayCount,
    };

    return NextResponse.json(
      { track },
      {
        headers: {
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching Last.fm data:", error);
    return NextResponse.json(
      { error: "Failed to fetch Last.fm data", track: null },
      { status: 500 }
    );
  }
}

