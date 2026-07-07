import api from "./api";
import { extractBlobErrorMessage } from "../utils/errors";
import { saveBlobAsFile } from "../utils/download";

// Mounted at /api/admin on the backend, all routes require isAuthenticated + isAdmin

export const getAdminStats = async () => {
  const { data } = await api.get("/admin/stats");
  return data;
};

export const getAllUsers = async () => {
  const { data } = await api.get("/admin/users");
  return data;
};

export const getUserById = async (id) => {
  const { data } = await api.get(`/admin/users/${id}`);
  return data;
};

export const downloadUserResume = async (id, filename = "resume") => {
  try {
    const response = await api.get(`/admin/users/${id}/resume/download`, {
      responseType: "blob",
    });
    saveBlobAsFile(response, filename);
  } catch (error) {
    const message = await extractBlobErrorMessage(error);
    throw new Error(message || "Could not download resume");
  }
};

export const deleteUser = async (id) => {
  const { data } = await api.delete(`/admin/users/${id}`);
  return data;
};

export const getAllJobsAdmin = async () => {
  const { data } = await api.get("/admin/jobs");
  return data;
};

export const deleteJobAdmin = async (id) => {
  const { data } = await api.delete(`/admin/jobs/${id}`);
  return data;
};
