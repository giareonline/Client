"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useAlert } from "./AlertContext";

export default function GoogleLoginButton() {
    const { success, error: showError } = useAlert();

    const handleSuccess = async (credentialResponse: any) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/auth/google`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ credential: credentialResponse.credential }),
            });

            const data = await res.json();
            if (data.success) {
                // Lưu token
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                success("Đăng nhập thành công!");
                
                // delay slightly so the toast is readable before reload
                setTimeout(() => {
                    window.location.href = "/";
                }, 1000);
            } else {
                showError("Đăng nhập thất bại: " + data.message);
            }
        } catch (error) {
            console.error("Lỗi khi đăng nhập Google:", error);
            showError("Có lỗi xảy ra, vui lòng thử lại sau.");
        }
    };

    const handleError = () => {
        console.error("Đăng nhập Google thất bại!");
        showError("Đăng nhập Google thất bại!");
    };

    return (
        <div className="flex flex-col items-center justify-center p-4">
            <GoogleLogin
                onSuccess={handleSuccess}
                onError={handleError}
                useOneTap
            />
        </div>
    );
}
