export interface ImageKitUploadResult {
  url: string;
  fileId: string;
  name: string;
}

/**
 * Uploads a file straight from the browser to ImageKit.
 * 1. Ask our own server for a short-lived signature (private key stays server-side).
 * 2. POST the file + that signature directly to ImageKit's upload endpoint.
 *
 * Works for images AND audio/mp3 — ImageKit stores and delivers any file
 * type; it only *transforms* image/video/audio, everything else (like a
 * plain mp3) is served as-is.
 */
export async function uploadToImageKit(
  file: File,
  folder: string,
  onProgress?: (percent: number) => void
): Promise<ImageKitUploadResult> {
  const authRes = await fetch("/api/imagekit-auth");
  if (!authRes.ok) {
    throw new Error("Could not start the upload. Check ImageKit setup.");
  }
  const { token, expire, signature } = await authRes.json();

  const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
  if (!publicKey) {
    throw new Error("NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY is missing.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("fileName", file.name);
  formData.append("publicKey", publicKey);
  formData.append("signature", signature);
  formData.append("expire", String(expire));
  formData.append("token", token);
  formData.append("folder", folder);
  formData.append("useUniqueFileName", "true");

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://upload.imagekit.io/api/v1/files/upload");

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve({ url: data.url, fileId: data.fileId, name: data.name });
        } else {
          reject(new Error(data.message || "Upload failed."));
        }
      } catch {
        reject(new Error("Upload failed — unexpected response."));
      }
    };

    xhr.onerror = () => reject(new Error("Network error during upload."));
    xhr.send(formData);
  });
}
