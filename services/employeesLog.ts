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
    throw error;
  }
};

export const timeIn = (id: number) =>
  request("/employeesLog/time-in", {
    method: "POST",
    body: JSON.stringify({ id }),
  });

export const timeOut = (id: number) =>
  request("/employeesLog/time-out", {
    method: "POST",
    body: JSON.stringify({ id }),
  });

export const fetchEmployeesLog = () =>
  request("/employeesLog");
