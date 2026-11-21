import { issuePowChallenge } from "../../../../lib/pow-server";
import { getClientIp, rateLimit, rateLimitResponse } from "../../../../lib/rate-limit";

export const runtime = "nodejs";

// A challenge is cheap to issue but rate-limited so bots cannot farm them.
export async function GET(req: Request) {
  const ip = getClientIp(req);
  const limit = await rateLimit(`rl:pow:${ip}`, 30, 60);
  if (!limit.ok) {
    return rateLimitResponse(limit, "Too many challenge requests. Please wait a minute.");
  }

  return Response.json(issuePowChallenge(), {
    headers: { "Cache-Control": "no-store" }
  });
}
