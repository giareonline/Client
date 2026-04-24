"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useAlert } from "./AlertContext";
import { useGoogleLogin } from "@/app/hooks/api/useAuth";

export default function GoogleLoginButton() {
    const { success, error: showError } = useAlert();
    const loginMutation = useGoogleLogin();

    const handleSuccess = async (credentialResponse: any) => {
        loginMutation.mutate(credentialResponse.credential, {
            onSuccess: (data) => {
                if (data.success) {
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
            },
            onError: (err) => {
                console.error("Lỗi khi đăng nhập Google:", err);
                showError("Có lỗi xảy ra, vui lòng thử lại sau.");
            },
        });
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
            />
        </div>
    );
}
