/**
 * Image watermarking and downscaling utilities for preview mode.
 * Uses sharp for image processing with watermark in bottom right corner.
 */

import sharp from "sharp";

/**
 * Downscale image to max 768px and add watermark to bottom right corner.
 * Returns base64 encoded watermarked image.
 */
export async function watermarkAndDownscale(
  imageBase64: string
): Promise<string> {
  try {
    // Extract base64 data from data URI
    const base64Data = imageBase64.split(",")[1];
    const imageBuffer = Buffer.from(base64Data, "base64");

    // Get image metadata to calculate dimensions
    const metadata = await sharp(imageBuffer).metadata();
    const originalWidth = metadata.width || 1024;
    const originalHeight = metadata.height || 1024;

    // Calculate new dimensions (max 768px, maintain aspect ratio)
    let newWidth = originalWidth;
    let newHeight = originalHeight;

    if (originalWidth > 768 || originalHeight > 768) {
      if (originalWidth > originalHeight) {
        newWidth = 768;
        newHeight = Math.round((originalHeight / originalWidth) * 768);
      } else {
        newHeight = 768;
        newWidth = Math.round((originalWidth / originalHeight) * 768);
      }
    }

    // Create watermark text SVG (bottom right corner)
    const timestamp = new Date().toLocaleDateString();
    const watermarkText = `PhotoApp Preview • ${timestamp}`;

    // Calculate watermark position (bottom right with padding)
    const fontSize = Math.max(12, Math.floor(newWidth / 50));
    const padding = Math.floor(fontSize);

    const watermarkSvg = `
      <svg width="${newWidth}" height="${newHeight}">
        <text
          x="${newWidth - padding}"
          y="${newHeight - padding}"
          font-family="Arial, sans-serif"
          font-size="${fontSize}"
          fill="white"
          fill-opacity="0.7"
          text-anchor="end"
          dominant-baseline="baseline"
        >${watermarkText}</text>
      </svg>
    `;

    // Process image: resize and add watermark
    const processedBuffer = await sharp(imageBuffer)
      .resize(newWidth, newHeight, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .composite([
        {
          input: Buffer.from(watermarkSvg),
          top: 0,
          left: 0,
        },
      ])
      .png()
      .toBuffer();

    // Convert back to base64 data URI
    const base64Result = processedBuffer.toString("base64");
    return `data:image/png;base64,${base64Result}`;
  } catch (error) {
    console.error("Error watermarking image:", error);
    // Return original on error
    return imageBase64;
  }
}

/**
 * Create signed JWT receipt for anonymous preview.
 */
export async function createPreviewReceipt(data: {
  ip: string;
  presetId: string;
  timestamp: string;
  hash: string;
}): Promise<string> {
  // Simple base64 encoded receipt (in production, use proper JWT signing)
  const receipt = {
    ...data,
    type: "preview",
    version: "1.0",
  };

  return Buffer.from(JSON.stringify(receipt)).toString("base64");
}
