import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./header/header";
import Footer from "./footer/page";
import { AuthContextProvider } from "./_utils/auth-context";
import { ChatProvider } from "./_utils/chat-context";

import { ThemeProvider } from "next-themes";
import CustomCursor from "@/app/components/CustomCursor";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Diamond Valley Cattery",
  description: "Diamond Valley Cattery",
};

export default function RootLayout({ children }) {

  let contrastVal = 1;

  return (
    <AuthContextProvider>
      <ChatProvider>
        <html lang="en">
          <body id="body" className={inter.className + ` contrast-[${contrastVal}]`}>
            <ThemeProvider
            attribute="class"
            enableSystem="false">
			  <Header />
              {children}
              <Footer />
            </ThemeProvider>
          </body>
        </html>
      </ChatProvider>
    </AuthContextProvider>
  );
}
