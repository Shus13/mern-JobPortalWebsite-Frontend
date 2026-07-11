import { useRef, useState } from "react";
import Button from "../ui/Button";

const MAX_SIZE_MB = 5;
const ACCEPTED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const FileIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-brand-500">
    <path
      d="M14 3v5a1 1 0 001 1h5M6 3h8l6 6v11a1 1 0 01-1 1H6a1 1 0 01-1-1V4a1 1 0 011-1z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ResumeUploader = ({ currentResumePath, hasResume, onUpload, onDownload, isUploading, isDownloading }) => {
  const inputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Only PDF or Word documents are allowed");
      e.target.value = "";
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File must be under ${MAX_SIZE_MB}MB`);
      e.target.value = "";
      return;
    }

    setSelectedFile(file);
  };

  const handleUploadClick = async () => {
    if (!selectedFile) return;
    await onUpload(selectedFile);
    setSelectedFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const fileName = currentResumePath?.split("/").pop();

  return (
    <div>
      {hasResume && (
        <div className="mb-4 flex items-center justify-between rounded-xl border border-ink-100 bg-ink-50/60 px-4 py-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <FileIcon />
            <span className="truncate text-sm font-medium text-ink-800">{fileName || "Your resume"}</span>
          </div>
          <Button size="sm" variant="secondary" isLoading={isDownloading} onClick={onDownload}>
            Download
          </Button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        onChange={handleFileChange}
        className="hidden"
        id="resume-input"
      />
      <div className="flex flex-wrap items-center gap-2">
        <label
          htmlFor="resume-input"
          className="focus-ring cursor-pointer rounded-xl border border-ink-200 px-4 py-2 text-sm font-medium text-ink-700 transition-colors hover:border-brand-300 hover:text-brand-600"
        >
          {hasResume ? "Replace resume" : "Upload resume"}
        </label>
        {selectedFile && (
          <>
            <span className="max-w-50 truncate text-sm text-ink-500">{selectedFile.name}</span>
            <Button size="sm" isLoading={isUploading} onClick={handleUploadClick}>
              Save resume
            </Button>
          </>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>}
      <p className="mt-1.5 text-xs text-ink-400">PDF or Word document. Max 5MB.</p>
    </div>
  );
};

export default ResumeUploader;
