import { useState, useEffect, useRef } from 'react';
import viteEnv from '@/utils/viteEnv.ts';

interface LocalStorageChangeDetail {
  key: string;
  newValue?: unknown;
  oldValue?: unknown;
}

const getStreamUrl = (): string => {
  const bitrate = localStorage.getItem('bitrate') ?? '128';
  const [streamUri] = viteEnv([`VITE_STREAM_${bitrate}`]);
  return streamUri;
};

const useRadioPlayer = () => {
  const [icon, setIcon] = useState<
    'arrow_2_circlepath' | 'play_fill' | 'pause_fill' | 'xmark_circle'
  >('arrow_2_circlepath');
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(new Audio(getStreamUrl()));

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onCanPlay = () => {
      setLoading(false);
      setIcon(isPlaying ? 'pause_fill' : 'play_fill');
    };

    const onError = () => {
      setLoading(false);
      setIcon('xmark_circle');
    };

    audio.addEventListener('canplay', onCanPlay);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('canplay', onCanPlay);
      audio.removeEventListener('error', onError);
    };
  }, [isPlaying]);

  useEffect(() => {
    const handleLocalStorageChange = (e: Event) => {
      const customEvent = e as CustomEvent<LocalStorageChangeDetail>;
      const key = customEvent.detail.key;

      if (key === 'bitrate') {
        const newStreamUrl = getStreamUrl();
        console.log(`Switching to new stream URL: ${newStreamUrl}`);
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.src = newStreamUrl;
          audioRef.current.load();
          if (isPlaying) {
            audioRef.current.play().catch(() => {
              // Error intentionally ignored
            });
            setIcon('pause_fill');
          } else {
            setIcon('play_fill');
          }
        }
      }
    };

    window.addEventListener('localStorageChange', handleLocalStorageChange as EventListener);
    return () => {
      window.removeEventListener('localStorageChange', handleLocalStorageChange as EventListener);
    };
  }, [isPlaying]);

  const togglePlayback = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      setIcon(loading ? 'arrow_2_circlepath' : 'play_fill');
    } else {
      const streamUrl = getStreamUrl();
      console.log(`Starting playback with stream URL: ${streamUrl}`);
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setIcon('pause_fill');
        })
        .catch(() => {
          setIsPlaying(false);
          setIcon('arrow_2_circlepath');
        });
    }
  };

  return { icon, loading, togglePlayback };
};

export default useRadioPlayer;
