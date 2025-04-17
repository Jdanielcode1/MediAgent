import { ThemeProvider } from "next-themes";
import "../globals.css";

export const metadata = {
  title: "MediAgent - AI Sales Agents for Medical Device Companies",
  description: "Supercharge your medical device sales with AI-powered sales agents that qualify leads, personalize outreach, and close more deals.",
};

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}