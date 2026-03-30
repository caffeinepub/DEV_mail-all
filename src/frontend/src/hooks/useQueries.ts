import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useDashboardStats() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getDashboardStats();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubscribers() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["subscribers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listSubscribers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubscriberCount() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["subscriberCount"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getSubscriberCount();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCampaigns() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["campaigns"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listCampaigns();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddSubscriber() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ name, email }: { name: string; email: string }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addSubscriber(name, email);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscribers"] });
      queryClient.invalidateQueries({ queryKey: ["subscriberCount"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });
}

export function useRemoveSubscriber() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (email: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.removeSubscriber(email);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscribers"] });
      queryClient.invalidateQueries({ queryKey: ["subscriberCount"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });
}

export function useSendCampaign() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      subject,
      body,
    }: { subject: string; body: string }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.sendCampaign({ subject, body });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });
}
