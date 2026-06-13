# Debug Session: face-api-401 [OPEN]

## Symptom
- `POST https://saptamukha.com/api/face/analyze-batch` returns `401 Unauthorized` on Vercel.

## Expected
- Request should proxy successfully to the face service and return analysis JSON.

## Hypotheses
- H1: `HF_TOKEN` is missing in Vercel production, so the proxy forwards an empty or invalid bearer token.
- H2: The Hugging Face backend is rejecting the request because the proxy is not forwarding required auth or body headers correctly.
- H3: The deployed Vercel function file differs from the local code path being inspected, so production is running stale or mismatched API code.
- H4: The Hugging Face Space itself is now enforcing a different auth rule and rejects the bearer token being sent from Vercel.
- H5: The request is reaching the correct Vercel function, but the function runtime/body handling causes the upstream request to be malformed and interpreted as unauthorized.

## Plan
- Add instrumentation only.
- Capture whether the Vercel function receives the request, whether `HF_TOKEN` exists, and what upstream status comes back.
- Use the evidence to confirm or reject the hypotheses before making a fix.

## Evidence
- Live probe with `curl -X POST https://saptamukha.com/api/face/analyze-batch` returned:
  - HTTP status: `401`
  - Body: `{"error":"Face service error","details":"{\"detail\":\"unauthorized\"}"}`
- This confirms the request reaches the proxy and the proxy reaches the upstream face service.

## Hypothesis Status
- H1: Rejected. Production now reports `x-saptamukha-hf-token: present`.
- H2: Confirmed. The proxy was not forwarding `x-api-key`, while the Python backend requires it for `/analyze` and `/analyze-batch`.
- H3: Less likely, but still possible until the new trace-id instrumentation is visible in production.
- H4: Unlikely.
- H5: Less likely because upstream explicitly returns `unauthorized`, not a multipart/body parse error.

## Root Cause
- The face-service security middleware checks `request.headers.get("x-api-key", "")` for `/analyze` and `/analyze-batch`.
- The browser request included `x-api-key`, but the Vercel proxy only forwarded `Authorization: Bearer ${HF_TOKEN}`.
- Result: Hugging Face request reached the app, but the app returned `401 unauthorized`.

## Fix Applied
- Forward `X-API-Key` from the incoming request to the upstream face service.
- Forward `Content-Type` from the incoming request so multipart boundaries remain intact.
