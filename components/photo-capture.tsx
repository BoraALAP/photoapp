"use client";

/**
 * PhotoCapture Component
 *
 * Allows users to capture or upload photos for AI generation.
 * Supports mobile camera capture with environment-facing camera.
 */

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, Upload, X } from "lucide-react";
import Image from "next/image";

interface PhotoCaptureProps {
  onPhotoSelected: (file: File) => void;
  disabled?: boolean;
}

export function PhotoCapture({ onPhotoSelected, disabled }: PhotoCaptureProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    onPhotoSelected(file);
  };

  const handleClear = () => {
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Upload Your Photo</h2>

        {preview ? (
          <div className="relative aspect-square w-full max-w-md mx-auto">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover rounded-lg"
            />
            <Button
              size="icon"
              variant="destructive"
              className="absolute top-2 right-2"
              onClick={handleClear}
              disabled={disabled}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Camera Capture */}
            <Button
              variant="outline"
              size="lg"
              className="h-32 flex-col gap-2"
              onClick={() => cameraInputRef.current?.click()}
              disabled={disabled}
            >
              <Camera className="h-8 w-8" />
              <span>Take Photo</span>
            </Button>
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileChange}
              disabled={disabled}
            />

            {/* File Upload */}
            <Button
              variant="outline"
              size="lg"
              className="h-32 flex-col gap-2"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
            >
              <Upload className="h-8 w-8" />
              <span>Upload Photo</span>
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={disabled}
            />
          </div>
        )}

        <p className="text-sm text-muted-foreground text-center">
          Choose a clear photo of yourself for best results
        </p>
      </div>
    </Card>
  );
}
