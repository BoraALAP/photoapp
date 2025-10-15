/**
 * Gemini 2.5 Flash Image Generation and Veo 3.1 Video Generation integration.
 * Generates creative AI images and videos using Google's Gemini API.
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenAI } from "@google/genai";
import ffmpeg from "fluent-ffmpeg";

export interface GenerationOptions {
  baseImage: string; // Base64 data URI
  referenceImages?: string[]; // For "With Us" preset
  prompts: string[];
  quality: "low" | "high";
}

export interface GenerationResult {
  images: string[]; // Array of base64 data URIs
  metadata?: {
    model: string;
    processingTime: number;
  };
}

/**
 * Generate images using Gemini 2.5 Flash Image model.
 */
export async function generateImages(
  options: GenerationOptions
): Promise<GenerationResult> {
  const apiKey = process.env.NB_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("NB_GEMINI_API_KEY is not configured");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-image",
  });

  const startTime = Date.now();
  const generatedImages: string[] = [];
  let totalInputTokens = 0;
  let totalOutputTokens = 0;

  // Extract base64 data from data URI
  const extractBase64 = (dataUri: string): string => {
    return dataUri.split(",")[1];
  };

  const extractMimeType = (dataUri: string): string => {
    const match = dataUri.match(/data:([^;]+);/);
    return match ? match[1] : "image/jpeg";
  };

  // Generate all images in parallel
  const generationPromises = options.prompts.map(async (prompt, index) => {
    try {
      const parts: any[] = [];

      // Add the prompt text
      parts.push({ text: prompt });

      // Add base image for image+text-to-image generation
      parts.push({
        inlineData: {
          mimeType: extractMimeType(options.baseImage),
          data: extractBase64(options.baseImage),
        },
      });

      // Add reference images if provided (for "With Us" preset)
      if (options.referenceImages && options.referenceImages.length > 0) {
        for (const refImage of options.referenceImages) {
          parts.push({
            inlineData: {
              mimeType: extractMimeType(refImage),
              data: extractBase64(refImage),
            },
          });
        }
      }

      // Use simple generateContent call with parts
      const result = await model.generateContent(parts);

      const response = result.response;

      // Track token usage
      let inputTokens = 0;
      let outputTokens = 0;
      if (response.usageMetadata) {
        inputTokens = response.usageMetadata.promptTokenCount || 0;
        outputTokens = response.usageMetadata.candidatesTokenCount || 0;

        if (process.env.NODE_ENV === 'development') {
          console.log(`Image ${index + 1} token usage:`, {
            inputTokens,
            outputTokens,
            totalTokens: inputTokens + outputTokens,
          });
        }
      }

      // Log the full response for debugging in dev mode
      if (process.env.NODE_ENV === 'development') {
        console.log("Full Gemini response:", JSON.stringify(response, null, 2));
      }

      // Extract generated image from response
      if (response.candidates && response.candidates[0]?.content?.parts) {
        const imagePart = response.candidates[0].content.parts.find(
          (part: any) => part.inlineData
        );

        if (imagePart?.inlineData?.data) {
          const mimeType = imagePart.inlineData.mimeType || "image/png";
          const base64Data = imagePart.inlineData.data;
          const dataUri = `data:${mimeType};base64,${base64Data}`;
          return { dataUri, inputTokens, outputTokens };
        } else {
          console.error("No image data in response parts:", response.candidates[0].content.parts);
          throw new Error("No image generated");
        }
      } else {
        console.error("Invalid response structure:", {
          hasCandidates: !!response.candidates,
          candidatesLength: response.candidates?.length,
          firstCandidate: response.candidates?.[0],
        });
        throw new Error("Invalid response structure");
      }
    } catch (error) {
      console.error("Error generating image for prompt:", prompt, error);
      throw error; // Re-throw to handle at API level
    }
  });

  // Wait for all images to generate in parallel
  const results = await Promise.all(generationPromises);

  // Extract images and accumulate token counts
  results.forEach((result) => {
    generatedImages.push(result.dataUri);
    totalInputTokens += result.inputTokens;
    totalOutputTokens += result.outputTokens;
  });

  const processingTime = Date.now() - startTime;

  // Log total token usage in dev mode
  if (process.env.NODE_ENV === 'development') {
    console.log("=== Total Generation Summary ===", {
      totalImages: generatedImages.length,
      totalInputTokens,
      totalOutputTokens,
      totalTokens: totalInputTokens + totalOutputTokens,
      avgTokensPerImage: Math.round((totalInputTokens + totalOutputTokens) / generatedImages.length),
      processingTimeMs: processingTime,
    });
  }

  return {
    images: generatedImages,
    metadata: {
      model: "gemini-2.5-flash-image",
      processingTime,
    },
  };
}

