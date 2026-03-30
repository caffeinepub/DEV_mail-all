import { useMutation, useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useGetRandomQuote() {
  const { actor, isFetching } = useActor();

  return useQuery<string>({
    queryKey: ['randomQuote'],
    queryFn: async () => {
      if (!actor) return '';
      return actor.getRandomQuote();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSendQuoteEmail() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (emailAddress: string) => {
      if (!actor) {
        throw new Error('Actor not initialized');
      }
      await actor.sendRandomQuoteEmail(emailAddress);
    },
  });
}
