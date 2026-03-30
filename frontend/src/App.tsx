import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import QuoteEmailForm from './components/QuoteEmailForm';
import Header from './components/Header';
import Footer from './components/Footer';

const queryClient = new QueryClient();

function AppContent() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-accent/5">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <QuoteEmailForm />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AppContent />
    </ThemeProvider>
  );
}
