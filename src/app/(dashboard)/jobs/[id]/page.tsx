"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useJobs } from "@/hooks/useJobs";
import { useCoverLetter } from "@/hooks/useCoverLetter";
import { JobDetailHeader } from "@/components/jobs/JobDetailHeader";
import { JobDetailTabs } from "@/components/jobs/JobDetailTabs";
import type { Job } from "@/types/job.types";
import type { CoverLetter } from "@/types/cover-letter.types";
import type { InterviewQuestion, OfferDetails } from "@/types/notification.types";
import { api } from "@/lib/api";

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;
  const { updateJob, deleteJob } = useJobs();
  const { coverLetters, fetchLetters } = useCoverLetter();

  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [jobCoverLetters, setJobCoverLetters] = useState<CoverLetter[]>([]);

  useEffect(() => {
    async function loadJob() {
      setIsLoading(true);
      try {
        const res = await api.get<{ job: Job }>(`/jobs/${jobId}`);
        setJob(res.data.job);
      } catch {
        toast.error("Failed to load job");
        router.push("/board");
      } finally {
        setIsLoading(false);
      }
    }
    if (jobId) loadJob();
  }, [jobId, router]);

  useEffect(() => {
    fetchLetters();
  }, [fetchLetters]);

  useEffect(() => {
    setJobCoverLetters(coverLetters.filter((cl) => cl.jobId === jobId));
  }, [coverLetters, jobId]);

  const handleEdit = useCallback(() => {
    router.push("/board");
  }, [router]);

  const handleDelete = useCallback(async () => {
    if (!job) return;
    try {
      await deleteJob(job._id);
      toast.success("Job deleted");
      router.push("/board");
    } catch {
      toast.error("Delete failed");
    }
  }, [job, deleteJob, router]);

  const handleNotesChange = useCallback(
    async (notes: string) => {
      if (!job) return;
      try {
        const updated = await updateJob(job._id, { notes });
        setJob(updated);
      } catch {
        toast.error("Failed to save notes");
      }
    },
    [job, updateJob],
  );

  const handleInterviewQuestionsChange = useCallback(
    async (questions: InterviewQuestion[]) => {
      if (!job) return;
      try {
        await api.put(`/jobs/${job._id}/interview-prep`, questions);
      } catch {
        toast.error("Failed to save interview prep");
      }
    },
    [job],
  );

  const handleOfferDetailsChange = useCallback(
    async (details: OfferDetails) => {
      if (!job) return;
      try {
        await updateJob(job._id, { offerDetails: details } as any);
        setJob((prev) => (prev ? { ...prev, offerDetails: details } : prev));
      } catch {
        toast.error("Failed to save offer details");
      }
    },
    [job, updateJob],
  );

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 space-y-4">
        <div className="h-28 rounded-xl bg-(--bg-card) border border-[rgba(60,90,140,0.3)] animate-pulse" />
        <div className="h-96 rounded-xl bg-(--bg-card) border border-[rgba(60,90,140,0.3)] animate-pulse" />
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="p-4 md:p-6 overflow-y-auto h-full space-y-4">
      <JobDetailHeader job={job} onEdit={handleEdit} onDelete={handleDelete} />
      <JobDetailTabs
        job={job}
        coverLetters={jobCoverLetters}
        onNotesChange={handleNotesChange}
        onInterviewQuestionsChange={handleInterviewQuestionsChange}
        onOfferDetailsChange={handleOfferDetailsChange}
      />
    </div>
  );
}
