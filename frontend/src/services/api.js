import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 5000,
});

export const getProjects = () => api.get("/api/projects");
export const sendContact = (data) => api.post("/api/contact", data);

export default api;
