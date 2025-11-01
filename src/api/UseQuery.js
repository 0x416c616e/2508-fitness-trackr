import { useEffect, useState } from "react";
import { useApi } from "./ApiContext";

export default function useQuery(endpoint, tag) {
  const { request, provideTag } = useApi();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const query = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await request(endpoint);
      setData(result);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    provideTag(tag, query);
    query();
  }, []);

  return { data, loading, error };
}
