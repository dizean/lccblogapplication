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

export const fetchVisitors = () => request("/visitors");

export const visitorLogin = (name: string, purpose: string, id: string, img: string) =>
  request("/visitors/in", {
    method: "POST",
    body: JSON.stringify({ name, purpose, id, img }),
  });

export const visitorLogout = (id: number) =>
  request("/visitors/out", {
    method: "PUT",
    body: JSON.stringify({ id }),
  });

export const fetchVisitorsToday = () => request("/visitors/todayLogs");

export const fetchVisitorsAll = () => request("/visitors/allLogs");

export const fetchVisitorsRange = (start: string, end: string) =>
  request(`/visitors/range?start=${start}&end=${end}`);


// UPLOAD IMAGE
export const uploadVisitorImage = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  return request("/upload", {
    method: "POST",
    body: formData,
  });
}