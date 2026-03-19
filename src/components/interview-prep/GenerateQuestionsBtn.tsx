"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onGenerate: () => Promise<void>;
  disabled?: boolean;
}

export function GenerateQuestionsBtn({ onGenerate, disabled }: Props) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await onGenerate();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={disabled || loading}
      className="bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-blue)] text-white hover:opacity-90 transition gap-2"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Sparkles className="h-4 w-4" />
      )}
      {loading ? "Generating..." : "Generate with AI"}
    </Button>
  );
}
