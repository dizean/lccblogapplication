import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { services } from "@/services/services";

interface Key {
  id: number;
  name: string;
  location: string;
  status: string;
  active?: number;
}

const useGenericMutation = <TVariables,>(
  mutationFn: (variables: TVariables) => Promise<any>,
  queryKeyToInvalidate: string
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeyToInvalidate] });
    },
  });
};

export const fetchKeys = () =>
  useQuery<Key[]>({
    queryKey: ["keys"],
    queryFn: services.fetchKeys,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 2,
  });

export const fetchKeysLog = () =>
  useQuery({
    queryKey: ["keysLog"],
    queryFn: services.fetchKeysLog,
    refetchOnWindowFocus: false,
  });

export const borrowKey = () =>
  useGenericMutation<{ keyId: number; employeeId: number }>(
    ({ keyId, employeeId }) => services.borrowKey(keyId, employeeId),
    "keysLog"
  );

export const returnKey = () =>
  useGenericMutation<{ keyId: number; employeeId: number }>(
    ({ keyId, employeeId }) => services.returnKey(keyId, employeeId),
    "keysLog"
  );

export const addKey = () =>
  useGenericMutation<{ name: string; location: string; status: string }>(
    (data) =>
      services.addKey({
        name: data.name,
        location: data.location,
        status: data.status,
      }),
    "keys"
  );

// export const updateKey = () =>
//   useGenericMutation<{
//     id: number;
//     name: string;
//     location: string;
//     status: string;
//   }>(
//     ({ id, name, location, status }) =>
//       services.updateKey(id, { name, location, status }),
//     "keys"
//   );

// export const deleteKey = () =>
//   useGenericMutation<number>(
//     (id) => services.deleteKey(id),
//     "keys"
//   );
