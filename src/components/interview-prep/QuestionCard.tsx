"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check, Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { InterviewQuestion } from "@/types/notification.types";

const CATEGORY_COLORS: Record<string, string> = {
  technical: "#3B82F6",
  behavioral: "#F59E0B",
  company: "#8B5CF6",
  roleSpecific: "#10B981",
};

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "#10B981",
  medium: "#F59E0B",
  hard: "#EF4444",
};

interface Props {
  question: InterviewQuestion;
  onAnswerChange: (id: string, answer: string) => void;
  onMarkReady: (id: string, isAnswered: boolean) => void;
}

export function QuestionCard({ question, onAnswerChange, onMarkReady }: Props) {
  const [open, setOpen] = useState(false);
  const [showHint, setShowHint] = useState(false);

  return (
    <div
      className={`rounded-xl border transition overflow-hidden ${
        question.isAnswered
          ? "border-[var(--status-offer)]/50 bg-[rgba(16,185,129,0.05)]"
          : "border-[rgba(60,90,140,0.5)] bg-(--bg-secondary)"
      }`}
    >
      {/* Header */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-start gap-3 p-4 text-left"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Badge
              variant="secondary"
              className="text-[10px] uppercase tracking-wider border"
              style={{
                borderColor: CATEGORY_COLORS[question.category] + "60",
                color: CATEGORY_COLORS[question.category],
                backgroundColor:
                  CATEGORY_COLORS[question.category] + "15",
              }}
            >
              {question.category === "roleSpecific"
                ? "Role-Specific"
                : question.category}
            </Badge>
            <Badge
              variant="secondary"
              className="text-[10px] uppercase tracking-wider border"
              style={{
                borderColor: DIFFICULTY_COLORS[question.difficulty] + "60",
                color: DIFFICULTY_COLORS[question.difficulty],
                backgroundColor:
                  DIFFICULTY_COLORS[question.difficulty] + "15",
              }}
            >
              {question.difficulty}
            </Badge>
            {question.isAnswered && (
              <Check className="h-4 w-4 text-(--status-offer)" />
            )}
          </div>
          <p className="text-sm text-(--text-primary) leading-relaxed">
            {question.question}
          </p>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-(--text-muted) shrink-0 mt-1 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Expandable Body */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div className="px-4 pb-4 space-y-3">
              {/* Hint */}
              {question.hint && (
                <div>
                  {!showHint ? (
                    <button
                      type="button"
                      onClick={() => setShowHint(true)}
                      className="flex items-center gap-1.5 text-xs text-(--accent-cyan) hover:underline"
                    >
                      <Lightbulb className="h-3.5 w-3.5" />
                      Show hint
                    </button>
                  ) : (
                    <div className="text-xs text-(--text-secondary) flex items-start gap-2 bg-[rgba(0,212,255,0.06)] border border-[rgba(0,212,255,0.15)] rounded-lg px-3 py-2">
                      <Lightbulb className="h-4 w-4 shrink-0 text-(--accent-cyan)" />
                      <span>{question.hint}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Answer */}
              <Textarea
                placeholder="Write your prepared answer here..."
                value={question.userAnswer ?? ""}
                onChange={(e) =>
                  onAnswerChange(question.id, e.target.value)
                }
                className="min-h-[100px] text-sm bg-(--bg-primary) border-[rgba(60,90,140,0.4)] text-(--text-primary) placeholder:text-(--text-muted)"
              />

              {/* Mark Ready */}
              <Button
                variant={question.isAnswered ? "secondary" : "default"}
                size="sm"
                onClick={() =>
                  onMarkReady(question.id, !question.isAnswered)
                }
                className={
                  question.isAnswered
                    ? "text-(--status-offer) border-[var(--status-offer)]/40"
                    : ""
                }
              >
                <Check className="h-3.5 w-3.5 mr-1.5" />
                {question.isAnswered ? "Marked Ready ✓" : "Mark as Ready"}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
