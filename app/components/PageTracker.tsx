"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useTrackPageView } from "@/app/hooks/api/useTracking";

function generateSessionId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export default function PageTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [sessionId, setSessionId] = useState<string>("");
  const trackMutation = useTrackPageView();

  useEffect(() => {
    // Get or create session ID
    let currentSessionId = sessionStorage.getItem("giareonline_session_id");
    if (!currentSessionId) {
      currentSessionId = generateSessionId();
      sessionStorage.setItem("giareonline_session_id", currentSessionId);
    }
    setSessionId(currentSessionId);
  }, []);

  useEffect(() => {
    if (!sessionId || !pathname) return;

    const fullPath = searchParams?.toString() ? `${pathname}?${searchParams.toString()}` : pathname;
    
    let userId = null;
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        userId = user._id;
      }
    } catch (e) {}

    trackMutation.mutate({
      path: fullPath,
      sessionId,
      referrer: document.referrer,
      userId,
    });
  }, [pathname, searchParams, sessionId]);

  return null;
}
