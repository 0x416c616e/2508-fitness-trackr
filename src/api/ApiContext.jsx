import { createContext, useContext, useState } from "react";
import { useAuth } from "../auth/AuthContext";

const API = import.meta.env.VITE_API;

const ApiContext = createContext();

export function ApiProvider({ children }) {
  const { token } = useAuth();
  const [tags, setTags] = useState({});

  // Makes the actual fetch request to the API
  const request = async (endpoint, options = {}) => {
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    // Add Authorization header if token exists
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(API + endpoint, {
      ...options,
      headers,
    });

    // Check if response is JSON
    const contentType = response.headers.get("content-type");
    const isJson = contentType?.includes("application/json");

    if (!response.ok) {
      const result = isJson ? await response.json() : await response.text();
      throw Error(result.message || result || "Request failed");
    }

    // Don't try to parse empty responses
    if (response.status === 204 || !response.body) {
      return undefined;
    }

    // Return parsed JSON or undefined
    return isJson ? await response.json() : undefined;
  };

  // Stores a query function with a tag name
  const provideTag = (tag, queryFn) => {
    setTags((prev) => ({ ...prev, [tag]: queryFn }));
  };

  // Re-runs queries for the specified tags
  const invalidateTags = (tagsToInvalidate) => {
    tagsToInvalidate.forEach((tag) => {
      if (tags[tag]) {
        tags[tag](); // Call the query function to refetch
      }
    });
  };

  const value = { request, provideTag, invalidateTags };
  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}

export function useApi() {
  const context = useContext(ApiContext);
  if (!context) throw Error("useApi must be used within ApiProvider");
  return context;
}
