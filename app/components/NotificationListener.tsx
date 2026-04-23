"use client";

import { useEffect, useState } from "react";
import { useAlert } from "./AlertContext";

export default function NotificationListener() {
  const alert = useAlert();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Chỉ kết nối khi có token
    const token = localStorage.getItem("token");
    if (!token) return;

    // Trong Fetch API không hỗ trợ stream tốt bằng EventSource, 
    // nhưng EventSource nguyên bản không hỗ trợ truyền Custom Header (như Authorization).
    // Nên chúng ta tạo token query string ngắn hạn hoặc dùng polyfill. 
    // Tuy nhiên, để đơn giản và hoạt động trên browser, ta có thể dùng Fetch kết hợp ReadableStream
    // hoặc một thư viện SSE nhỏ. Ở đây ta dùng Fetch ReadableStream để tự xử lý SSE.
    
    const abortController = new AbortController();

    const connectSSE = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/notifications/stream`, {
          signal: abortController.signal,
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "text/event-stream",
          },
        });

        if (!response.ok) return;

        const reader = response.body?.getReader();
        const decoder = new TextDecoder("utf-8");
        setIsConnected(true);

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
                  // Hiển thị thông báo Toast
                  alert.success(`🎉 Bạn vừa nhận được ${data.payload.starsAdded} Sao!`);
                  
                  // Chơi một âm thanh nhỏ (tuỳ chọn)
                  try {
                    const audio = new Audio('/success-sound.mp3'); // File có thể chưa tồn tại, thêm try/catch
                    audio.volume = 0.5;
                    audio.play().catch(() => {});
                  } catch (e) {}

                  // Cập nhật lại số dư trên frontend
                  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                  });
                  
                  if (res.ok) {
                    const meData = await res.json();
                    localStorage.setItem("user", JSON.stringify(meData.user));
                    // Phát event để Header tự update
                    window.dispatchEvent(new Event("userUpdated"));
                  }
                }
              } catch (e) {
                console.error("Lỗi parse SSE data", e);
              }
            }
          }
        }
      } catch (err) {
        setIsConnected(false);
        // Tự động kết nối lại sau 5s nếu mất mạng
        setTimeout(connectSSE, 5000);
      }
    };

    connectSSE();

    return () => {
      abortController.abort();
    };
  }, []); // Remove alert from dependency array to prevent infinite loop

  return null; // Component này chạy ẩn, không render UI
}
