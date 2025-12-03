/**
 * Directus Data Fetching Utility
 * 
 * This module handles all read-only queries to Directus collections.
 * Easily adjustable collection names via environment variables or parameters.
 */

/**
 * Fetches data from a single Directus collection with optional search
 * @param {string} collection - The collection name to query
 * @param {string} searchQuery - Optional search term
 * @returns {Promise<Array>} - Array of items from the collection
 */
export async function fetchCollection(collection, searchQuery = '') {
  const directusUrl = process.env.DIRECTUS_URL;
  const directusToken = process.env.DIRECTUS_TOKEN;

  if (!directusUrl || !directusToken) {
    throw new Error('DIRECTUS_URL or DIRECTUS_TOKEN is not configured');
  }

  // Build the query URL with search parameter if provided
  let url = `${directusUrl}/items/${collection}?limit=100`;
  
  if (searchQuery && searchQuery.trim()) {
    // Use Directus search functionality
    url += `&search=${encodeURIComponent(searchQuery)}`;
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${directusToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error fetching ${collection}:`, response.status, errorText);
      return [];
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error(`Error fetching collection ${collection}:`, error.message);
    return [];
  }
}

/**
 * Fetches data from multiple Directus collections
 * @param {string[]} collections - Array of collection names to query
 * @param {string} searchQuery - Optional search term
 * @returns {Promise<Object>} - Object with collection names as keys and data arrays as values
 */
export async function fetchMultipleCollections(collections, searchQuery = '') {
  const results = {};

  // Fetch all collections in parallel for better performance
  const fetchPromises = collections.map(async (collection) => {
    const data = await fetchCollection(collection, searchQuery);
    return { collection, data };
  });

  const fetchResults = await Promise.all(fetchPromises);

  for (const result of fetchResults) {
    results[result.collection] = result.data;
  }

  return results;
}

/**
 * Gets relevant data from Directus based on user question
 * This is the main function called by the chatbot endpoint
 * @param {string} question - The user's question
 * @returns {Promise<Object>} - All relevant data from Directus
 */
export async function getDirectusData(question) {
  // Get collections from environment variable or use defaults
  const collectionsEnv = process.env.DIRECTUS_COLLECTIONS || 'Items,Drivers,Category,SubCategory';
  const collections = collectionsEnv.split(',').map(c => c.trim()).filter(Boolean);

  console.log(`Querying Directus collections: ${collections.join(', ')}`);
  console.log(`Search query: "${question}"`);

  // Fetch data from all configured collections with the search query
  const searchResults = await fetchMultipleCollections(collections, question);

  // Also fetch all data without search to ensure we have complete context
  // This is useful when the search doesn't return relevant results
  const allResults = await fetchMultipleCollections(collections, '');

  // Combine results: prioritize search results but include all data as context
  const combinedResults = {
    searchResults: searchResults,
    allData: allResults,
    metadata: {
      query: question,
      timestamp: new Date().toISOString(),
      collections: collections,
    }
  };

  return combinedResults;
}

/**
 * Simplified data fetch for smaller context
 * Only returns data matching the search to reduce token usage
 * @param {string} question - The user's question
 * @returns {Promise<Object>} - Matching data from Directus
 */
export async function getDirectusDataCompact(question) {
  const collectionsEnv = process.env.DIRECTUS_COLLECTIONS || 'Items,Drivers,Category,SubCategory';
  const collections = collectionsEnv.split(',').map(c => c.trim()).filter(Boolean);

  // Only fetch search results for compact mode
  const searchResults = await fetchMultipleCollections(collections, question);

  // Filter out empty collections
  const filteredResults = {};
  for (const [collection, data] of Object.entries(searchResults)) {
    if (data && data.length > 0) {
      filteredResults[collection] = data;
    }
  }

  return filteredResults;
}

export default {
  fetchCollection,
  fetchMultipleCollections,
  getDirectusData,
  getDirectusDataCompact,
};

