/**
 * ResultsPage Component
 *
 * Displays the 4 generated AI images in a grid layout with download buttons.
 * Shows skeleton loaders during generation and error states.
 * Each image has a download button overlay in the bottom right corner.
 */

"use client";

import { Logo } from "@/components/logo";
import { Download } from "lucide-react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import LightRays from "@/components/LightRays";

interface ResultsPageProps {
  images: string[] | null;
  onBack: () => void;
  generating?: boolean;
  error?: string | null;
}

export function ResultsPage({ images, onBack, generating = false, error = null }: ResultsPageProps) {
  const handleDownload = async (imageUrl: string, index: number) => {
    try {
      const fileName = `generated-image-${index + 1}.png`;
      const isMobile = typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      // Convert base64 to blob
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      if (isMobile && navigator.share) {
        // Use Web Share API for mobile - works on iOS Safari and modern Android
        const file = new File([blob], fileName, { type: blob.type });
        try {
          await navigator.share({
            files: [file],
          });
          return;
        } catch (shareError: any) {
          // User cancelled or share not supported, fall through to download
          if (shareError.name !== 'AbortError') {
            console.log('Share failed:', shareError);
          }
        }
      }

      // Standard download for desktop or if share fails
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download image");
    }
  };

  return (
    <div className="min-h-screen h-screen bg-[#0f0a0a] flex flex-col overflow-hidden relative">
      {/* Light Rays Background - only show during generation */}
      {generating && (
        <div className="absolute inset-0 z-0">
          <LightRays />
        </div>
      )}

      <div className="flex-1 overflow-y-auto pb-24 pt-4 px-4 flex flex-col items-center relative z-10">
        {/* Logo */}
        <div className="mb-6">
          <Logo size={72} />
        </div>

        {/* Status Message */}
        {(generating || error) && (
          <div className="w-full text-center mb-4">
            {generating && (
              <p className="text-white text-lg font-medium">Generating...</p>
            )}
            {error && (
              <p className="text-red-400 text-lg font-medium">{error}</p>
            )}
          </div>
        )}

        {/* Grid of Images or Skeletons */}
        <div className="grid md:grid-cols-2 w-full gap-2 mb-4">
          {generating || error ? (
            // Show 4 skeleton loaders
            Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="relative aspect-video rounded-3xl overflow-hidden bg-black/40"
              >
                <Skeleton className="w-full h-full" />
                {/* Download Icon Placeholder */}
                <div className="absolute bottom-6 right-6 w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Download className="w-6 h-6 text-white/40" />
                </div>
              </div>
            ))
          ) : (
            // Show actual images
            images?.map((imageUrl, index) => (
              <div
                key={index}
                className="relative aspect-video rounded-3xl overflow-hidden bg-black"
              >
                <Image
                  src={imageUrl}
                  alt={`Generated image ${index + 1}`}
                  fill
                  className="object-cover"
                />

                {/* Download Button */}
                <button
                  onClick={() => handleDownload(imageUrl, index)}
                  className="absolute bottom-6 right-6 w-10 h-10 bg-white rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <Download className="w-6 h-6 text-black" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Back Button */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
        <button
          onClick={onBack}
          className="bg-white text-black px-8 py-4 rounded-2xl font-semibold hover:bg-gray-100 transition-colors min-w-[272px]"
        >
          Back to Generate
        </button>
      </div>
    </div>
  );
}
