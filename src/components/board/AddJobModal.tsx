"use client";

import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type {
  CreateJobDTO,
  Job,
  JobPriority,
  JobStatus,
  TestType,
} from "@/types/job.types";

const statusSchema = z.enum([
  "wishlist",
  "applied",
  "online_test",
  "interview",
  "offer",
  "rejected",
]);
const prioritySchema = z.enum(["low", "medium", "high"]);

const formSchema = z.object({
  company: z.string().min(1, "Company is required"),
  position: z.string().min(1, "Position is required"),
  status: statusSchema,
  priority: prioritySchema,
  testType: z.enum(["online_test", "psikotest", "intelligence", "technical", "assessment", "other"]).optional(),
  salary: z.string().optional(),
  location: z.string().optional(),
  jobUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  description: z.string().optional(),
  appliedDate: z.string().optional(),
  deadline: z.string().optional(),
  tags: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

function toDto(values: FormValues): CreateJobDTO {
  const dto: CreateJobDTO = {
    company: values.company,
    position: values.position,
    status: values.status,
    priority: values.priority,
  };
  if (values.salary) dto.salary = values.salary;
  if (values.testType && values.status === "online_test") dto.testType = values.testType;
  if (values.location) dto.location = values.location;
  if (values.jobUrl) dto.jobUrl = values.jobUrl;
  if (values.description) dto.description = values.description;
  if (values.appliedDate)
    dto.appliedDate = new Date(values.appliedDate).toISOString();
  if (values.deadline) dto.deadline = new Date(values.deadline).toISOString();
  const tags = values.tags
    ?.split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  if (tags && tags.length > 0) dto.tags = tags;
  return dto;
}

export function AddJobModal({
  open,
  onOpenChange,
  mode,
  initialStatus,
  job,
  onCreate,
  onUpdate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  initialStatus: JobStatus;
  job: Job | null;
  onCreate: (dto: CreateJobDTO) => Promise<void>;
  onUpdate: (id: string, dto: Partial<CreateJobDTO>) => Promise<void>;
}) {
  const defaultValues = useMemo<FormValues>(() => {
    if (mode === "edit" && job) {
      return {
        company: job.company,
        position: job.position,
        status: job.status,
        priority: job.priority,
        salary: job.salary ?? "",
        testType: job.testType,
        location: job.location ?? "",
        jobUrl: job.jobUrl ?? "",
        description: job.description ?? "",
        appliedDate: job.appliedDate ? job.appliedDate.slice(0, 10) : "",
        deadline: job.deadline ? job.deadline.slice(0, 10) : "",
        tags: job.tags?.join(", ") ?? "",
      };
    }
    return {
      company: "",
      position: "",
      status: initialStatus,
      priority: "medium",
      salary: "",
      testType: undefined,
      location: "",
      jobUrl: "",
      description: "",
      appliedDate: "",
      deadline: "",
      tags: "",
    };
  }, [initialStatus, job, mode]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const status = watch("status");
  const priority = watch("priority");

  const onSubmit = async (values: FormValues): Promise<void> => {
    setSubmitting(true);
    try {
      if (mode === "create") {
        await onCreate(toDto(values));
        toast.success("Job created");
      } else if (mode === "edit" && job) {
        await onUpdate(job._id, toDto(values));
        toast.success("Job updated");
      }
      onOpenChange(false);
    } catch {
      toast.error("Save failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open ? (
          <DialogContent className="max-w-[95vw] sm:max-w-2xl bg-(--bg-card) border-border text-(--text-primary) max-h-[90vh] flex flex-col">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col h-full overflow-hidden"
            >
              <DialogHeader className="shrink-0">
                <DialogTitle className="font-syne">
                  {mode === "create" ? "Add Job" : "Edit Job"}
                </DialogTitle>
              </DialogHeader>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 overflow-y-auto px-4 pb-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="company">Company <span className="text-(--status-rejected)">*</span></Label>
                  <Input
                    id="company"
                    {...register("company")}
                    className="bg-(--bg-secondary) border-border"
                  />
                  {errors.company ? (
                    <div className="text-xs text-(--status-rejected)">
                      {errors.company.message}
                    </div>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">Position <span className="text-(--status-rejected)">*</span></Label>
                  <Input
                    id="position"
                    {...register("position")}
                    className="bg-(--bg-secondary) border-border"
                  />
                  {errors.position ? (
                    <div className="text-xs text-(--status-rejected)">
                      {errors.position.message}
                    </div>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={status}
                    onValueChange={(v) => setValue("status", v as JobStatus)}
                  >
                    <SelectTrigger className="bg-(--bg-secondary) border-border">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="bg-(--bg-card) border-border">
                      {(
                        [
                          "wishlist",
                          "applied",
                          "online_test",
                          "interview",
                          "offer",
                          "rejected",
                        ] as JobStatus[]
                      ).map((s) => (
                        <SelectItem key={s} value={s} className="capitalize">
                          {s === "online_test" ? "Online Test" : s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Conditional Test Type dropdown */}
                {status === "online_test" && (
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Test Type</Label>
                    <Select
                      value={watch("testType") ?? ""}
                      onValueChange={(v) => setValue("testType", v as TestType)}
                    >
                      <SelectTrigger className="bg-(--bg-secondary) border-border">
                        <SelectValue placeholder="Select test type..." />
                      </SelectTrigger>
                      <SelectContent className="bg-(--bg-card) border-border">
                        {([
                          { value: "online_test", label: "Online Test" },
                          { value: "psikotest", label: "Psikotest" },
                          { value: "intelligence", label: "Intelligence Test" },
                          { value: "technical", label: "Technical Test" },
                          { value: "assessment", label: "Assessment" },
                          { value: "other", label: "Other" },
                        ] as const).map((t) => (
                          <SelectItem key={t.value} value={t.value}>
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select
                    value={priority}
                    onValueChange={(v) =>
                      setValue("priority", v as JobPriority)
                    }
                  >
                    <SelectTrigger className="bg-(--bg-secondary) border-border">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent className="bg-(--bg-card) border-border">
                      {(["low", "medium", "high"] as JobPriority[]).map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="salary">Salary</Label>
                  <Input
                    id="salary"
                    {...register("salary")}
                    className="bg-(--bg-secondary) border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    {...register("location")}
                    className="bg-(--bg-secondary) border-border"
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="jobUrl">Job URL</Label>
                  <Input
                    id="jobUrl"
                    {...register("jobUrl")}
                    className="bg-(--bg-secondary) border-border"
                  />
                  {errors.jobUrl ? (
                    <div className="text-xs text-(--status-rejected)">
                      {errors.jobUrl.message}
                    </div>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="appliedDate">Applied date</Label>
                  <Input
                    id="appliedDate"
                    type="date"
                    {...register("appliedDate")}
                    className="bg-(--bg-secondary) border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input
                    id="deadline"
                    type="date"
                    {...register("deadline")}
                    className="bg-(--bg-secondary) border-border"
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    {...register("tags")}
                    className="bg-(--bg-secondary) border-border"
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    rows={5}
                    {...register("description")}
                    className="bg-(--bg-secondary) border-border"
                  />
                </div>

                <div className="sm:col-span-2 flex items-center justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    className="hover:bg-(--bg-hover)"
                    onClick={() => onOpenChange(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="bg-(--accent-cyan) text-black hover:opacity-90"
                  >
                    {submitting
                      ? "Saving…"
                      : mode === "create"
                        ? "Create"
                        : "Save"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </DialogContent>
        ) : null}
      </AnimatePresence>
    </Dialog>
  );
}
