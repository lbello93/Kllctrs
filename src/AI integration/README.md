# AI integration

This folder contains the server-side chatbot integration used by the active `/api/chat` route.

- `chat-handler.ts` validates requests, applies rate limits, calls Gemini, executes tools, collects source links, and saves conversations.
- `config.ts` configures the Gemini client and model. Keep API credentials in environment variables.
- `prompts/`, `context-builder.ts`, `context-merger.ts`, and `history.ts` build model instructions and conversation context.
- `tools/` defines and executes data lookup tools; `services/` and `formatters/` provide supporting lookups and response formatting.

The Next.js route remains in `src/app/api/chat/route.ts` and delegates to `handleChatPost`. The chat UI is in `src/page-components/ChatPage/`.

## Admin AI handlers

Admin content generation is isolated here: `admin/blog/generate.ts`, `admin/blog/generate-news.ts`, `admin/blog/social.ts`, and `admin/content-studio-generate.ts`. The matching Next.js route adapters stay in `src/app/api/admin` and re-export these handlers.
