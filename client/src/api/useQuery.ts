import { useState, useEffect } from 'react';

export interface UseQueryOptions<T> {
  initialData?: T;
  deps?: any[];
}

export function useQuery<T>(
  queryThunk: () => Promise<T>,
  options: UseQueryOptions<T> = {},
) {
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<T | null>(options.initialData ?? null);

  const runQuery = async () => {
    try {
      const data = await queryThunk();
      setData(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    runQuery();
  }, options.deps ?? []);

  return { error, loading, data };
}
