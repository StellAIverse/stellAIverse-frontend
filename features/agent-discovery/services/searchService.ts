import algoliasearch from 'algoliasearch';

const client = algoliasearch(
  process.env.ALGOLIA_APP_ID || '',
  process.env.ALGOLIA_API_KEY || ''
);

const index = client.initIndex(process.env.ALGOLIA_INDEX_NAME || '');

export const searchAgents = async (query: string, filters: any) => {
  try {
    const response = await index.search(query, {
      filters: Object.entries(filters)
        .map(([key, value]) => `${key}:${value}`)
        .join(' AND '),
    });
    return response.hits;
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
};