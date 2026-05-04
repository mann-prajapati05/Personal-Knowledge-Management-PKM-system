import { useRef, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4041";

export default function FileUpload({ noteId, onFilesUploaded, onError }) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const files = e.currentTarget.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      const config = {
        withCredentials: true,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          setUploadProgress(percentCompleted);
        },
      };

      const res = await axios.post(
        `${API_BASE}/notes/${noteId}/upload`,
        formData,
        config,
      );

      onFilesUploaded(res.data.files);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      const message =
        err?.response?.data?.error || err?.message || "Upload failed";
      onError(message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileSelect}
        disabled={uploading}
        accept="image/*,.pdf,.doc,.docx,.md,.txt"
        className="block w-full text-sm text-slate-400 file:rounded-lg file:border-0 file:bg-cyan-500/10 file:px-3 file:py-2 file:text-cyan-300 hover:file:bg-cyan-500/20 disabled:opacity-50"
      />
      {uploading && (
        <div className="space-y-2">
          <div className="h-2 w-full rounded-full bg-slate-700">
            <div
              className="h-full rounded-full bg-cyan-500 transition-all"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-xs text-slate-400">
            Uploading... {uploadProgress}%
          </p>
        </div>
      )}
    </div>
  );
}
