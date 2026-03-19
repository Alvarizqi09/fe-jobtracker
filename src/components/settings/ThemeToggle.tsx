"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sun, Moon, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";

const THEMES = [
  { value: "dark", icon: Moon, label: "Dark" },
  { value: "light", icon: Sun, label: "Light" },
  { value: "system", icon: Monitor, label: "System" },
] as const;

export function ThemeToggle({ size = "default" }: { size?: "default" | "sm" }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  if (size === "sm") {
    // Small toggle for Topbar — just cycles through
    const currentIdx = THEMES.findIndex((t) => t.value === theme) ?? 0;
    const CurrentIcon = THEMES[currentIdx]?.icon ?? Moon;
    const next = THEMES[(currentIdx + 1) % THEMES.length]!;

    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-(--text-muted) hover:text-(--text-primary) hover:bg-(--bg-hover)"
        onClick={() => setTheme(next.value)}
      >
        <motion.div
          key={theme}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <CurrentIcon className="h-4 w-4" />
        </motion.div>
      </Button>
    );
  }

  return (
    <div className="flex gap-2">
      {THEMES.map((t) => (
        <Button
          key={t.value}
          variant={theme === t.value ? "default" : "ghost"}
          size="sm"
          onClick={() => setTheme(t.value)}
          className={`gap-2 ${theme === t.value ? "" : "text-(--text-muted)"}`}
        >
          <t.icon className="h-4 w-4" />
          {t.label}
        </Button>
      ))}
    </div>
  );
}
