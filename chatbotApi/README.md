# Travel Lebanon Chatbot API

A RAG (Retrieval-Augmented Generation) chatbot backend that uses **Directus** as the data source and **Google Gemini** as the LLM.

## Features

- 🔍 **RAG Architecture**: Queries Directus for relevant data before generating responses
- 🤖 **Gemini Integration**: Uses Google's Gemini Pro model for natural language generation
- 🔒 **Read-Only**: Never mutates Directus data
- 🎯 **Strict Grounding**: Only answers based on Directus data, never hallucinates

## File Structure

```
chatbotApi/
├── index.js              # Express server & /chatbot endpoint
├── package.json          # Dependencies & scripts
├── .env                  # Environment variables (create from instructions below)
├── README.md             # This file
└── utils/
    ├── getDirectusData.js   # Directus query utilities
    └── buildPrompt.js       # Prompt construction utilities
```

## Setup

### 1. Install Dependencies

```bash
cd chatbotApi
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `chatbotApi` folder:

```env
PORT=4000

# Gemini API Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# Directus Configuration
DIRECTUS_URL=https://your-directus-domain.com
DIRECTUS_TOKEN=your_directus_read_token_here

# Collections to query (comma-separated)
DIRECTUS_COLLECTIONS=Items,Drivers,Category,SubCategory
```

**Important**: Replace the placeholder values with your actual credentials:
- `GEMINI_API_KEY`: Your Google Gemini API key
- `DIRECTUS_URL`: Your Directus instance URL (e.g., `https://your-project.directus.app`)
- `DIRECTUS_TOKEN`: A read-only Directus access token
- `DIRECTUS_COLLECTIONS`: Comma-separated list of collection names to search

### 3. Run the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:4000`

## API Endpoints

### POST /chatbot

Main chatbot endpoint.

**Request:**
```json
{
  "question": "What is a good place to go for Valentine's?"
}
```

**Response:**
```json
{
  "answer": "Based on our data, here are some romantic options..."
}
```

### GET /health

Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "service": "Travel Lebanon Chatbot API",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### GET /debug/directus

Debug endpoint to test Directus connection (development only).

## Connecting to Frontend

The frontend `ChatBot.tsx` component is already configured to connect to this API at `http://localhost:4000`.

To customize the API URL, set the `VITE_CHATBOT_API_URL` environment variable in your frontend `.env` file:

```env
VITE_CHATBOT_API_URL=http://localhost:4000
```

## Adjusting Collections

To change which Directus collections are queried:

1. Update the `DIRECTUS_COLLECTIONS` environment variable
2. Restart the server

Example:
```env
DIRECTUS_COLLECTIONS=Items,Drivers,Category,SubCategory,Bookings,Review
```

## Behavior Rules

The chatbot:
- ✅ Is read-only (never mutates Directus)
- ✅ Only uses data from Directus collections
- ✅ Refuses to answer questions not in the data
- ✅ Provides tourist-friendly responses
- ❌ Never guesses or halluccinates answers
- ❌ Never uses external knowledge

## Troubleshooting

### "DIRECTUS_URL or DIRECTUS_TOKEN is not configured"
Make sure your `.env` file exists and contains valid values.

### "Error fetching collection"
- Check that your Directus URL is correct
- Verify the collection names match your Directus setup
- Ensure the token has read access to the collections

### "API key" errors
Verify your Gemini API key is valid and has quota available.

## Running Both Frontend & Backend

1. **Terminal 1 - Backend:**
   ```bash
   cd chatbotApi
   npm run dev
   ```

2. **Terminal 2 - Frontend:**
   ```bash
   cd ..
   npm run dev
   ```

The chatbot will now be fully functional!

