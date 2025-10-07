import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { services } from "@/services/services";

export const visitorLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, purpose }: { name: string; purpose: string }) =>
      services.visitorLogin(name, purpose),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visitors"] });
    },
  });
};

export const visitorLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => services.visitorLogout(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visitors"] });
    },
  });
};

export const visitors = () => {
  return useQuery({
    queryKey: ["visitors"],
    queryFn: services.fetchVisitors,
    refetchOnWindowFocus: false,
  });
};