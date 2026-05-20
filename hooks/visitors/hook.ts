import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import services from "@/services/services";

export const visitorLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, purpose, id, img }: { name: string; purpose: string; id: string; img: string }) =>
      services.visitorLogin(name, purpose, id, img),
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

export const fetchVisitorsRangeLog = (start: string, end: string) =>
  useQuery({
    queryKey: ["visitorsLog", "range", start, end],
    queryFn: () => services.fetchVisitorsRange(start, end),
    enabled: !!start && !!end,
  });