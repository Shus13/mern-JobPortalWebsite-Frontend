import api from "./api";

// Public
export const getJobs = async () => {
  const { data } = await api.get("/jobs");
  return data; // { count, jobs }
};

export const getJobById = async (id) => {
  const { data } = await api.get(`/jobs/${id}`);
  return data;
};

// Employer only
export const createJob = async (payload) => {
  const { data } = await api.post("/jobs", payload);
  return data;
};

export const updateJob = async (id, payload) => {
  const { data } = await api.patch(`/jobs/${id}`, payload);
  return data;
};

export const deleteJob = async (id) => {
  const { data } = await api.delete(`/jobs/${id}`);
  return data;
};

export const getMyJobs = async () => {
  const { data } = await api.get("/jobs/my");
  return data;
};
