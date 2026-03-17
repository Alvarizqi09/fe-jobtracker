"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCoverLetter } from "@/hooks/useCoverLetter";
import { useJobs } from "@/hooks/useJobs";
import { useProfileStore, calculateCompleteness } from "@/store/profileStore";
import { useProfile } from "@/hooks/useProfile";
import { api } from "@/lib/api";
import { StyleSelector } from "@/components/cover-letter/StyleSelector";
import { LanguageSelector } from "@/components/cover-letter/LanguageSelector";
import { GenerateButton } from "@/components/cover-letter/GenerateButton";
import { CoverLetterEditor } from "@/components/cover-letter/CoverLetterEditor";
import {
  CoverLetterStyle,
  CoverLetterLanguage,
  CoverLetter,
} from "@/types/cover-letter.types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Copy,
  Save,
  Download,
  Trash,
  RefreshCw,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function CoverLetterGeneratorPage() {
  const { jobId } = useParams();
  const router = useRouter();
  const { generateLetter, updateLetter } = useCoverLetter();
  const { profile } = useProfileStore();
  const { fetchProfile } = useProfile();

  const [isReady, setIsReady] = useState(false);
  const completeness = calculateCompleteness(profile);

  const isNew = !jobId || jobId === "new";
  const targetJobId = isNew ? undefined : (jobId as string);

  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [style, setStyle] = useState<CoverLetterStyle>("formal");
  const [language, setLanguage] = useState<CoverLetterLanguage>("english");

  const [generatedLetter, setGeneratedLetter] = useState<CoverLetter | null>(
    null,
  );
  const [editorContent, setEditorContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [isLoadingJob, setIsLoadingJob] = useState(false);

  const lastSavedContent = useRef("");
  const [isEdited, setIsEdited] = useState(false);

  // Fetch profile
  useEffect(() => {
    fetchProfile().finally(() => setIsReady(true));
  }, [fetchProfile]);

  // Fetch job data and pre-fill form
  useEffect(() => {
    if (isNew || !targetJobId) {
      setIsLoadingJob(false);
      return;
    }

    const fetchJobData = async () => {
      setIsLoadingJob(true);
      try {
        const response = await api.get(`/jobs/${targetJobId}`);
        const job = response.data.job;
        setCompanyName(job.company);
        setJobTitle(job.position);
        setJobDescription(job.description || "");
      } catch (error) {
        console.error("Failed to load job:", error);
        toast.error("Failed to load job details");
      } finally {
        setIsLoadingJob(false);
      }
    };

    fetchJobData();
  }, [targetJobId, isNew]);

  // Auto-save logic
  useEffect(() => {
    if (
      !generatedLetter ||
      !editorContent ||
      editorContent === lastSavedContent.current
    )
      return;

    const count = editorContent
      .replace(/<[^>]*>?/gm, "")
      .split(/\s+/)
      .filter(Boolean).length;
    setWordCount(count);

    const timer = setTimeout(async () => {
      try {
        await updateLetter(generatedLetter._id, editorContent);
        lastSavedContent.current = editorContent;
        if (!isEdited) setIsEdited(true);
      } catch (err) {
        // toast handles error
      }
    }, 30000);

    return () => clearTimeout(timer);
  }, [editorContent, generatedLetter, isEdited, updateLetter]);

  const handleGenerate = async () => {
    if (completeness.percentage < 40) {
      toast.error("Please complete your profile first (at least 40%)");
      return;
    }
    if (!companyName || !jobTitle) {
      toast.error("Company Name and Job Title are required.");
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateLetter({
        jobId: targetJobId,
        companyName,
        jobTitle,
        jobDescription,
        style,
        language,
      });
      setGeneratedLetter(result.letter);
      setEditorContent(result.content);
      setWordCount(result.wordCount);
      lastSavedContent.current = result.content;
      setIsEdited(false);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyToClipboard = () => {
    let plainText = editorContent.replace(/<br\s*\/?>/gi, "\n");
    plainText = plainText.replace(/<\/p>/gi, "\n\n");
    plainText = plainText.replace(/<[^>]*>?/gm, "");
    navigator.clipboard.writeText(plainText.trim());
    toast.success("Copied to clipboard!");
  };

  const handleDownload = () => {
    let plainText = editorContent.replace(/<br\s*\/?>/gi, "\n");
    plainText = plainText.replace(/<\/p>/gi, "\n\n");
    plainText = plainText.replace(/<[^>]*>?/gm, "");

    const blob = new Blob([plainText.trim()], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `CoverLetter_${companyName.replace(/\s+/g, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDiscard = () => {
    if (window.confirm("Are you sure you want to discard this letter?")) {
      setGeneratedLetter(null);
      setEditorContent("");
    }
  };

  if (!isReady) {
    return (
      <div className="p-8 text-center text-muted-foreground animate-pulse">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-5rem)] p-4 md:p-6 gap-6 max-w-7xl mx-auto">
      {/* LEFT PANEL */}
      <div className="w-full md:w-[400px] lg:w-[450px] shrink-0 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">Cover Letter Generator</h1>
          <p className="text-muted-foreground">
            Tailor your pitch based on your profile.
          </p>
        </div>

        {completeness.percentage < 40 && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-lg flex items-start gap-3">
            <AlertCircle className="shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Profile Incomplete</p>
              <p className="text-sm mt-1">
                Your profile is only {completeness.percentage}% complete. We
                need at least 40% to generate a good cover letter.
              </p>
              <Button
                onClick={() => router.push("/profile")}
                variant="link"
                className="p-0 h-auto mt-2 text-destructive"
              >
                Complete Profile →
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Company Name *</Label>
            <Input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              disabled={isLoadingJob}
              placeholder="e.g. Acme Corp"
            />
          </div>
          <div className="space-y-2">
            <Label>Job Title *</Label>
            <Input
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              disabled={isLoadingJob}
              placeholder="e.g. Frontend Engineer"
            />
          </div>
          <div className="space-y-2">
            <Label>Job Description (Optional but recommended)</Label>
            <Textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the full job description here..."
              className="min-h-[150px] text-sm"
            />
          </div>
        </div>

        <StyleSelector selected={style} onSelect={setStyle} />

        <LanguageSelector selected={language} onSelect={setLanguage} />

        <details className="w-full border rounded-lg px-4 py-3 bg-card/50 cursor-pointer group">
          <summary className="text-sm font-medium outline-none">
            Profile Data Sent to AI
          </summary>
          <div className="text-sm text-muted-foreground space-y-2 mt-3 cursor-default">
            <p>
              <strong>Headline:</strong> {profile?.headline || "None"}
            </p>
            <p>
              <strong>Top Skills:</strong>{" "}
              {profile?.skills.slice(0, 3).join(", ") || "None"}
            </p>
            <p>
              <strong>Experience:</strong> {profile?.workExperience.length || 0}{" "}
              roles used
            </p>
            <p className="mt-3 text-primary font-medium">
              <Link href="/profile">Edit Profile →</Link>
            </p>
          </div>
        </details>

        <GenerateButton
          isGenerating={isGenerating}
          onClick={handleGenerate}
          disabled={completeness.percentage < 40 || !companyName || !jobTitle}
        />
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 bg-card rounded-xl border shadow-sm overflow-hidden flex flex-col relative min-h-[500px]">
        <AnimatePresence mode="wait">
          {!generatedLetter && !isGenerating ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center p-8 text-center text-muted-foreground"
            >
              <div className="w-20 h-20 mb-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Sparkles size={32} />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Ready to generate
              </h3>
              <p className="max-w-md text-sm">
                Fill in the details on the left and click Generate to craft your
                personalized cover letter tailored to this exact role.
              </p>
            </motion.div>
          ) : isGenerating ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 p-8 space-y-8"
            >
              {[1, 2, 3, 4].map((idx) => (
                <div key={idx} className="space-y-3 w-full">
                  <motion.div
                    className="h-3 bg-primary/10 rounded overflow-hidden"
                    initial={{ width: "80%" }}
                    animate={{ width: ["80%", "100%", "90%", "80%"] }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                      ease: "linear",
                      delay: idx * 0.2,
                    }}
                  />
                  <motion.div
                    className="h-3 bg-primary/10 rounded overflow-hidden"
                    initial={{ width: "95%" }}
                    animate={{ width: ["95%", "85%", "100%", "95%"] }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                      ease: "linear",
                      delay: idx * 0.3,
                    }}
                  />
                  <motion.div
                    className="h-3 bg-primary/10 rounded overflow-hidden"
                    initial={{ width: "60%" }}
                    animate={{ width: ["60%", "75%", "50%", "60%"] }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                      ease: "linear",
                      delay: idx * 0.4,
                    }}
                  />
                  {idx < 4 && (
                    <motion.div
                      className="h-3 bg-primary/10 rounded overflow-hidden w-full"
                      initial={{ opacity: 0.5 }}
                      animate={{ opacity: [0.5, 0.8, 0.5] }}
                      transition={{
                        repeat: Infinity,
                        duration: 2,
                        ease: "linear",
                      }}
                    />
                  )}
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col h-full"
            >
              <div className="p-3 px-5 border-b flex items-center justify-between bg-muted/20">
                <div className="flex items-center gap-3">
                  <div className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full shadow-sm">
                    {wordCount} words
                  </div>
                  <div className="text-xs text-muted-foreground font-medium hidden sm:block">
                    ~{Math.ceil(wordCount / 200)} min read
                  </div>
                  {(isEdited || generatedLetter?.isEdited) && (
                    <div className="px-2.5 py-1 bg-amber-500/10 text-amber-600 border border-amber-500/20 text-xs font-semibold rounded-full shadow-sm">
                      Edited
                    </div>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  Auto-saves continuously
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 md:p-8">
                <CoverLetterEditor
                  content={editorContent}
                  onChange={setEditorContent}
                />
              </div>

              <div className="p-4 border-t bg-muted/10 flex flex-wrap gap-2 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDiscard}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash className="w-4 h-4 mr-2" /> Discard
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  className="hover:bg-primary/5 hover:text-primary"
                >
                  <Download className="w-4 h-4 mr-2" /> Download .txt
                </Button>
                <Button variant="outline" size="sm" onClick={handleGenerate}>
                  <RefreshCw className="w-4 h-4 mr-2" /> Regenerate
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleCopyToClipboard}
                >
                  <Copy className="w-4 h-4 mr-2" /> Copy to clipboard
                </Button>
                <Button
                  size="sm"
                  onClick={async () => {
                    if (!generatedLetter) return;
                    try {
                      await updateLetter(generatedLetter._id, editorContent);
                      toast.success("Saved explicitly!");
                    } catch (e) {}
                  }}
                >
                  <Save className="w-4 h-4 mr-2" /> Save to History
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
