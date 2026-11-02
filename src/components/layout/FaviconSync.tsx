import { useEffect } from "react";
import { setFaviconTrack } from "../../lib/favicon";
import { useAlbumColors, useNowPlaying } from "../../lib/spotify";

// Keeps the animated favicon in step with Spotify on every page: equaliser while a song is playing, the bar loop in
// the last song's album colour when not, and the lime bar loop when Spotify can't be reached (demo track).
export default function FaviconSync() {
  const track = useNowPlaying();
  const real = track && !track.demo ? track : null;
  const colors = useAlbumColors(real?.image ?? null);

  useEffect(() => {
    setFaviconTrack(real ? (colors?.a ?? null) : null, !!real?.playing);
  }, [real?.playing, colors?.a]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
