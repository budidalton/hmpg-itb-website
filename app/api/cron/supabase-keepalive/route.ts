import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function unauthorizedResponse() {
  return NextResponse.json(
    { ok: false, error: "Unauthorized" },
    { status: 401 },
  );
}

function getCronSecretFromRequest(request: Request) {
  const url = new URL(request.url);
  const bearerToken = request.headers
    .get("authorization")
    ?.replace(/^Bearer\s+/i, "")
    .trim();
  const headerToken = request.headers.get("x-cron-secret")?.trim();
  const queryToken = url.searchParams.get("secret")?.trim();

  return bearerToken || headerToken || queryToken || "";
}

function getSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return null;
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

async function handleKeepalive(request: Request) {
  const configuredSecret = process.env.CRON_SECRET?.trim();

  if (!configuredSecret) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "CRON_SECRET is not configured. Set it before exposing this endpoint.",
      },
      { status: 500 },
    );
  }

  const providedSecret = getCronSecretFromRequest(request);

  if (providedSecret !== configuredSecret) {
    return unauthorizedResponse();
  }

  const startedAt = Date.now();

  if (process.env.CMS_FORCE_DEMO_MODE === "1") {
    return NextResponse.json({
      ok: true,
      mode: "demo",
      skipped: true,
      durationMs: Date.now() - startedAt,
      timestamp: new Date().toISOString(),
    });
  }

  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Supabase environment variables are incomplete. Keepalive did not run.",
      },
      { status: 500 },
    );
  }

  const { error, count } = await supabase
    .from("reports")
    .select("id", { count: "exact", head: true });

  if (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error.message,
        durationMs: Date.now() - startedAt,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    mode: "supabase",
    durationMs: Date.now() - startedAt,
    timestamp: new Date().toISOString(),
    checkedTable: "reports",
    reportCount: count ?? 0,
  });
}

export async function GET(request: Request) {
  return handleKeepalive(request);
}

export async function HEAD(request: Request) {
  const response = await handleKeepalive(request);
  return new Response(null, {
    status: response.status,
    headers: response.headers,
  });
}
