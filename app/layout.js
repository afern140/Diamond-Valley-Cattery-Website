import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "./navbar/page";
import Footer from "./footer/page";
import { AuthContextProvider } from "./_utils/auth-context";
import { UserProvider } from "./_utils/user_services";
import { ChatProvider } from "./_utils/chat-context";

import { ThemeProvider } from "next-themes";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Diamond Valley Cattery",
  description: "Diamond Valley Cattery",
};

export default function RootLayout({ children }) {
  return (
    <AuthContextProvider>
      <UserProvider>
        <ChatProvider>
          <html lang="en">
            <body className={inter.className}>
              <ThemeProvider
              attribute="class"
              enableSystem="false">
                <Navigation />
                {children}
                <Footer />
              </ThemeProvider>
            </body>
          </html>
        </ChatProvider>
      </UserProvider>
    </AuthContextProvider>
  );
}
