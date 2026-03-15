import "./globals.css";

import AuthProvider from "./components/AuthProvider";
import Providers from "./providers";
import { AlertProvider } from "./components/AlertContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="bg-gray-100">
        <Providers>
          <AlertProvider>
            <AuthProvider>{children}</AuthProvider>
          </AlertProvider>
        </Providers>
      </body>
    </html>
  );
}
