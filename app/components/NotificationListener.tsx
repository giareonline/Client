"use client";

import { useEffect, useRef } from "react";
import { useAlert } from "./AlertContext";
import { API_URL } from "@/app/lib/axios";
import { refreshUserData } from "@/app/hooks/api/useAuth";

export default function NotificationListener() {
  const alert = useAlert();
  const alertRef = useRef(alert);
  alertRef.current = alert;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const abortController = new AbortController();

    const connectSSE = async () => {
      try {
        const response = await fetch(`${API_URL}/notifications/stream`, {
          signal: abortController.signal,
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "text/event-stream",
          },
        });

        if (!response.ok) return;

        const reader = response.body?.getReader();
        const decoder = new TextDecoder("utf-8");

        if (!reader) return;

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const dataStr = line.replace("data: ", "").trim();
              if (!dataStr) continue;

              try {
                const data = JSON.parse(dataStr);
                
                if (data.type === "PAYMENT_SUCCESS") {
                  alertRef.current.success(`🎉 Bạn vừa nhận được ${data.payload.starsAdded} Sao!`);
                  
                  try {
                    const audio = new Audio('/success-sound.mp3');
                    audio.volume = 0.5;
                    audio.play().catch(() => {});
                  } catch (e) {}

                  // Cập nhật số dư qua helper tập trung
                  await refreshUserData();
                }
              } catch (e) {
                console.error("Lỗi parse SSE data", e);
              }
            }
          }
        }
      } catch (err) {
        if (abortController.signal.aborted) return;
        // Tự động kết nối lại sau 5s nếu mất mạng
        setTimeout(connectSSE, 5000);
      }
    };

    connectSSE();

    return () => {
      abortController.abort();
    };
  }, []); // Empty deps — chỉ mount 1 lần

  return null;
}
