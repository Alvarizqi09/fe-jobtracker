"use client";

import { X } from "lucide-react";

interface Props {
  label: string;
  onRemove: () => void;
}

export function FilterChip({ label, onRemove }: Props) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-[rgba(60,90,140,0.5)] bg-[rgba(15,25,45,0.7)] px-2.5 py-1 text-xs text-(--text-secondary)">
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="ml-0.5 rounded-full hover:bg-(--bg-hover) p-0.5 transition"
      >
        <X className="h-3 w-3 text-(--text-muted)" />
      </button>
    </span>
  );
}
