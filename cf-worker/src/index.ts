import { sendEmail } from "./lib/resend.js";
import { corsHeaders, handleCors } from "./lib/cors.js";
import { checkRateLimit } from "./lib/ratelimit.js";

export interface Env {
  RESEND_API_KEY: string;
  SENDER_DOMAIN: string;
  RATE_LIMIT_KV: KVNamespace;
  TURNSTILE_SECRET: string;
  RATE_LIMIT_MAX?: string;
  RATE_LIMIT_WINDOW_MINUTES?: string;
  EMAIL_ENABLED?: string;
}

async function verifyTurnstile(
  token: string,
  secret: string,
  ip?: string
): Promise<boolean> {
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.append("remoteip", ip);
  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      body,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }
  );
  const data = (await res.json()) as {
    success: boolean;
    "error-codes"?: string[];
  };
  return data.success === true;
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    // Feature toggle: disable email endpoint entirely
    if (env.EMAIL_ENABLED === "false") {
      return jsonResponse(
        { ok: false, error: "Email endpoint is currently disabled." },
        503
      );
    }

    const cors = handleCors(request);
    if (cors) return cors;

    if (request.method !== "POST") {
      return jsonResponse({ ok: false, error: "Method not allowed" }, 405);
    }

    const url = new URL(request.url);
    if (url.pathname !== "/send") {
      return jsonResponse({ ok: false, error: "Not found" }, 404);
    }

    let body: any;
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ ok: false, error: "Invalid JSON" }, 400);
    }

    // Honeypot check
    if (body.website && String(body.website).trim()) {
      return jsonResponse({ ok: false, error: "Invalid request." }, 400);
    }

    // Turnstile check
    if (!body.turnstileToken || typeof body.turnstileToken !== "string") {
      return jsonResponse(
        { ok: false, error: "Anti-spam verification required." },
        400
      );
    }

    const clientIp = request.headers.get("CF-Connecting-IP") || "";
    const turnstileOk = await verifyTurnstile(
      body.turnstileToken,
      env.TURNSTILE_SECRET,
      clientIp
    );
    if (!turnstileOk) {
      return jsonResponse(
        { ok: false, error: "Anti-spam verification failed." },
        403
      );
    }

    // Rate limit check (disabled when RATE_LIMIT_MAX === "0")
    const rateLimitMax = Number(env.RATE_LIMIT_MAX ?? "2");
    const rateLimitWindow = Number(env.RATE_LIMIT_WINDOW_MINUTES ?? "15");
    if (rateLimitMax !== 0) {
      const rateLimit = await checkRateLimit(
        env.RATE_LIMIT_KV,
        clientIp || "unknown",
        rateLimitMax,
        rateLimitWindow
      );
      if (!rateLimit.allowed) {
        return jsonResponse(
          {
            ok: false,
            error: `Rate limit: maximum ${rateLimitMax} messages per ${rateLimitWindow} minutes from one IP.`,
            retryAfterSeconds: rateLimit.retryAfterSeconds,
          },
          429,
          { "Retry-After": String(rateLimit.retryAfterSeconds) }
        );
      }
    }

    const { to, from, subject, text, html, replyTo } = body;

    if (!to || !subject || (!text && !html)) {
      return jsonResponse(
        {
          ok: false,
          error: "Missing required fields: to, subject, text or html",
        },
        400
      );
    }

    if (!from || !from.endsWith(`@${env.SENDER_DOMAIN}`)) {
      return jsonResponse(
        {
          ok: false,
          error: `Invalid from address. Must use @${env.SENDER_DOMAIN}`,
        },
        400
      );
    }

    try {
      const result = await sendEmail(env.RESEND_API_KEY, {
        from,
        to,
        subject,
        text,
        html,
        replyTo,
      });

      return jsonResponse({ ok: true, id: result.id }, 200);
    } catch (err: any) {
      return jsonResponse(
        { ok: false, error: err.message || "Internal error" },
        500
      );
    }
  },
};

function jsonResponse(
  data: unknown,
  status: number,
  extraHeaders?: Record<string, string>
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(),
      ...(extraHeaders || {}),
    },
  });
}
