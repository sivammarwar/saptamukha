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
- H1: Pending verification via deployed `tokenPresent` instrumentation.
- H2: Plausible.
- H3: Less likely, but still possible until the new trace-id instrumentation is visible in production.
- H4: Plausible.
- H5: Less likely because upstream explicitly returns `unauthorized`, not a multipart/body parse error.
