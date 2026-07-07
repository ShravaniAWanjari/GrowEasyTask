Phase 2 — AI Extraction Engine (Core Differentiator)

Scope: This is the highest-weighted evaluation area — invest the most care here.

Create backend/src/services/aiExtractor.ts.
Support a pluggable AI provider (AI_PROVIDER=openai|gemini|anthropic) via a small adapter interface, so the choice of LLM is swappable without touching business logic.
Batching: split incoming rows into batches (configurable batch size, e.g. 20–30 rows per call) to stay within model context/token limits and to allow partial-failure isolation.
Prompt design (backend/src/prompts/crmExtraction.ts):

System prompt encodes: the full CRM schema with field descriptions, the two enums (crm_status, data_source) with exact allowed values, the date format constraint, the multi-email/multi-mobile merge rule, the skip-if-no-email-and-no-mobile rule, and an instruction to respond with strict JSON only (no prose, no markdown fences).
Include the sample CRM records from the assignment as few-shot examples in the prompt.
User message per batch: the raw row objects (headers + values) as JSON, asking the model to map each row to the CRM schema, in the same order, returning an array of the same length as the input batch (so skipped rows can be flagged rather than silently dropped mid-batch — have the model return null or a {skip: true, reason} marker for rows it thinks should be skipped, and let your code make the final skip decision using the hard rule).

Response parsing:

Strip any accidental markdown code fences before JSON.parse.
Validate the parsed response is an array of the expected length; if not, treat the batch as failed and retry (see below).

Post-processing / validation layer (backend/src/services/validateRecord.ts) — deterministic code, not AI:

Enforce crm_status enum (blank if invalid).
Enforce data_source enum (blank if invalid).
Validate created_at with new Date(); blank if Invalid Date.
Enforce the skip rule (no email AND no mobile → skip, with reason recorded).
Sanitize all fields to remove raw newlines (replace with \n escape or space) to keep CSV-safety.

Retry mechanism: if a batch fails (API error, malformed JSON, wrong array length), retry up to N times (e.g. 2) with exponential backoff before marking the whole batch's rows as skipped with reason "ai_processing_failed".
Concurrency: process batches with limited concurrency (e.g. 2–3 in parallel) to balance speed vs. rate limits.

Acceptance Criteria:

Given a CSV with unconventional headers (e.g. Full Name, Contact Number, Email Address, Lead Status Notes), the extractor correctly maps to CRM fields.
Given a row with two emails in one field, first is used in email, second appended to crm_note.
Given a row with no email and no phone, it's excluded from results and counted as skipped with a reason.
Given an ambiguous crm_status value from source data (e.g. "Interested", "Follow up later"), AI maps it to the closest allowed enum or leaves blank — never invents a new status string (verified by test, not just prompt).
A simulated AI failure (mock a thrown error) triggers retry then graceful partial failure, not a crash.
