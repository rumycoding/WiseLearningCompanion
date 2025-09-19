import { useQuery } from '@tanstack/react-query';

interface WordDefinitionResult {
  success: boolean;
  data?: {
    definition: string;
    examples: string[];
  };
}

const httpAddress = `${window.location.protocol}//${window.location.hostname}:8090`

// Function to fetch word definition from backend
const fetchWordDefinition = async (word: string, lang: string, difficulty?: string): Promise<WordDefinitionResult> => {
  const response = await fetch(`${httpAddress}/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ word, lang, difficulty })
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

/**
 * Custom hook to fetch word definition with React Query
 * @param word - The word to search for
 * @param lang - Language preference ('zh' for Chinese, 'en' for English)
 * @param difficulty - Difficulty level ('beginner', 'intermediate', 'advanced')
 * @param enabled - Whether the query should be enabled (default: true)
 * @returns Query result with data, loading state, and error
 */
export const useWordDefinition = (word: string, lang: string, difficulty?: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['wordDefinition', word, lang],
    queryFn: () => fetchWordDefinition(word, lang, difficulty),
    enabled: enabled && !!word, // Only run query if enabled and word exists
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
    retry: 2, // Retry failed requests twice
    retryDelay: 1000, // Wait 1 second between retries
  });
};