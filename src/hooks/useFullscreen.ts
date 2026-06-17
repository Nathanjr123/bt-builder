import { useEffect, useState, useCallback } from 'react';

// Thin wrapper around the Fullscreen API. Tracks state across user-initiated
// changes (including Esc to exit) and degrades gracefully where unsupported.
export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(
    () => typeof document !== 'undefined' && Boolean(document.fullscreenElement),
  );

  useEffect(() => {
    const handler = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const toggle = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      // Some browsers block fullscreen without a direct user gesture or in
      // certain embeds; ignore and leave state unchanged.
    }
  }, []);

  const supported =
    typeof document !== 'undefined' &&
    Boolean(document.documentElement.requestFullscreen);

  return { isFullscreen, toggle, supported };
}
