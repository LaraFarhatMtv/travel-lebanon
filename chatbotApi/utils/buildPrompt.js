/**
 * Prompt Building Utility
 * 
 * This module constructs the augmented prompt for the Gemini model
 * following the RAG (Retrieval-Augmented Generation) approach.
 */

/**
 * System instructions for the Travel Lebanon chatbot
 * These ensure the bot only uses Directus data and doesn't hallucinate
 */
const SYSTEM_INSTRUCTIONS = `You are the Travel Lebanon assistant.
You must answer ONLY using the Directus data provided below.
If the answer is not inside the data, say: "I don't know based on our system data."
Do NOT use any outside knowledge.
Do NOT hallucinate.
If the user asks something not related to Lebanon or not present in the data, answer: "This information is not available in our system."

Additional guidelines:
- Be friendly and helpful in your responses
- Format responses clearly for tourists
- Include relevant details like prices, locations, and ratings when available
- If multiple options match the query, present them clearly
- Keep responses concise but informative`;

/**
 * Formats the Directus data into a readable string for the prompt
 * @param {Object} directusData - The data retrieved from Directus
 * @returns {string} - Formatted data string
 */
function formatDirectusData(directusData) {
  // If we have search results and all data, combine them intelligently
  if (directusData.searchResults && directusData.allData) {
    const formatted = {
      relevantResults: directusData.searchResults,
      availableData: directusData.allData,
    };
    return JSON.stringify(formatted, null, 2);
  }
  
  // Otherwise just stringify the data as-is
  return JSON.stringify(directusData, null, 2);
}

/**
 * Builds the complete augmented prompt for Gemini
 * @param {string} userQuestion - The user's question
 * @param {Object} directusData - The data retrieved from Directus
 * @returns {string} - The complete prompt to send to Gemini
 */
export function buildPrompt(userQuestion, directusData) {
  const formattedData = formatDirectusData(directusData);
  
  const prompt = `SYSTEM INSTRUCTIONS:
${SYSTEM_INSTRUCTIONS}

DIRECTUS DATA (JSON):
${formattedData}

USER QUESTION:
${userQuestion}

Please provide a helpful response based ONLY on the data above.`;

  return prompt;
}

/**
 * Builds a compact prompt with less data for faster responses
 * Use this when the full data is too large
 * @param {string} userQuestion - The user's question
 * @param {Object} directusData - The filtered/compact data from Directus
 * @returns {string} - The compact prompt
 */
export function buildCompactPrompt(userQuestion, directusData) {
  const formattedData = JSON.stringify(directusData, null, 2);
  
  const prompt = `SYSTEM INSTRUCTIONS:
${SYSTEM_INSTRUCTIONS}

AVAILABLE DATA:
${formattedData}

USER QUESTION:
${userQuestion}

Please provide a helpful, tourist-friendly response based ONLY on the data above.`;

  return prompt;
}

/**
 * Estimates the token count of a prompt (rough estimation)
 * @param {string} prompt - The prompt text
 * @returns {number} - Estimated token count
 */
export function estimateTokens(prompt) {
  // Rough estimation: ~4 characters per token
  return Math.ceil(prompt.length / 4);
}

/**
 * Validates that the prompt is within acceptable limits
 * @param {string} prompt - The prompt to validate
 * @param {number} maxTokens - Maximum allowed tokens (default: 30000)
 * @returns {boolean} - Whether the prompt is valid
 */
export function validatePromptSize(prompt, maxTokens = 30000) {
  const estimatedTokens = estimateTokens(prompt);
  return estimatedTokens <= maxTokens;
}

export default {
  buildPrompt,
  buildCompactPrompt,
  estimateTokens,
  validatePromptSize,
  SYSTEM_INSTRUCTIONS,
};

