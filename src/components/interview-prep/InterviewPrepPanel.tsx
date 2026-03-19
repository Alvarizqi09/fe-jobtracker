"use client";

import { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus, BookOpen } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PrepProgress } from "./PrepProgress";
import { GenerateQuestionsBtn } from "./GenerateQuestionsBtn";
import { QuestionCard } from "./QuestionCard";
import type { InterviewQuestion } from "@/types/notification.types";

const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "technical", label: "Technical" },
  { value: "behavioral", label: "Behavioral" },
  { value: "company", label: "Company" },
  { value: "roleSpecific", label: "Role-Specific" },
] as const;

interface Props {
  jobId: string;
  questions: InterviewQuestion[];
  onQuestionsChange: (questions: InterviewQuestion[]) => void;
}

export function InterviewPrepPanel({
  jobId,
  questions,
  onQuestionsChange,
}: Props) {
  const [category, setCategory] = useState("all");

  const answered = questions.filter((q) => q.isAnswered).length;

  const filtered = useMemo(() => {
    if (category === "all") return questions;
    return questions.filter((q) => q.category === category);
  }, [questions, category]);

  const handleGenerate = useCallback(async () => {
    try {
      const { data } = await api.post(
        `/jobs/${jobId}/interview-prep/generate`,
      );
      const newQuestions = [...questions, ...data.questions];
      onQuestionsChange(newQuestions);
      toast.success(`Generated ${data.questions.length} questions`);
    } catch {
      toast.error("Failed to generate questions");
    }
  }, [jobId, questions, onQuestionsChange]);

  const handleAnswerChange = useCallback(
    (id: string, answer: string) => {
      const updated = questions.map((q) =>
        q.id === id ? { ...q, userAnswer: answer } : q,
      );
      onQuestionsChange(updated);
      // Fire-and-forget save
      api
        .patch(`/jobs/${jobId}/interview-prep/${id}`, { userAnswer: answer })
        .catch(() => {});
    },
    [questions, onQuestionsChange, jobId],
  );

  const handleMarkReady = useCallback(
    (id: string, isAnswered: boolean) => {
      const updated = questions.map((q) =>
        q.id === id ? { ...q, isAnswered } : q,
      );
      onQuestionsChange(updated);
      api
        .patch(`/jobs/${jobId}/interview-prep/${id}`, { isAnswered })
        .catch(() => {});
    },
    [questions, onQuestionsChange, jobId],
  );

  const handleAddCustom = useCallback(() => {
    const newQ: InterviewQuestion = {
      id: `q_${Date.now()}_custom`,
      question: "New custom question",
      category: "roleSpecific",
      difficulty: "medium",
      hint: "",
      userAnswer: "",
      isAnswered: false,
      source: "user_added",
    };
    const updated = [...questions, newQ];
    onQuestionsChange(updated);
    api.put(`/jobs/${jobId}/interview-prep`, updated).catch(() => {});
  }, [questions, onQuestionsChange, jobId]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-(--accent-cyan)" />
          <h3 className="font-syne text-lg text-(--text-primary)">
            Interview Preparation
          </h3>
        </div>
        <GenerateQuestionsBtn onGenerate={handleGenerate} />
      </div>

      {/* Progress */}
      {questions.length > 0 && (
        <PrepProgress answered={answered} total={questions.length} />
      )}

      {/* Category Tabs */}
      {questions.length > 0 && (
        <Tabs value={category} onValueChange={setCategory}>
          <TabsList className="bg-(--bg-secondary) border border-[rgba(60,90,140,0.4)]">
            {CATEGORIES.map((cat) => (
              <TabsTrigger
                key={cat.value}
                value={cat.value}
                className="text-xs data-[state=active]:bg-(--bg-hover) data-[state=active]:text-(--text-primary) text-(--text-muted)"
              >
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}

      {/* Questions List */}
      {questions.length === 0 ? (
        <div className="text-center py-10">
          <BookOpen className="h-10 w-10 text-(--text-muted) mx-auto mb-3" />
          <p className="text-sm text-(--text-secondary) mb-1">
            No interview questions yet
          </p>
          <p className="text-xs text-(--text-muted)">
            Click "Generate with AI" to get started
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((q) => (
            <QuestionCard
              key={q.id}
              question={q}
              onAnswerChange={handleAnswerChange}
              onMarkReady={handleMarkReady}
            />
          ))}
        </div>
      )}

      {/* Add Custom */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleAddCustom}
        className="text-(--text-muted) hover:text-(--text-secondary)"
      >
        <Plus className="h-3.5 w-3.5 mr-1.5" />
        Add Custom Question
      </Button>
    </motion.div>
  );
}
