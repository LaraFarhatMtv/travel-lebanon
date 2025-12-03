/**
 * Travel Lebanon Chatbot API
 *
 * Backend service that implements RAG (Retrieval-Augmented Generation)
 * using Directus as the data source and Google Gemini as the LLM.
 *
 * This is a READ-ONLY service that never mutates Directus data.
 */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  getDirectusData,
  getDirectusDataCompact,
} from "./utils/getDirectusData.js";
import {
  buildPrompt,
  buildCompactPrompt,
  validatePromptSize,
} from "./utils/buildPrompt.js";

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ["GEMINI_API_KEY", "DIRECTUS_URL", "DIRECTUS_TOKEN"];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 4000;

// Initialize Google Generative AI (Gemini)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

/**
 * Health check endpoint
 */
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "Travel Lebanon Chatbot API",
    timestamp: new Date().toISOString(),
  });
});

/**
 * Main chatbot endpoint
 * POST /chatbot
 *
 * Request body:
 * {
 *   "question": "What is a good place to go for Valentine's?"
 * }
 *
 * Response:
 * {
 *   "answer": "<BOT_REPLY>"
 * }
 */
app.post("/chatbot", async (req, res) => {
  try {
    const { question } = req.body;

    // Validate input
    if (!question || typeof question !== "string" || !question.trim()) {
      return res.status(400).json({
        error: "Invalid request",
        message: 'Please provide a valid "question" in the request body',
      });
    }

    const trimmedQuestion = question.trim();
    console.log(`\n[Chatbot] Received question: "${trimmedQuestion}"`);

    // Step 1: Query Directus for relevant data
    console.log("[Chatbot] Fetching data from Directus...");
    let directusData;
    let useCompactMode = false;

    try {
      // First try to get full data
      directusData = await getDirectusData(trimmedQuestion);
    } catch (directusError) {
      console.error(
        "[Chatbot] Error fetching Directus data:",
        directusError.message
      );
      // Try compact mode as fallback
      useCompactMode = true;
      directusData = await getDirectusDataCompact(trimmedQuestion);
    }

    // Step 2: Build the augmented prompt
    console.log("[Chatbot] Building augmented prompt...");
    let prompt;

    if (useCompactMode) {
      prompt = buildCompactPrompt(trimmedQuestion, directusData);
    } else {
      prompt = buildPrompt(trimmedQuestion, directusData);
    }

    // Check prompt size and switch to compact mode if too large
    if (!validatePromptSize(prompt)) {
      console.log("[Chatbot] Prompt too large, switching to compact mode...");
      directusData = await getDirectusDataCompact(trimmedQuestion);
      prompt = buildCompactPrompt(trimmedQuestion, directusData);
    }

    // Step 3: Send request to Gemini
    console.log("[Chatbot] Sending request to Gemini...");
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const answer = response.text();

    console.log("[Chatbot] Response generated successfully");

    // Step 4: Return the response
    return res.json({
      answer: answer,
    });
  } catch (error) {
    console.error("[Chatbot] Error processing request:", error);

    // Handle specific Gemini API errors
    if (error.message?.includes("API key")) {
      return res.status(500).json({
        error: "Configuration error",
        message:
          "There is an issue with the AI service configuration. Please try again later.",
      });
    }

    if (
      error.message?.includes("quota") ||
      error.message?.includes("rate limit")
    ) {
      return res.status(429).json({
        error: "Rate limit exceeded",
        message: "Too many requests. Please try again in a moment.",
      });
    }

    // Generic error response
    return res.status(500).json({
      error: "Internal server error",
      message: "An unexpected error occurred. Please try again later.",
    });
  }
});

/**
 * Debug endpoint to check Directus connection (development only)
 */
app.get("/debug/directus", async (req, res) => {
  if (process.env.NODE_ENV === "production") {
    return res.status(404).json({ error: "Not found" });
  }

  try {
    const collectionsEnv =
      process.env.DIRECTUS_COLLECTIONS || "Items,Drivers,Category,SubCategory";
    const collections = collectionsEnv.split(",").map((c) => c.trim());

    const data = await getDirectusDataCompact("");

    return res.json({
      status: "connected",
      directusUrl: process.env.DIRECTUS_URL,
      configuredCollections: collections,
      sampleData: data,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Not found",
    message: `Endpoint ${req.method} ${req.path} does not exist`,
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error("[Server] Unhandled error:", error);
  res.status(500).json({
    error: "Internal server error",
    message: "An unexpected error occurred",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🇱🇧 Travel Lebanon Chatbot API`);
  console.log(`   Server running on http://localhost:${PORT}`);
  console.log(`   Endpoints:`);
  console.log(`   - POST /chatbot     - Main chatbot endpoint`);
  console.log(`   - GET  /health      - Health check`);
  console.log(
    `   - GET  /debug/directus - Directus connection test (dev only)\n`
  );
});

export default app;
