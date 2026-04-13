import "./globals.css";
import EnvConfigChecker from "@/components/EnvConfigChecker";
import localFont from "next/font/local";

const fontSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
});

const fontDisplay = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-space-grotesk",
  weight: "100 900",
  display: "swap",
});

const fontMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-jetbrains-mono",
  weight: "100 900",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>LumenX Studio</title>
        <meta name="description" content="AI-Native Motion Comic Creation Platform" />
      </head>
      <body
        className={`${fontSans.variable} ${fontDisplay.variable} ${fontMono.variable} font-sans bg-background text-foreground antialiased`}
      >
        <EnvConfigChecker />
        {children}
      </body>
    </html>
  );
}
