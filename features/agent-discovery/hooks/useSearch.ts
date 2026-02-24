import { useState, useEffect } from "react";
import { searchAgents } from "../services/searchService";

export const useSearch = (initialQuery = "", initialFilters = {}) => {
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState(initialFilters);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // Ensure error is a string or null

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await searchAgents(query, filters);
        setResults(data);
      } catch (err) {
        setError((err as Error).message || "An unknown error occurred"); // Cast err to Error and extract message
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, filters]);

  return { query, setQuery, filters, setFilters, results, loading, error };
};
