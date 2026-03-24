import { useEffect, useRef, useState } from "react";

export function useAudio(src, { loop = false, volume = 1 } = {}) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = new Audio(src);
    audio.loop = loop;
    audio.volume = volume;
    audio.preload = "auto";

    audioRef.current = audio;

    const handleEnded = () => {
      setIsPlaying(false);
    };

    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.pause();
      audio.currentTime = 0;
      // Do not clear src here; Chrome can treat that as media removal
    };
  }, [src, loop, volume]);

  const play = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = 0;
    try {
      await audio.play();
      setIsPlaying(true);
    } catch (err) {
      const msg = String(err?.message || "");
      if (msg.includes("play() request was interrupted")) {
        console.debug("Ignoring interrupted play()", err);
        return;
      }
      console.error("Audio play failed:", err);
      setIsPlaying(false);
    }
  };

  const stop = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
  };

  const toggle = () => {
    if (isPlaying) {
      stop();
    } else {
      play();
    }
  };

  return { play, stop, toggle, isPlaying };
}
