import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 5000,
});

export const getProjects = () => api.get("/api/projects");
export const sendContact = (data) => api.post("/api/contact", data);

export default api;