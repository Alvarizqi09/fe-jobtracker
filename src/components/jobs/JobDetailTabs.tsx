"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, DollarSign, ExternalLink, MapPin, Tag, Copy, FileText, Zap, Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { ActivityLog } from "./ActivityLog";
import { InterviewPrepPanel } from "@/components/interview-prep/InterviewPrepPanel";
import { SalaryNegotiationCard } from "@/components/salary/SalaryNegotiationCard";
import type { Job } from "@/types/job.types";
import type { CoverLetter } from "@/types/cover-letter.types";
import type { ActivityEvent } from "@/types/analytics.types";
import type { InterviewQuestion, OfferDetails } from "@/types/notification.types";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function daysUntil(dateStr: string): number {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

interface Props {
  job: Job;
  coverLetters: CoverLetter[];
  onNotesChange: (notes: string) => void;
  onInterviewQuestionsChange: (questions: InterviewQuestion[]) => void;
  onOfferDetailsChange: (details: OfferDetails) => void;
}

export function JobDetailTabs({ job, coverLetters, onNotesChange, onInterviewQuestionsChange, onOfferDetailsChange }: Props) {
  const [notes, setNotes] = useState(job.notes ?? "");
  const [questions, setQuestions] = useState<InterviewQuestion[]>(job.interviewQuestions ?? []);
  const [selectedLetter, setSelectedLetter] = useState<CoverLetter | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setNotes(job.notes ?? "");
  }, [job.notes]);

  const handleNotesChange = useCallback(
    (value: string) => {
      setNotes(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        onNotesChange(value);
      }, 2000);
    },
    [onNotesChange],
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const deadlineDays = job.deadline ? daysUntil(job.deadline) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-(--bg-secondary) border border-border p-1 rounded-lg w-full sm:w-auto overflow-x-auto flex-nowrap">
          <TabsTrigger
            value="overview"
            className="text-sm data-[state=active]:bg-(--bg-card) data-[state=active]:text-(--text-primary) text-(--text-secondary)"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="notes"
            className="text-sm data-[state=active]:bg-(--bg-card) data-[state=active]:text-(--text-primary) text-(--text-secondary)"
          >
            Notes & Prep
          </TabsTrigger>
          <TabsTrigger
            value="cover-letters"
            className="text-sm data-[state=active]:bg-(--bg-card) data-[state=active]:text-(--text-primary) text-(--text-secondary)"
          >
            Cover Letters
          </TabsTrigger>
          <TabsTrigger
            value="activity"
            className="text-sm data-[state=active]:bg-(--bg-card) data-[state=active]:text-(--text-primary) text-(--text-secondary)"
          >
            Activity
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Overview */}
        <TabsContent
          value="overview"
          className="mt-4 rounded-xl border border-border bg-(--bg-card) p-5 md:p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Salary */}
            {job.salary && (
              <div className="flex items-start gap-3">
                <DollarSign className="h-4 w-4 text-(--accent-cyan) mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs text-(--text-muted) uppercase tracking-wider">
                    Salary
                  </div>
                  <div className="text-sm text-(--text-primary) mt-0.5">
                    {job.salary}
                  </div>
                </div>
              </div>
            )}

            {/* Location */}
            {job.location && (
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-(--accent-cyan) mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs text-(--text-muted) uppercase tracking-wider">
                    Location
                  </div>
                  <div className="text-sm text-(--text-primary) mt-0.5">
                    {job.location}
                  </div>
                </div>
              </div>
            )}

            {/* Applied Date */}
            {job.appliedDate && (
              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 text-(--accent-cyan) mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs text-(--text-muted) uppercase tracking-wider">
                    Applied Date
                  </div>
                  <div className="text-sm text-(--text-primary) mt-0.5">
                    {formatDate(job.appliedDate)}
                  </div>
                </div>
              </div>
            )}

            {/* Deadline */}
            {job.deadline && (
              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-(--accent-cyan) mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs text-(--text-muted) uppercase tracking-wider">
                    Deadline
                  </div>
                  <div className="text-sm text-(--text-primary) mt-0.5 flex items-center gap-2">
                    {formatDate(job.deadline)}
                    {deadlineDays !== null && deadlineDays >= 0 && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          deadlineDays <= 3
                            ? "bg-[#EF444420] text-[#EF4444]"
                            : "bg-[#F59E0B20] text-[#F59E0B]"
                        }`}
                      >
                        <Zap className="h-3 w-3" />
                        {deadlineDays === 0
                          ? "Today!"
                          : `${deadlineDays}d remaining`}
                      </span>
                    )}
                    {deadlineDays !== null && deadlineDays < 0 && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#EF444420] text-[#EF4444]">
                        Expired
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Job URL */}
            {job.jobUrl && (
              <div className="flex items-start gap-3">
                <ExternalLink className="h-4 w-4 text-(--accent-cyan) mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs text-(--text-muted) uppercase tracking-wider">
                    Job URL
                  </div>
                  <a
                    href={job.jobUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-(--accent-cyan) hover:underline mt-0.5 block truncate max-w-[calc(100vw-7rem)] sm:max-w-xs"
                  >
                    {job.jobUrl}
                  </a>
                </div>
              </div>
            )}

            {/* Created */}
            <div className="flex items-start gap-3">
              <Calendar className="h-4 w-4 text-(--text-muted) mt-0.5 shrink-0" />
              <div>
                <div className="text-xs text-(--text-muted) uppercase tracking-wider">
                  Tracked Since
                </div>
                <div className="text-sm text-(--text-secondary) mt-0.5">
                  {formatDate(job.createdAt)}
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          {job.tags && job.tags.length > 0 && (
            <div className="mt-5 pt-5 border-t border-border">
              <div className="flex items-center gap-2 mb-2">
                <Tag className="h-3.5 w-3.5 text-(--text-muted)" />
                <span className="text-xs text-(--text-muted) uppercase tracking-wider">
                  Tags
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {job.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-md border border-border bg-muted px-2.5 py-1 text-xs text-(--text-secondary)"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {job.description && (
            <div className="mt-5 pt-5 border-t border-border">
              <div className="text-xs text-(--text-muted) uppercase tracking-wider mb-2">
                Description
              </div>
              <p className="text-sm text-(--text-secondary) leading-relaxed whitespace-pre-wrap">
                {job.description}
              </p>
            </div>
          )}

          {/* Salary Negotiation (only for offer status) */}
          {job.status === "offer" && (
            <div className="mt-5 pt-5 border-t border-border">
              <SalaryNegotiationCard
                offerDetails={job.offerDetails}
                onUpdate={onOfferDetailsChange}
              />
            </div>
          )}
        </TabsContent>

        {/* Tab 2: Interview Prep */}
        <TabsContent
          value="notes"
          className="mt-4 rounded-xl border border-border bg-(--bg-card) p-5 md:p-6"
        >
          {/* Notes area */}
          <div className="mb-6">
            <label className="text-xs text-(--text-muted) uppercase tracking-wider mb-2 block">Personal Notes</label>
            <textarea
              value={notes}
              onChange={(e) => handleNotesChange(e.target.value)}
              placeholder="Add private notes about this position..."
              className="w-full min-h-[100px] text-sm bg-(--bg-primary) border border-border rounded-lg p-3 text-(--text-primary) placeholder:text-(--text-muted) resize-y focus:outline-none focus:border-(--accent-cyan)"
            />
          </div>

          {/* Interview Prep Panel */}
          <InterviewPrepPanel
            jobId={job._id}
            questions={questions}
            onQuestionsChange={(q) => {
              setQuestions(q);
              onInterviewQuestionsChange(q);
            }}
          />
        </TabsContent>

        {/* Tab 3: Cover Letters */}
        <TabsContent
          value="cover-letters"
          className="mt-4 rounded-xl border border-border bg-(--bg-card) p-5 md:p-6"
        >
          {coverLetters.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-(--text-secondary) mb-3">
                No cover letters generated yet
              </p>
              <a
                href={`/cover-letter/${job._id}`}
                className="inline-flex items-center gap-1.5 text-sm text-(--accent-cyan) hover:underline"
              >
                <Sparkles className="h-4 w-4" /> Generate Cover Letter
              </a>
            </div>
          ) : (
            <div className="space-y-3">
              {coverLetters.map((cl) => (
                <div
                  key={cl._id}
                  onClick={() => setSelectedLetter(cl)}
                  className="rounded-lg border border-border bg-(--bg-secondary) p-4 cursor-pointer hover:border-(--accent-cyan)/40 transition group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="text-xs capitalize bg-muted border border-border"
                      >
                        {cl.style}
                      </Badge>
                      <span className="text-xs text-(--text-muted)">
                        {cl.wordCount} words · {cl.language}
                      </span>
                    </div>
                    <span className="text-xs text-(--text-muted)">
                      {formatDate(cl.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-(--text-secondary) line-clamp-3">
                    {cl.content.substring(0, 200)}
                    {cl.content.length > 200 ? "..." : ""}
                  </p>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Tab 4: Activity */}
        <TabsContent
          value="activity"
          className="mt-4 rounded-xl border border-border bg-(--bg-card) p-5 md:p-6"
        >
          <ActivityLog events={job.activityLog ?? []} />
        </TabsContent>
      </Tabs>

      {/* Cover Letter Modal */}
      <Dialog open={!!selectedLetter} onOpenChange={(open) => !open && setSelectedLetter(null)}>
        <DialogContent className="max-w-2xl bg-(--bg-card) border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg text-(--text-primary)">
              <FileText className="w-5 h-5 text-(--accent-cyan)" />
              Cover Letter
            </DialogTitle>
          </DialogHeader>
          {selectedLetter && (
            <div className="mt-2">
              <div className="flex items-center justify-between mb-4 border-b border-border pb-4">
                <div className="flex gap-2">
                  <Badge variant="secondary" className="bg-muted text-(--text-primary) border-border capitalize">
                    {selectedLetter.style}
                  </Badge>
                  <span className="text-xs text-(--text-muted) flex items-center">
                    {selectedLetter.wordCount} words · {selectedLetter.language}
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const tempElement = document.createElement("div");
                    tempElement.innerHTML = selectedLetter.content;
                    const text = tempElement.textContent || tempElement.innerText || "";
                    navigator.clipboard.writeText(text);
                    toast.success("Copied to clipboard");
                  }}
                  className="h-8 text-xs border-border hover:bg-(--bg-hover) text-(--text-secondary)"
                >
                  <Copy className="w-3.5 h-3.5 mr-1.5" />
                  Copy
                </Button>
              </div>
              <div 
                className="prose prose-sm prose-invert max-w-none max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar text-(--text-secondary)"
                dangerouslySetInnerHTML={{ __html: selectedLetter.content }}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
