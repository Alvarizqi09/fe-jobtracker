"use client";

import { CoverLetterLanguage } from "@/types/cover-letter.types";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

interface Props {
  selected: CoverLetterLanguage;
  onSelect: (language: CoverLetterLanguage) => void;
}

export function LanguageSelector({ selected, onSelect }: Props) {
  const languages: Array<{
    value: CoverLetterLanguage;
    label: string;
    description: string;
  }> = [
    {
      value: "english",
      label: "English",
      description: "Write in English",
    },
    {
      value: "indonesian",
      label: "Bahasa Indonesia",
      description: "Tulis dalam Bahasa Indonesia",
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Globe className="h-4 w-4 text-muted-foreground" />
        <label className="font-medium">Language / Bahasa</label>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {languages.map((lang) => (
          <Button
            key={lang.value}
            variant={selected === lang.value ? "default" : "outline"}
            onClick={() => onSelect(lang.value)}
            className="justify-center text-sm"
          >
            <div className="text-center">
              <div className="font-medium">{lang.label}</div>
              <div className="text-xs opacity-75">{lang.description}</div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}
