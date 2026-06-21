import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppContextProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "StudyNook — Book Your Perfect Study Room",
  description: "Discover and book quiet, private study rooms in your university library. List your own space, manage bookings, and boost your productivity.",
  keywords: "study room, library booking, university, workspace",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
        <AppContextProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <Footer />
          <Toaster
            position="top-center"
            gutter={12}
            toastOptions={{
              duration: 4000,
              style: {
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: "500",
                padding: "12px 16px",
                boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
                maxWidth: "400px",
              },
              success: {
                style: {
                  background: "#f0fdf4",
                  color: "#166534",
                  border: "1px solid #bbf7d0",
                },
                iconTheme: { primary: "#16a34a", secondary: "#f0fdf4" },
              },
              error: {
                style: {
                  background: "#fef2f2",
                  color: "#991b1b",
                  border: "1px solid #fecaca",
                },
                iconTheme: { primary: "#dc2626", secondary: "#fef2f2" },
              },
            }}
          />
        </AppContextProvider>
      </body>
    </html>
  );
}
