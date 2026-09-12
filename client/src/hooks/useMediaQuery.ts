import { useCallback, useLayoutEffect, useState } from 'react';

export function useMediaQuery(query: string): boolean {
  const getMatches = (query: string): boolean =>
    window.matchMedia(query).matches;

  const [matches, setMatches] = useState<boolean>(() => getMatches(query));

  const handleChange = useCallback(() => {
    setMatches(getMatches(query));
  }, [query]);

  useLayoutEffect(() => {
    const matchMedia = window.matchMedia(query);

    handleChange();

    matchMedia.addEventListener('change', handleChange);

    return () => matchMedia.removeEventListener('change', handleChange);
  }, [query, handleChange]);

  return matches;
}
