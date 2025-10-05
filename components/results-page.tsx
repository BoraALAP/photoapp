/**
 * ResultsPage Component
 *
 * Displays the 4 generated AI images in a grid layout with download buttons.
 * Each image has a download button overlay in the bottom right corner.
 */

"use client";

import { Logo } from "@/components/logo";
import { Download } from "lucide-react";
import Image from "next/image";

interface ResultsPageProps {
  images: string[];
  onBack: () => void;
}

export function ResultsPage({ images, onBack }: ResultsPageProps) {
  const handleDownload = async (imageUrl: string, index: number) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const fileName = `generated-image-${index + 1}.png`;

      // Check if Web Share API is available (mobile devices)
      if (navigator.share && navigator.canShare) {
        const file = new File([blob], fileName, { type: blob.type });
        if (navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: "Generated Image",
            });
            return;
          } catch (shareError) {
            // User cancelled share or share failed, fall back to download
            console.log("Share cancelled or failed:", shareError);
          }
        }
      }

      // Fallback: Standard download for desktop or if share fails
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
    <div className="min-h-screen bg-[#0f0a0a] flex flex-col items-center pb-8 pt-4 px-4">
      {/* Logo */}
      <div className="mb-6">
        <Logo size={72} />
      </div>

      {/* Grid of Images */}
      <div className="grid md:grid-cols-2  w-full  gap-2 mb-20">
        {images.map((imageUrl, index) => (
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
        ))}
      </div>

      {/* Back Button */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2">
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
