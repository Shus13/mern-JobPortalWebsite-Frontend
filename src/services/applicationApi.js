import api from "./api";
import { extractBlobErrorMessage } from "../utils/errors";
import { saveBlobAsFile } from "../utils/download";

// Mounted at /api/app on the backend (not /api/applications)

// JobSeeker: apply to a job
export const applyToJob = async (jobId) => {
  const { data } = await api.post(`/app/${jobId}`);
  return data;
};

// JobSeeker: view own applications
// Response: { count, applications } — each application includes the
// associated Job under the capitalized key `Job` (Sequelize default
// association alias, since no `as` was set on belongsTo).
export const getMyApplications = async () => {
  const { data } = await api.get("/app/my");
  return data;
};

// JobSeeker: withdraw an application
export const withdrawApplication = async (id) => {
  const { data } = await api.delete(`/app/${id}`);
  return data;
};

// Employer: view applicants for a job
// Response: { count, applicants } — note the key is `applicants`, not
// `applications`. Each applicant includes the associated User under `User`.
export const getApplicantsForJob = async (jobId) => {
  const { data } = await api.get(`/app/job/${jobId}`);
  return data;
};

// Employer: download a specific applicant's resume (authorized on the
// backend by checking the requester owns the job). Fetched as a blob since
// the route is auth-protected — a plain link wouldn't carry the token.
export const downloadApplicantResume = async (applicationId, filename = "resume") => {
  try {
    const response = await api.get(`/app/${applicationId}/resume/download`, {
      responseType: "blob",
    });
    saveBlobAsFile(response, filename);
  } catch (error) {
    const message = await extractBlobErrorMessage(error);
    throw new Error(message || "Could not download resume");
  }
};

// Employer: update application status
export const updateApplicationStatus = async (id, status) => {
  const { data } = await api.patch(`/app/${id}/status`, { status });
  return data;
};
