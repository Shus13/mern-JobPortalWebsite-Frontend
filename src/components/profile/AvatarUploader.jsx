import { useRef, useState } from "react";
import Button from "../ui/Button";

const MAX_SIZE_MB = 2;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const AvatarUploader = ({ currentPhotoUrl, userName, onUpload, isUploading }) => {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      e.target.value = "";
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      e.target.value = "";
      return;
    }

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUploadClick = async () => {
    if (!selectedFile) return;
    await onUpload(selectedFile);
    setSelectedFile(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const displayUrl = preview || currentPhotoUrl;

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border border-ink-200 bg-brand-50">
        {displayUrl ? (
          <img src={displayUrl} alt="Profile" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-display text-2xl font-bold text-brand-500">
            {userName?.charAt(0)?.toUpperCase() || "?"}
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-2 sm:items-start">
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          onChange={handleFileChange}
          className="hidden"
          id="avatar-input"
        />
        <div className="flex gap-2">
          <label
            htmlFor="avatar-input"
            className="focus-ring cursor-pointer rounded-xl border border-ink-200 px-4 py-2 text-sm font-medium text-ink-700 transition-colors hover:border-brand-300 hover:text-brand-600"
          >
            Choose photo
          </label>
          {selectedFile && (
            <Button size="sm" isLoading={isUploading} onClick={handleUploadClick}>
              Save photo
            </Button>
          )}
        </div>
        <p className="text-xs text-ink-400">JPG, PNG, or WEBP. Max 2MB.</p>
      </div>
    </div>
  );
};

export default AvatarUploader;
