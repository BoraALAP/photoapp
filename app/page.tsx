"use client";

import { useState, useRef, useEffect } from "react";
import { useUser, SignInButton, UserButton } from "@clerk/nextjs";
import { PurchaseModal } from "@/components/purchase-modal";
import { ResultsPage } from "@/components/results-page";
import { Logo } from "@/components/logo";
import { PresetSelector } from "@/components/preset-selector";
import { LogIn } from "lucide-react";
import Image from "next/image";

export default function Home() {
  const { isSignedIn, isLoaded } = useUser();
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<string>("toronto");
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [results, setResults] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [credits, setCredits] = useState<number | null>(null);
  const [totalGens, setTotalGens] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize camera on mount
  useEffect(() => {
    const initCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (error) {
        console.error("Camera access denied:", error);
        alert("Camera access is required to use this app");
      }
    };

    initCamera();

    // Cleanup: stop camera when component unmounts
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Update video element when stream changes
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // Function to fetch credits
  const fetchCredits = async () => {
    if (isSignedIn) {
      try {
        const res = await fetch("/api/credits");
        const data = await res.json();
        setCredits(data.credits);
        setTotalGens(data.total_gens);
      } catch (err) {
        console.error("Failed to fetch credits:", err);
      }
    }
  };

  // Fetch credits when signed in
  useEffect(() => {
    fetchCredits();
  }, [isSignedIn]);

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Flip the canvas horizontally to match the mirrored video display
      ctx.scale(-1, 1);
      ctx.drawImage(video, -canvas.width, 0);
      canvas.toBlob(async (blob) => {
        if (blob) {
          const file = new File([blob], "photo.jpg", { type: "image/jpeg" });
          setPhoto(file);
          setPhotoPreview(canvas.toDataURL("image/jpeg"));

          // Stop camera stream
          if (stream) {
            stream.getTracks().forEach((track) => track.stop());
            setStream(null);
          }

          // Auto-trigger generation
          await handleGenerateWithFile(file);
        }
      }, "image/jpeg");
    }
  };

  const handleGenerateWithFile = async (file: File) => {
    if (!file || !selectedPreset) return;

    // Require sign-in for generation
    if (!isSignedIn) {
      // Trigger sign-in modal
      const signInButton = document.querySelector('[data-clerk-sign-in]') as HTMLButtonElement;
      if (signInButton) {
        signInButton.click();
      }
      return;
    }

    setGenerating(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("photo", file);
      formData.append("presetId", selectedPreset);

      const endpoint = "/api/generate";
      const res = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Generation error:", errorData);
        if (res.status === 402) {
          setShowPurchaseModal(true);
          setGenerating(false);
        } else {
          setError(errorData.error || "Generation failed");
        }
        return;
      }

      const data = await res.json();
      console.log("Generation response:", data);
      setResults(data.images);

      // Refresh credits after successful generation
      await fetchCredits();
    } catch (err) {
      console.error("Error generating images:", err);
      setError("Failed to generate images");
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerate = async () => {
    if (!photo || !selectedPreset) return;
    await handleGenerateWithFile(photo);
  };

  const handleBackToCapture = async () => {
    // Reset state
    setResults(null);
    setPhoto(null);
    setPhotoPreview(null);

    // Refresh credits when going back
    await fetchCredits();

    // Restart camera
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error("Camera access denied:", error);
      alert("Camera access is required to use this app");
    }
  };

  // Show results/loading page if we have results or generating
  if (results || generating || error) {
    return (
      <ResultsPage
        images={results}
        onBack={handleBackToCapture}
        generating={generating}
        error={error}
      />
    );
  }

  console.log(isSignedIn, totalGens);


  return (
    <div className="h-full w-full bg-[#0f0a0a] flex flex-col items-center justify-between p-4 gap-4 overflow-hidden">
      {/* Main Photo Frame */}
      <div className="flex-1 w-full  rounded-3xl overflow-hidden relative bg-black">
        {photoPreview ? (
          <Image
            src={photoPreview}
            alt="Captured photo"
            fill
            className="object-cover"
          />
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
            />
            <canvas ref={canvasRef} className="hidden" />
          </>
        )}

        {/* Generating Overlay */}
        {generating && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-20 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white text-xl font-medium">Generating...</p>
              <p className="text-white/70 text-sm mt-2">Creating your AI images</p>
            </div>
          </div>
        )}

        {/* Logo Overlay */}
        <div className="absolute top-6 z-10 w-full flex items-center justify-between px-6">
          <div className="w-10"></div>

          <Logo size={72} className="drop-shadow-lg" />

          <div className="flex items-center gap-3">
            {isSignedIn ? (
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10",
                    userButtonPopoverCard: "shadow-xl",
                  },
                }}
              />
            ) : (
              <SignInButton mode="modal">
                <button
                  data-clerk-sign-in
                  className="bg-white text-black px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-gray-100 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </button>
              </SignInButton>
            )}
          </div>
        </div>

        {/* Free Credits Banner */}
        {isSignedIn && totalGens === 0 && credits !== null && credits > 0 && (
          <div className="absolute bottom-20 left-0 right-0 flex justify-center px-6">
            <div className="bg-green-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-xs font-medium">
              🎉 {credits} free credits remaining
            </div>
          </div>
        )}
        {/* DEV ONLY: Reset Credits Button */}
        {process.env.NODE_ENV === 'development' && (
          <button
            onClick={async () => {
              const res = await fetch('/api/reset-credits', { method: 'POST' });
              const data = await res.json();
              console.log(data);
              alert('Credits/Rate limit reset! Refresh the page.');
              window.location.reload();
            }}
            className="absolute bottom-20 left-4 w-fit mx-auto z-10 bg-yellow-500 text-black px-3 py-1 rounded text-xs"
          >
            Reset Credits (Dev)
          </button>
        )}



        {/* Preset Buttons - Bottom */}
        <PresetSelector
          selectedPreset={selectedPreset}
          onPresetChange={setSelectedPreset}
          className="absolute bottom-8 left-0 right-0"
        />
      </div>

      {/* Bottom Controls */}
      <div className="w-full  flex items-center justify-between px-2">
        {/* Credit Display */}
        {isSignedIn && credits !== null ? (
          <p className="text-sm text-white font-normal w-20">
            Credit: {credits}
          </p>
        ) : (
          <div className="w-20" />
        )}

        {/* Camera/Generate Button */}
        <button
          onClick={photoPreview ? handleGenerate : capturePhoto}
          disabled={generating || (!stream && !photoPreview)}
          className="w-16 h-16 rounded-full bg-black border-4 border-white p-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shrink-0"
        >
          <div className="w-full h-full rounded-full bg-gradient-to-b from-red-900 to-red-600" />
        </button>

        <div className="w-20" />
      </div>

      {/* Purchase Modal */}
      {showPurchaseModal && (
        <PurchaseModal
          onClose={() => setShowPurchaseModal(false)}
          onPurchaseComplete={() => {
            setShowPurchaseModal(false);
            handleGenerate();
          }}
        />
      )}
    </div>
  );
}
