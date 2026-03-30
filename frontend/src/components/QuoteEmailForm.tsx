import { useState } from 'react';
import { Mail, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSendQuoteEmail } from '../hooks/useQueries';

export default function QuoteEmailForm() {
  const [email, setEmail] = useState('');
  const [validationError, setValidationError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const { mutate: sendQuote, isPending } = useSendQuoteEmail();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    setShowSuccess(false);
    setShowError(false);

    // Validate email format
    if (!email.trim()) {
      setValidationError('Please enter an email address');
      return;
    }

    if (!validateEmail(email)) {
      setValidationError('Please enter a valid email address');
      return;
    }

    // Send quote
    sendQuote(email, {
      onSuccess: () => {
        setShowSuccess(true);
        setEmail('');
        setTimeout(() => setShowSuccess(false), 5000);
      },
      onError: (error) => {
        setShowError(true);
        console.error('Failed to send quote:', error);
        setTimeout(() => setShowError(false), 5000);
      },
    });
  };

  return (
    <Card className="w-full max-w-md shadow-2xl border-border/50 bg-card/95 backdrop-blur-sm">
      <CardHeader className="space-y-3 text-center pb-6">
        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Mail className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-2xl md:text-3xl font-bold">Get Your Daily Inspiration</CardTitle>
        <CardDescription className="text-base">
          Enter your email and we'll send you a randomly selected inspirational quote
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-base font-medium">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setValidationError('');
              }}
              disabled={isPending}
              className="h-12 text-base"
              autoComplete="email"
            />
            {validationError && (
              <p className="text-sm text-destructive flex items-center gap-1.5 mt-1">
                <AlertCircle className="w-4 h-4" />
                {validationError}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
            size="lg"
          >
            {isPending ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Sending Quote...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Send Me a Quote
              </>
            )}
          </Button>
        </form>

        {showSuccess && (
          <Alert className="border-green-500/50 bg-green-500/10 animate-in fade-in slide-in-from-top-2 duration-300">
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-800 dark:text-green-200 font-medium">
              Success! Check your inbox for your inspirational quote.
            </AlertDescription>
          </Alert>
        )}

        {showError && (
          <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-2 duration-300">
            <AlertCircle className="h-5 w-5" />
            <AlertDescription className="font-medium">
              Failed to send the quote. Please try again later.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
