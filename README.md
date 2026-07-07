# GrowEasy AI CSV Importer

An AI-powered CSV Importer that maps arbitrary CSV formats (Facebook/Google Ads exports, real estate CRM exports, sales reports, manual spreadsheets) into GrowEasy's fixed CRM schema.

## Monorepo Layout

- [/frontend](file:///c:/Users/shrav/Desktop/12%20week%20thing/GrowEasyTask/frontend) - Next.js frontend (deployed to Vercel)
- [/backend](file:///c:/Users/shrav/Desktop/12%20week%20thing/GrowEasyTask/backend) - Node/Express backend (deployed to Render)

## Architecture Diagram

```
+------------------+         REST API         +-------------------+
|                  | -----------------------> |                   |
| Next.js Frontend |                          |   Express Backend |
|                  | <----------------------- |                   |
+------------------+     JSON (CRM schema)    +-------------------+
                                                        |
                                                        v
                                              +-------------------+
                                              |                   |
                                              |   AI Provider     |
                                              | (OpenAI / Gemini) |
                                              +-------------------+
```

## Setup & Running

Refer to the READMEs in `/frontend` and `/backend` for specific details.
- Frontend: [frontend/README.md](file:///c:/Users/shrav/Desktop/12%20week%20thing/GrowEasyTask/frontend/README.md)
- Backend: [backend/README.md](file:///c:/Users/shrav/Desktop/12%20week%20thing/GrowEasyTask/backend/README.md)
