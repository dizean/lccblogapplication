import { services } from "@/services/services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface Employee {
  id: number;
  name: string;
  department: string;
  classification: string;
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

export const fetchEmployees = () =>
  useQuery<Employee[]>({
    queryKey: ["employees"],
    queryFn: services.fetchEmployees,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 2,
  });

export const fetchEmployeesLog = () =>
  useQuery({
    queryKey: ["employeesLog"],
    queryFn: services.fetchEmployeesLog,
    refetchOnWindowFocus: false,
  });

export const fetchEmployeesById = (id: number) =>
  useQuery({
    queryKey: ["employee", id],
    queryFn: () => services.fetchEmployeeById(id),
    refetchOnWindowFocus: false,
  });

export const timeIn = () =>
  useGenericMutation<number>(
    (employeeId) => services.timeIn(employeeId),
    "employeesLog"
  );

export const timeOut = () =>
  useGenericMutation<number>(
    (employeeId) => services.timeOut(employeeId),
    "employeesLog"
  );

export const addEmployee = () =>
  useGenericMutation<{
    name: string;
    department: string;
    classification: string;
    status: string;
  }>(
    (data) =>
      services.addEmployee({
        name: data.name,
        department: data.department,
        classification: data.classification,
        status: data.status,
      }),
    "employees"
  );

export const updateEmployee = () =>
  useGenericMutation<{
    id: number;
    name: string;
    department: string;
    classification: string;
    status: string;
  }>(
    ({ id, name, department, classification, status }) =>
      services.updateEmployee(id, {
        name,
        department,
        classification,
        status,
      }),
    "employees"
  );

export const deleteEmployee = () =>
  useGenericMutation<number>(
    (id) => services.deleteEmployee(id),
    "employees"
  );
