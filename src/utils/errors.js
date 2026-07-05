// When a request uses `responseType: "blob"`, axios hands back a Blob even
// for JSON error responses — so `error.response.data.message` is always
// undefined. This reads the blob as text and parses it back into JSON so the
// backend's actual error message (404 "No resume uploaded", 403 "Not
// authorized", etc.) can be shown instead of a generic fallback.
export const extractBlobErrorMessage = async (error) => {
  const data = error?.response?.data;
  if (data instanceof Blob) {
    try {
      const text = await data.text();
      const parsed = JSON.parse(text);
      return parsed.message;
    } catch {
      return null;
    }
  }
  return error?.response?.data?.message;
};
