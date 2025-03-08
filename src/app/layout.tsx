import "./globals.css"
import { Inter } from "next/font/google"
import type React from "react"
import type { Metadata } from "next"
import MouseMoveEffect from "@/components/mouse-move-effect"
import { ClerkProvider} from "@clerk/nextjs"
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Finance Fusion",
  description: "Amane Soft delivers innovative, high-performance software solutions for businesses of the future.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
        <html lang="en" className="dark">
          <body className={`${inter.className} bg-background text-foreground antialiased`}>
            <MouseMoveEffect />
            <Toaster position="bottom-center" />
            {children}
          </body>
        </html>
    </ClerkProvider>
  )
}

