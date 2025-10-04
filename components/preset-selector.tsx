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
        "flex gap-4 items-center justify-center px-6 overflow-x-auto",
        className
      )}
    >
      {presets.map((preset) => {
        const isSelected = preset.id === selectedPreset;

        // Match legacy label from home page when available
        const label = preset.id === "banff" ? "Lake Louise" : preset.name;

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
                : "bg-white/10 backdrop-blur-sm text-black hover:bg-white/20",
              disabled && !isSelected && "cursor-not-allowed opacity-50"
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
