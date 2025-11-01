import { useState } from "react";
import { useApi } from "./ApiContext";

/**
 * Custom hook for modifying data via the API (POST, PATCH, DELETE).
 * Returns a mutate function that can be called to make the request.
 * After successful mutation, invalidates specified tags to trigger refetches.
 */
export default function useMutation(endpoint, method, tagsToInvalidate = []) {
  const { request, invalidateTags } = useApi();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = async (body) => {
    setLoading(true);
    setError(null);
    try {
      const result = await request(endpoint, {
        method,
        body: body ? JSON.stringify(body) : undefined,
      });
      setData(result);
      invalidateTags(tagsToInvalidate);
      return result;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, data, loading, error };
}
