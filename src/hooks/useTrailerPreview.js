import { useEffect, useRef, useState } from 'react';

const PREVIEW_DELAY = 500;

export function useTrailerPreview(trailerUrl) {
  const [preview, setPreview] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const timerRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const startPreview = () => {
    if (!trailerUrl) return;
    timerRef.current = setTimeout(() => setPreview(true), PREVIEW_DELAY);
  };
  const stopPreview = () => {
    clearTimeout(timerRef.current);
    setPreview(false);
    setVideoReady(false);
  };


  const onPlaying = () => setVideoReady(true);

  return { preview, videoReady, videoRef, trailerUrl, onPlaying, startPreview, stopPreview };
}
