"use client";

import { useEffect } from "react";

function hasRecoveryParams(url: URL) {
  const hashParams = new URLSearchParams(url.hash.replace(/^#/, ""));

  return (
    hashParams.get("type") === "recovery" ||
    Boolean(hashParams.get("access_token")) ||
    Boolean(hashParams.get("refresh_token")) ||
    url.searchParams.get("type") === "recovery" ||
    Boolean(url.searchParams.get("token_hash")) ||
    Boolean(url.searchParams.get("code"))
  );
}

export function AuthRecoveryRedirect() {
  useEffect(() => {
    const url = new URL(window.location.href);

    if (!hasRecoveryParams(url)) {
      return;
    }

    const target = `/dashboard/reset-password/complete${url.search}${url.hash}`;
    window.location.replace(target);
  }, []);

  return null;
}
