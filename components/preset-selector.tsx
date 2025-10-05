"use client";

import { getAllPresets } from "@/lib/presets";
import { cn } from "@/lib/utils";

interface PresetSelectorProps {
  selectedPreset: string | null;
  onPresetChange: (presetId: string) => void;
  disabled?: boolean;
  hideWithUs?: boolean;
  className?: string;
}

const BUTTON_BASE_CLASSES =
  "px-3 py-2 rounded-2xl text-sm whitespace-nowrap transition-colors font-bold";

export function PresetSelector({
  selectedPreset,
  onPresetChange,
  disabled,
  hideWithUs,
  className,
}: PresetSelectorProps) {
  const presets = getAllPresets().filter(
    (preset) => !(hideWithUs && preset.requiresRefs)
  );

  return (
    <div
      className={cn(
        "flex gap-4 items-center  px-6 overflow-x-auto scrollbar-hide ",
        className
      )}
    >
      {presets.map((preset) => {
        const isSelected = preset.id === selectedPreset;

        return (
          <button
            key={preset.id}
            type="button"
            onClick={() => onPresetChange(preset.id)}
            disabled={disabled}
            className={cn(
              BUTTON_BASE_CLASSES,
              isSelected
                ? "bg-red-900/70 text-white border border-red-500/50"
                : "bg-white/30 backdrop-blur-sm text-black hover:bg-white/20",
              disabled && !isSelected && "cursor-not-allowed opacity-50"
            )}
          >
            {preset.name}
          </button>
        );
      })}
    </div>
  );
}
