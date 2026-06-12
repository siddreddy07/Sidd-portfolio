import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

interface LrcEntry {
  time: number;
  text: string;
}

function parseLrc(lrc: string): LrcEntry[] {
  const lines = lrc.split("\n");
  const entries: LrcEntry[] = [];

  for (const line of lines) {
    const match = line.match(/\[(\d{2}):(\d{2})[\.:](\d{2,3})\](.*)/);
    if (!match) continue;
    const mins = parseInt(match[1], 10);
    const secs = parseInt(match[2], 10);
    const ms = parseInt(match[3].padEnd(3, "0"), 10);
    const text = match[4].trim();
    const time = mins * 60 + secs + ms / 1000;
    entries.push({ time, text });
  }

  return entries;
}

interface SongConfig {
  lrc: string;
  mp3: string;
  title: string;
  artist: string;
}

const SONGS: Record<string, SongConfig> = {
  happy: {
    lrc: "/Avicii%20-%20The%20Nights.lrc",
    mp3: "/Avicii_-_The_Nights_CeeNaija.com_.mp3",
    title: "The Nights",
    artist: "Avicii",
  },
  sad: {
    lrc: "/One%20Direction%20-%20Night%20Changes.lrc",
    mp3: "/One%20Direction%20-%20Night%20Changes%20(Lyrics)%20-%207clouds%20(128k).mp3",
    title: "Night Changes",
    artist: "One Direction",
  },
};

function pickSong(): { key: string; config: SongConfig } {
  try {
    const stored = localStorage.getItem("onboarding_mood");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.mood === "happy") return { key: "happy", config: SONGS.happy };
      if (parsed.mood === "sad") return { key: "sad", config: SONGS.sad };
    }
  } catch {}
  const keys = Object.keys(SONGS);
  const key = keys[Math.floor(Math.random() * keys.length)];
  return { key, config: SONGS[key] };
}

function CharGlow({ char, index, total, duration }: { char: string; index: number; total: number; duration: number }) {
  const delayPerChar = total > 0 ? duration / total : 0;

  return (
    <motion.span
      initial={{ color: "rgba(107, 101, 96, 0.12)", textShadow: "0 0 0px transparent" }}
      animate={{ color: "#C8FF00", textShadow: "0 0 6px #C8FF0066, 0 0 12px #C8FF0033" }}
      transition={{
        delay: index * delayPerChar / 1000,
        duration: 0.1,
        ease: "easeOut",
      }}
      className="inline-block"
    >
      {char === " " ? "\u00A0" : char}
    </motion.span>
  );
}

export default function KaraokeOverlay({ active }: { active: boolean }) {
  const [songKey, setSongKey] = useState<string | null>(null);
  const [song, setSong] = useState<SongConfig | null>(null);
  const [lyrics, setLyrics] = useState<LrcEntry[]>([]);
  const [currentIdx, setCurrentIdx] = useState(-1);
  const [started, setStarted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number>(0);
  const idxRef = useRef(-1);
  const autoSaveRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const sync = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || audio.paused) return;
    const t = audio.currentTime;
    let nextIdx = -1;
    for (let i = 0; i < lyrics.length; i++) {
      if (lyrics[i].time <= t) nextIdx = i;
      else break;
    }
    if (nextIdx !== idxRef.current) {
      idxRef.current = nextIdx;
      setCurrentIdx(nextIdx);
    }
    rafRef.current = requestAnimationFrame(sync);
  }, [lyrics]);

  const saveSession = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !songKey || !song) return;
    localStorage.setItem("karaoke_session", JSON.stringify({
      songKey,
      currentTime: audio.currentTime,
      timestamp: Date.now(),
    }));
  }, [songKey, song]);

  // Load lyrics when active
  useEffect(() => {
    if (!active) {
      setLyrics([]);
      setSong(null);
      setSongKey(null);
      return;
    }
    const picked = pickSong();
    setSongKey(picked.key);
    setSong(picked.config);
    fetch(picked.config.lrc)
      .then((r) => r.text())
      .then((raw) => setLyrics(parseLrc(raw)))
      .catch(() => {});
  }, [active]);

  // Auto-save every 5s during playback
  useEffect(() => {
    if (active && started) {
      autoSaveRef.current = setInterval(saveSession, 5000);
    }
    return () => {
      if (autoSaveRef.current) {
        clearInterval(autoSaveRef.current);
        autoSaveRef.current = null;
      }
    };
  }, [active, started, saveSession]);

  // Playback
  useEffect(() => {
    if (!active) {
      // Save position before stopping
      saveSession();
      setCurrentIdx(-1);
      idxRef.current = -1;
      setStarted(false);
      cancelAnimationFrame(rafRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      return;
    }

    if (!song || lyrics.length === 0 || !songKey) return;

    const audio = new Audio(song.mp3);
    audioRef.current = audio;

    // Check for saved session
    let resumeTime = 0;
    try {
      const saved = localStorage.getItem("karaoke_session");
      if (saved) {
        const session = JSON.parse(saved);
        if (session.songKey === songKey) {
          resumeTime = session.currentTime || 0;
        }
      }
    } catch {}

    const startPlayback = () => {
      if (resumeTime > 0) audio.currentTime = resumeTime;
      audio.play().then(() => {
        setStarted(true);
        rafRef.current = requestAnimationFrame(sync);
      }).catch(() => {});
    };

    if (audio.readyState >= 1) {
      startPlayback();
    } else {
      audio.addEventListener("loadedmetadata", startPlayback, { once: true });
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [active, song, lyrics, songKey, sync, saveSession]);

  const visibleEntry = currentIdx >= 0 && lyrics[currentIdx]?.text ? lyrics[currentIdx] : null;

  const doneCount = lyrics.filter((l) => l.text).length;
  const progress = currentIdx >= 0
    ? lyrics.slice(0, currentIdx + 1).filter((l) => l.text).length
    : 0;

  return (
    <AnimatePresence>
      {active && started && visibleEntry && (
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-x-0 bottom-[6vh] lg:bottom-auto lg:top-[100px] z-40 pointer-events-none select-none flex flex-col items-center px-6"
        >
          <div className="text-center">
            <span className="block font-display italic text-[clamp(24px,5vw,48px)] leading-snug tracking-tight text-text-secondary/10">
              {visibleEntry.text.split("").map((char, ci) => {
                const nextTextLine = lyrics.find((l, j) => j > currentIdx && l.text);
                const nextTime = nextTextLine ? nextTextLine.time : visibleEntry.time + 2.5;
                const lineDuration = (nextTime - visibleEntry.time) * 1000;
                return (
                  <span key={`${currentIdx}-${ci}`}>
                    <CharGlow char={char} index={ci} total={visibleEntry.text.length} duration={Math.max(400, Math.min(lineDuration, 2000))} />
                  </span>
                );
              })}
            </span>
          </div>

          <div className="flex items-center gap-1 mt-4">
            {Array.from({ length: Math.min(doneCount, 20) }).map((_, i) => (
              <span
                key={i}
                className={`rounded-full transition-all duration-300 ${
                  i < progress ? "bg-accent-lime/40 w-1.5 h-1.5" : "bg-white/[0.04] w-1 h-1"
                }`}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
