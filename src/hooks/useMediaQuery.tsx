import { useEffect, useState } from 'react';

export default function useMediaQuery(query: string): boolean {
  const getMatches = (query: string): boolean => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    // If on the server-side, return false
    return false;
  };

  const [isMatching, setIsMatching] = useState<boolean>(getMatches(query));

  function handleChange() {
    setIsMatching(getMatches(query));
  }

  useEffect(() => {
    const matchMedia = window.matchMedia(query);

    handleChange();

    function handleMediaChange(event: MediaQueryListEvent) {
      handleChange();
    }

    matchMedia.addEventListener('change', handleMediaChange);

    return () => {
      matchMedia.removeEventListener('change', handleMediaChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return isMatching;
}
