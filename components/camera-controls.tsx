/**
 * CameraControls Component
 *
 * Bottom control bar with credit display and capture/generate button.
 * Shows purchase button instead of shutter when user lacks credits for selected preset type.
 */

"use client";

interface CameraControlsProps {
  isSignedIn: boolean;
  credits: number | null;
  videoCredits: number | null;
  photoPreview: string | null;
  generating: boolean;
  stream: MediaStream | null;
  selectedPresetType: 'image' | 'video';
  hasCredits: boolean;
  isCartoonMode: boolean;
  onCapture: () => void;
  onGenerate: () => void;
  onPurchase: () => void;
  onToggleCartoon: () => void;
}

export function CameraControls({
  isSignedIn,
  credits,
  videoCredits,
  photoPreview,
  generating,
  stream,
  selectedPresetType,
  hasCredits,
  isCartoonMode,
  onCapture,
  onGenerate,
  onPurchase,
  onToggleCartoon,
}: CameraControlsProps) {
  const displayCredits = selectedPresetType === 'video' ? videoCredits : credits;

  return (
    <div className="w-full flex items-center justify-between px-2">
      {/* Credit Display */}
      {isSignedIn && displayCredits !== null ? (
        <p className="text-sm text-white font-normal w-20">
          {selectedPresetType === 'video' ? 'Video' : 'Credit'}: {displayCredits}
        </p>
      ) : (
        <div className="w-20" />
      )}

      {/* Camera/Generate Button OR Purchase Button */}
      {photoPreview && !hasCredits ? (
        <button
          onClick={onPurchase}
          className="px-6 py-3 rounded-full bg-white text-black font-semibold hover:bg-gray-100 transition-colors"
        >
          Purchase Credits
        </button>
      ) : (
        <button
          onClick={photoPreview ? onGenerate : onCapture}
          disabled={generating || (!stream && !photoPreview)}
          className="w-16 h-16 rounded-full bg-black border-4 border-white p-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shrink-0"
        >
          <div className="w-full h-full rounded-full bg-gradient-to-b from-red-900 to-red-600" />
        </button>
      )}

      {/* Cartoon Toggle */}
      <div className="w-20 flex justify-end">
        <button
          onClick={onToggleCartoon}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded transition-colors ${
            isCartoonMode ? 'text-yellow-400' : 'text-white/70'
          }`}
          title={isCartoonMode ? 'Switch to Photorealistic' : 'Switch to Cartoon'}
        >
          {isCartoonMode ? (
            // Cartoon mode icon - Paint brush/palette
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
              />
            </svg>
          ) : (
            // Photo mode icon - Camera
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          )}
          <span className="text-[10px] font-medium">
            {isCartoonMode ? 'Cartoon' : 'Photo'}
          </span>
        </button>
      </div>
    </div>
  );
}
