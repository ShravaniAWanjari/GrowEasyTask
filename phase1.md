Phase 1 — Backend: CSV Upload & Parsing API

Scope:

Express app skeleton: backend/src/app.ts (app config) + backend/src/server.ts (listen).
Middleware: CORS (configurable origin), JSON body parsing, request logging (e.g. morgan), centralized error-handling middleware, helmet for basic security headers.
Route: POST /api/csv/upload

Accept multipart/form-data file upload (use multer, memory storage, file size limit ~10–15MB, restrict to .csv mime/extension).
Parse CSV using a robust parser (e.g. papaparse or csv-parse) — must handle: varying headers, quoted fields with commas, BOM, trailing empty rows.
Do not assume fixed column names or order.
Return raw parsed rows + detected headers as JSON (no AI call here — this just powers the frontend preview step). Response shape:

json { "headers": ["Full Name","Email","Phone"], "rows": [ {...}, {...} ], "rowCount": 123 }

Error handling: invalid file type, empty CSV, malformed CSV, file too large — all return structured error JSON with clear message and appropriate HTTP status.
Health check route: GET /api/health.

Acceptance Criteria:

Uploading a valid CSV via curl/Postman returns headers + rows as JSON.
Uploading a non-CSV file is rejected with a clear 400 error.
Uploading a CSV with quoted commas/newlines inside fields parses correctly.
Empty file, huge file, and malformed CSV all fail gracefully (no server crash).
