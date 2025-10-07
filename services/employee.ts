const API = process.env.NEXT_PUBLIC_API_URL;

const handleResponse = async (res: Response) => {
  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || "Request failed");
  }
  return res.json();
};

const request = async (url: string, options?: RequestInit) => {
  try {
    const res = await fetch(`${API}${url}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
    return await handleResponse(res);
  } catch (error) {
    console.error("API Request Error:", error);
    throw error; // rethrow for React Query to handle
  }
};

/* =====================
   ✅ EMPLOYEE SERVICES
===================== */

export const fetchEmployees = () =>
  request("/employees");

export const fetchEmployeeById = (id: number) =>
  request(`/employees/${id}`);

/* ✅ Updated to send department/classification/status as text */
export const addEmployee = (data: {
  name: string;
  department: string;
  classification: string;
  status: string;
}) =>
  request("/employees", {
    method: "POST",
    body: JSON.stringify(data),
  });

/* ✅ Updated to also use text-based fields */
export const updateEmployee = (
  id: number,
  data: {
    name: string;
    department: string;
    classification: string;
    status: string;
  }
) =>
  request(`/employees/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

/* ✅ Keep delete logic same (toggling active status, maybe) */
export const deleteEmployee = (id: number) =>
  request(`/employees/status/${id}`, {
    method: "PUT",
  });
