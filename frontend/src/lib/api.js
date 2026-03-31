import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

/** Build a full backend URL for uploaded files. Handles both full URLs (Cloudinary) and relative paths (/uploads/...) */
export const getBackendFileUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const base = API_BASE_URL.replace(/\/api\/?$/, "") || "http://localhost:5000";
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
};
