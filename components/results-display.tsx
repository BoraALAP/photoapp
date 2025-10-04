"use client";

/**
 * ResultsDisplay Component
 *
 * Displays the 4 generated AI images in a grid layout.
 * Allows users to download individual images.
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import Image from "next/image";

interface ResultsDisplayProps {
  images: string[];
  isPreview?: boolean;
}

export function ResultsDisplay({ images, isPreview }: ResultsDisplayProps) {
  const handleDownload = (imageData: string, index: number) => {
    const link = document.createElement("a");
    link.href = imageData;
    link.download = `generated-image-${index + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isPreview ? "Preview Results (Watermarked)" : "Your Generated Images"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                <Image
                  src={image}
                  alt={`Generated image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
              <Button
                size="sm"
                className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleDownload(image, index)}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          ))}
        </div>

        {isPreview && (
          <div className="mt-6 p-4 bg-primary/10 rounded-lg text-center">
            <p className="font-medium">Love these results?</p>
            <p className="text-sm text-muted-foreground mt-1">
              Sign up to get full-resolution images without watermarks!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