/**
 * Convert file to base64 for API transmission
 */
export async function fileToBase64(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export interface VideoGenerationOptions {
  baseImage: string; // Base64 data URI
  prompt: string; // Single prompt for video generation
}

export interface VideoGenerationResult {
  videoUrl: string; // URL to download the generated video
  metadata?: {
    model: string;
    processingTime: number;
    duration: number;
  };
}

/**
 * Generate video using Veo 3.1 model.
 * Generates a single 8-second video from an image and prompt.
 */
export async function generateVideo(
  options: VideoGenerationOptions
): Promise<VideoGenerationResult> {
  const apiKey = process.env.NB_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("NB_GEMINI_API_KEY is not configured");
  }

  const ai = new GoogleGenAI({ apiKey });
  const startTime = Date.now();

  try {
    // Extract base64 data and mime type from data URI
    const extractBase64 = (dataUri: string): string => {
      return dataUri.split(",")[1];
    };

    const extractMimeType = (dataUri: string): string => {
      const match = dataUri.match(/data:([^;]+);/);
      return match ? match[1] : "image/jpeg";
    };

    // Convert the user's base64 image to the format needed by Veo
    const userImageBase64 = extractBase64(options.baseImage);
    const mimeType = extractMimeType(options.baseImage);

    if (process.env.NODE_ENV === 'development') {
      console.log("Using user's uploaded image for video generation");
      console.log("Image data length:", userImageBase64.length);
      console.log("MIME type:", mimeType);
    }

    // Start video generation operation using the user's uploaded image
    // The image parameter needs to use 'imageBytes' field (not 'bytesBase64Encoded')
    const imageInput = {
      imageBytes: userImageBase64,
      mimeType: mimeType,
    };

    if (process.env.NODE_ENV === 'development') {
      console.log("Image input object:", JSON.stringify(imageInput, null, 2));
    }

    let operation = await ai.models.generateVideos({
      model: "veo-3.1-generate-preview",
      prompt: options.prompt,
      image: imageInput,
    });

    if (process.env.NODE_ENV === 'development') {
      console.log("Video generation started, operation:", operation.name);
    }

    // Poll for completion
    const pollInterval = 10000; // 10 seconds
    const maxWaitTime = 300000; // 5 minutes maximum
    const startPollTime = Date.now();

    while (!operation.done) {
      // Check if we've exceeded max wait time
      if (Date.now() - startPollTime > maxWaitTime) {
        throw new Error("Video generation timed out after 5 minutes");
      }

      if (process.env.NODE_ENV === 'development') {
        console.log("Waiting for video generation...");
      }

      await new Promise((resolve) => setTimeout(resolve, pollInterval));

      // Get updated operation status
      operation = await ai.operations.getVideosOperation({
        operation: operation,
      });
    }

    // Log the full operation response for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log("Operation completed, response:", JSON.stringify(operation.response, null, 2));
      console.log("Generated videos:", operation.response?.generatedVideos);
      console.log("First video:", operation.response?.generatedVideos?.[0]);
    }

    if (!operation.response?.generatedVideos?.[0]?.video) {
      // Log what we actually got
      console.error("No video in response. Full operation:", JSON.stringify(operation, null, 2));
      throw new Error("No video generated in response");
    }

    const videoFile = operation.response.generatedVideos[0].video;

    if (process.env.NODE_ENV === 'development') {
      console.log("Video generation completed, downloading video...");
    }

    // Download the video to a temporary file
    const fs = await import('fs/promises');
    const os = await import('os');
    const path = await import('path');

    // Create a unique temp directory for this download
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'video-gen-'));
    const tempVideoPath = path.join(tempDir, `video_${Date.now()}.mp4`);

    try {
      if (process.env.NODE_ENV === 'development') {
        console.log("Attempting to download video...");
        console.log("Temp directory:", tempDir);
        console.log("Temp file path:", tempVideoPath);
      }

      // The download method might not work as expected in Node.js
      // Let's try to fetch the video using the URI directly
      if (videoFile.uri) {
        if (process.env.NODE_ENV === 'development') {
          console.log("Fetching video from URI:", videoFile.uri);
        }

        // Fetch the video directly from Google's servers with API key
        const response = await fetch(videoFile.uri, {
          headers: {
            'X-Goog-Api-Key': apiKey,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch video: ${response.statusText}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        let videoBuffer = Buffer.from(arrayBuffer);

        if (process.env.NODE_ENV === 'development') {
          console.log("Video fetched successfully, size:", videoBuffer.length, "bytes");
        }

        // Optionally trim the first 1 second to remove static frame
        // This requires ffmpeg to be installed on the system
        const shouldTrimVideo = process.env.TRIM_VIDEO_START === 'true';

        if (shouldTrimVideo) {
          try {
            // Write video to temp file for ffmpeg processing
            await fs.writeFile(tempVideoPath, videoBuffer);

            // Trim the first 1 second to remove static frame
            const trimmedVideoPath = path.join(tempDir, `video_trimmed_${Date.now()}.mp4`);

            if (process.env.NODE_ENV === 'development') {
              console.log("Trimming first 1 second from video...");
            }

            await new Promise<void>((resolve, reject) => {
              ffmpeg(tempVideoPath)
                .setStartTime(1) // Skip first 1 second
                .output(trimmedVideoPath)
                .on('end', () => {
                  if (process.env.NODE_ENV === 'development') {
                    console.log("Video trimming completed");
                  }
                  resolve();
                })
                .on('error', (err) => {
                  console.error("Error trimming video:", err);
                  reject(err);
                })
                .run();
            });

            // Read the trimmed video
            videoBuffer = Buffer.from(await fs.readFile(trimmedVideoPath));

            if (process.env.NODE_ENV === 'development') {
              console.log("Trimmed video size:", videoBuffer.length, "bytes");
            }

            // Clean up the original file
            await fs.unlink(tempVideoPath);
          } catch (trimError) {
            console.error("Video trimming failed, using original video:", trimError);
            console.log("To enable video trimming:");
            console.log("1. Install ffmpeg: brew install ffmpeg");
            console.log("2. Set TRIM_VIDEO_START=true in .env.local");
            // Continue with original video buffer
          }
        } else if (process.env.NODE_ENV === 'development') {
          console.log("Video trimming disabled. To enable, set TRIM_VIDEO_START=true in .env.local");
        }

        const videoBase64 = videoBuffer.toString('base64');
        const videoDataUri = `data:video/mp4;base64,${videoBase64}`;

        const processingTime = Date.now() - startTime;

        if (process.env.NODE_ENV === 'development') {
          console.log("=== Video Generation Summary ===", {
            model: "veo-3.1-generate-preview",
            processingTimeMs: processingTime,
            videoSizeKB: Math.round(videoBuffer.length / 1024),
          });
        }

        // Clean up temp directory
        try {
          await fs.rmdir(tempDir);
        } catch (cleanupErr) {
          console.error("Error cleaning up temp directory:", cleanupErr);
        }

        return {
          videoUrl: videoDataUri,
          metadata: {
            model: "veo-3.1-generate-preview",
            processingTime,
            duration: 8, // Veo 3.1 generates 8-second videos
          },
        };
      } else {
        throw new Error("Video file has no URI");
      }
    } catch (downloadError) {
      console.error("Error downloading video:", downloadError);

      // Try to clean up on error
      try {
        await fs.rmdir(tempDir).catch(() => {});
      } catch {}

      throw new Error(`Failed to download video: ${downloadError instanceof Error ? downloadError.message : 'Unknown error'}`);
    }
  } catch (error) {
    console.error("Error generating video:", error);
    throw error;
  }
}
