import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import {
  useMediaStore,
  SUPPORTED_IMAGE_TYPES,
  SUPPORTED_VIDEO_TYPES,
  SUPPORTED_AUDIO_TYPES,
} from "../../stores/useMediaStore";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress"; // Corrected import path
import { Alert, AlertDescription } from "../ui/alert"; // Corrected import path
import { Card, CardContent } from "../ui/card";

interface MediaUploaderProps {
  onUploadComplete?: () => void;
  className?: string;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  onUploadComplete,
  className = "",
}) => {
  const { uploadMedia, uploadProgress, removeUploadProgress } = useMediaStore();
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const fileList = new DataTransfer();
        acceptedFiles.forEach((file) => fileList.items.add(file));

        await uploadMedia(fileList.files);
        onUploadComplete?.();
      }
    },
    [uploadMedia, onUploadComplete]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": SUPPORTED_IMAGE_TYPES,
      "video/*": SUPPORTED_VIDEO_TYPES,
      "audio/*": SUPPORTED_AUDIO_TYPES,
    },
    multiple: true,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
  });

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "uploading":
      case "processing":
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "uploading":
      case "processing":
        return "bg-blue-500";
      case "completed":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <Card
        className={`transition-colors duration-200 ${
          isDragActive || dragActive
            ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
            : "border-dashed border-gray-300 dark:border-gray-600"
        }`}
      >
        <CardContent className="p-8">
          <div
            {...getRootProps()}
            className="cursor-pointer text-center space-y-4"
          >
            <input {...getInputProps()} />

            <div className="flex justify-center">
              <Upload
                className={`h-12 w-12 ${
                  isDragActive || dragActive
                    ? "text-blue-500"
                    : "text-gray-400 dark:text-gray-500"
                }`}
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">
                {isDragActive || dragActive
                  ? "Drop files here"
                  : "Upload Media Files"}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Drag and drop files here, or click to browse
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Supports images (JPEG, PNG, GIF, WebP, SVG), videos (MP4, WebM,
                OGG, AVI, MOV), and audio (MP3, WAV, OGG, AAC, FLAC)
              </p>
            </div>

            <Button variant="outline" className="mt-4">
              Choose Files
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upload Progress */}
      {uploadProgress.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold mb-3">Upload Progress</h4>
            <div className="space-y-3">
              {uploadProgress.map((progress) => (
                <div key={progress.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      {getStatusIcon(progress.status)}
                      <span className="text-sm font-medium truncate">
                        {progress.filename}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">
                        {progress.status === "completed"
                          ? "Complete"
                          : progress.status === "error"
                          ? "Failed"
                          : `${progress.progress}%`}
                      </span>
                      {progress.status === "error" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeUploadProgress(progress.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {progress.status !== "error" && (
                    <Progress value={progress.progress} className="h-2" />
                  )}

                  {progress.error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-xs">
                        {progress.error}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Guidelines */}
      <Card className="bg-gray-50 dark:bg-gray-900/50">
        <CardContent className="p-4">
          <h4 className="font-semibold mb-2 text-sm">Upload Guidelines</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-600 dark:text-gray-400">
            <div>
              <h5 className="font-medium mb-1">Images</h5>
              <p>Max size: 20MB</p>
              <p>Formats: JPEG, PNG, GIF, WebP, SVG</p>
            </div>
            <div>
              <h5 className="font-medium mb-1">Videos</h5>
              <p>Max size: 100MB</p>
              <p>Formats: MP4, WebM, OGG, AVI, MOV</p>
            </div>
            <div>
              <h5 className="font-medium mb-1">Audio</h5>
              <p>Max size: 50MB</p>
              <p>Formats: MP3, WAV, OGG, AAC, FLAC</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
