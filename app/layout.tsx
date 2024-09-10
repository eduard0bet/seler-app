'use client'
import "./globals.css";
import { useEffect, useState } from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

export default function RootLayout({ children }: { children: React.ReactNode; }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <html className="scroll-smooth focus:scroll-auto">
      <body suppressHydrationWarning={true} className="">
        {isClient && (
          <NextThemesProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            
              {children}
          
          </NextThemesProvider>
        )}
      </body>
    </html>
  );
}
