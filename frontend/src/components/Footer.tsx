import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-border/40 bg-background/80 backdrop-blur-sm py-6">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm text-muted-foreground">
          © 2025. Built with{' '}
          <Heart className="inline w-4 h-4 text-destructive fill-destructive animate-pulse" />{' '}
          using{' '}
          <a
            href="https://caffeine.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </footer>
  );
}
