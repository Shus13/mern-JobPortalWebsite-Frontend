// Maps common resume MIME types to a file extension, so the downloaded
// file always has the right one even if the caller didn't include it.
const EXTENSIONS_BY_MIME = {
  "application/pdf": ".pdf",
  "application/msword": ".doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
};

const withExtension = (filename, mimeType) => {
  const ext = EXTENSIONS_BY_MIME[mimeType];
  if (!ext) return filename;
  return filename.toLowerCase().endsWith(ext) ? filename : `${filename}${ext}`;
};

// Saves an axios blob response as a real, correctly-typed file download.
// Using `new Blob([blob])` on its own drops the original MIME type, which is
// why downloads were showing up as untyped .txt files with raw bytes inside
// instead of an actual openable PDF/Word document.
export const saveBlobAsFile = (axiosResponse, filename) => {
  const mimeType = axiosResponse.data.type || axiosResponse.headers?.["content-type"];
  const typedBlob = new Blob([axiosResponse.data], { type: mimeType });
  const finalName = withExtension(filename, mimeType);

  const blobUrl = window.URL.createObjectURL(typedBlob);
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = finalName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(blobUrl);
};
