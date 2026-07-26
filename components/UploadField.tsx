"use client";

import { useRef, useState } from "react";
import { UploadCloud, X, Music2, Loader2 } from "lucide-react";
import { uploadToImageKit } from "@/lib/imagekit";

interface Props {
  label: string;
  accept: "image" | "audio";
  value: string; // current uploaded URL, "" if none
  folder: string;
  onChange: (url: string) => void;
  helperText?: string;
}

export default function UploadField({
  label,
  accept,
  value,
  folder,
  onChange,
  helperText,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const acceptAttr = accept === "image" ? "image/*" : "audio/*";
  const maxSizeMb = accept === "image" ? 8 : 15;

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setError(null);

    if (file.size > maxSizeMb * 1024 * 1024) {
      setError(`File is too big — keep it under ${maxSizeMb}MB.`);
      return;
    }

    setUploading(true);
    setProgress(0);
    try {
      const result = await uploadToImageKit(file, folder, setProgress);
      onChange(result.url);
    } catch (e: any) {
      setError(e.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-wine">{label}</span>

      {value && !uploading ? (
        <div className="flex items-center gap-3 rounded-2xl border border-rosegold/50 bg-white/70 p-3">
          {accept === "image" ? (
            <img
              src={value}
              alt=""
              className="h-14 w-14 rounded-xl object-cover"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blush">
              <Music2 size={22} className="text-wine" />
            </div>
          )}
          <span className="flex-1 truncate text-xs text-ink/60">{value}</span>
          <button
            type="button"
            onClick={() => {
              onChange("");
              if (inputRef.current) inputRef.current.value = "";
            }}
            aria-label="Remove"
            className="text-wine/50 hover:text-red-500"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <label
          className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-6 text-center transition ${
            uploading
              ? "border-rosegold/40 bg-white/40"
              : "border-rosegold/50 bg-white/50 hover:border-neon hover:bg-blush/40"
          }`}
        >
          {uploading ? (
            <>
              <Loader2 size={22} className="animate-spin text-wine" />
              <span className="text-xs text-wine/70">Uploading... {progress}%</span>
            </>
          ) : (
            <>
              <UploadCloud size={22} className="text-wine/60" />
              <span className="text-xs font-medium text-wine">
                Tap to upload {accept === "image" ? "a photo" : "an audio file"}
              </span>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept={acceptAttr}
            className="hidden"
            disabled={uploading}
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </label>
      )}

      {helperText && !error && (
        <p className="mt-1 text-xs text-wine/40">{helperText}</p>
      )}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
