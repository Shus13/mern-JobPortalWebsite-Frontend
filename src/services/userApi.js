import api from "./api";
import { extractBlobErrorMessage } from "../utils/errors";
import { saveBlobAsFile } from "../utils/download";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const SERVER_ORIGIN = BASE_URL.replace(/\/api\/?$/, "");

export const getProfile = async () => {
  const { data } = await api.get("/auth/profile");
  return data;
};

export const updateProfile = async ({ name, email }) => {
  const { data } = await api.patch("/auth/profile", { name, email });
  return data;
};

export const uploadProfilePhoto = async (file) => {
  const formData = new FormData();
  formData.append("photo", file);
  const { data } = await api.patch("/auth/profile/photo", formData);
  return data;
};

export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append("resume", file);
  const { data } = await api.patch("/auth/profile/resume", formData);
  return data;
};

// Builds a full, browsable URL for a stored file path like
// "/uploads/profile-photos/xyz.png"
export const fileUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${SERVER_ORIGIN}${path}`;
};

// The download route is auth-protected, so a plain <a href> won't carry the
// token. Fetch it as a blob through the authenticated axios instance instead,
// then trigger the browser's save dialog manually.
export const downloadResume = async (filename = "resume") => {
  try {
    const response = await api.get("/auth/profile/resume/download", {
      responseType: "blob",
    });
    saveBlobAsFile(response, filename);
  } catch (error) {
    const message = await extractBlobErrorMessage(error);
    throw new Error(message || "Could not download resume");
  }
};
