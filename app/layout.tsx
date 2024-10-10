import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Link from 'next/link'

import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <header className="bg-gray-800 text-white p-4">
            <nav className="container mx-auto">
              <ul className="flex space-x-4">
                <li><Link href="/" className="hover:text-gray-300">Home</Link></li>
                <li><Link href="/Conversation" className="hover:text-gray-300">Conversation</Link></li>
                <li><Link href="/Image" className="hover:text-gray-300">Image</Link></li>
                <li><Link href="/Music" className="hover:text-gray-300">Music</Link></li>
                <li><Link href="/Video" className="hover:text-gray-300">Video</Link></li>
              </ul>
            </nav>
          </header>
          <main className="flex-grow container mx-auto p-4">
            {children}
          </main>
          <footer className="bg-gray-800 text-white p-4">
            <div className="container mx-auto text-center">
              © 2023 AI Generator SaaS. All rights reserved.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
