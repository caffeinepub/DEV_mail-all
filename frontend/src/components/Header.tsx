import { Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <header className="w-full border-b border-border/40 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center gap-3">
          <div className="relative">
            <Sparkles className="w-8 h-8 text-primary" />
            <div className="absolute inset-0 blur-xl bg-primary/30 animate-pulse" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
            Random Quote Email
          </h1>
        </div>
        <p className="text-center text-muted-foreground mt-2 text-sm md:text-base">
          Get inspired with a random quote delivered to your inbox
        </p>
      </div>
    </header>
  );
}
