"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Palette,
  Bell,
  User,
  AlertTriangle,
  Download,
  Trash2,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/settings/ThemeToggle";
import { ExportMenu } from "@/components/export/ExportMenu";
import { useJobs } from "@/hooks/useJobs";
import { api } from "@/lib/api";
import { logOut } from "@/lib/firebase";

export default function SettingsPage() {
  const { jobs, fetchJobs } = useJobs();
  const router = useRouter();
  const [staleThreshold, setStaleThreshold] = useState(14);
  const [deleting, setDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleDeleteAllJobs = useCallback(async () => {
    if (!confirm("Are you sure you want to delete ALL your jobs?")) return;
    try {
      await Promise.all(jobs.map((j) => api.delete(`/jobs/${j._id}`)));
      toast.success("All jobs deleted");
      fetchJobs();
    } catch {
      toast.error("Failed to delete jobs");
    }
  }, [jobs, fetchJobs]);

  const handleDeleteAccount = useCallback(async () => {
    if (confirmText !== "DELETE") return;
    setDeleting(true);
    try {
      await api.delete("/users/me");
      await logOut();
      router.replace("/login");
    } catch {
      toast.error("Failed to delete account");
      setDeleting(false);
    }
  }, [confirmText, router]);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight font-syne mb-2 text-(--text-primary)">
          Settings
        </h1>
        <p className="text-sm text-(--text-muted)">
          Manage your preferences and account.
        </p>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="bg-(--bg-secondary) border border-[rgba(60,90,140,0.4)] mb-6 overflow-x-auto flex-nowrap w-full sm:w-auto">
          <TabsTrigger
            value="general"
            className="text-xs data-[state=active]:bg-(--bg-hover) data-[state=active]:text-(--text-primary) text-(--text-muted) gap-1.5"
          >
            <Palette className="h-3.5 w-3.5" />
            General
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="text-xs data-[state=active]:bg-(--bg-hover) data-[state=active]:text-(--text-primary) text-(--text-muted) gap-1.5"
          >
            <Bell className="h-3.5 w-3.5" />
            Notifications
          </TabsTrigger>
          <TabsTrigger
            value="profile"
            className="text-xs data-[state=active]:bg-(--bg-hover) data-[state=active]:text-(--text-primary) text-(--text-muted) gap-1.5"
          >
            <User className="h-3.5 w-3.5" />
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="danger"
            className="text-xs data-[state=active]:bg-(--bg-hover) data-[state=active]:text-(--text-primary) text-(--text-muted) gap-1.5"
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            Danger Zone
          </TabsTrigger>
        </TabsList>

        {/* General */}
        <TabsContent value="general">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="rounded-xl border border-[rgba(60,90,140,0.4)] bg-(--bg-card) p-6">
              <h3 className="text-sm font-medium text-(--text-primary) mb-4">
                Appearance
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-(--text-secondary)">Theme</p>
                  <p className="text-xs text-(--text-muted)">
                    Choose dark, light, or match your system
                  </p>
                </div>
                <ThemeToggle />
              </div>
            </div>

            <div className="rounded-xl border border-[rgba(60,90,140,0.4)] bg-(--bg-card) p-6">
              <h3 className="text-sm font-medium text-(--text-primary) mb-4">
                Export Data
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-(--text-secondary)">
                    Download your data
                  </p>
                  <p className="text-xs text-(--text-muted)">
                    Export jobs as CSV or JSON
                  </p>
                </div>
                <ExportMenu jobs={jobs} />
              </div>
            </div>
          </motion.div>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-[rgba(60,90,140,0.4)] bg-(--bg-card) p-6 space-y-5"
          >
            <h3 className="text-sm font-medium text-(--text-primary)">
              Notification Preferences
            </h3>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-(--text-secondary)">
                    Stale application threshold
                  </p>
                  <p className="text-xs text-(--text-muted)">
                    Days before an application is flagged
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={1}
                    max={90}
                    className="w-20 bg-(--bg-primary) border-[rgba(60,90,140,0.4)] text-(--text-primary) text-center"
                    value={staleThreshold}
                    onChange={(e) =>
                      setStaleThreshold(Number(e.target.value))
                    }
                  />
                  <span className="text-xs text-(--text-muted)">days</span>
                </div>
              </div>
            </div>
          </motion.div>
        </TabsContent>

        {/* Profile */}
        <TabsContent value="profile">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-[rgba(60,90,140,0.4)] bg-(--bg-card) p-6"
          >
            <h3 className="text-sm font-medium text-(--text-primary) mb-4">
              Profile
            </h3>
            <p className="text-sm text-(--text-secondary) mb-4">
              Manage your profile information used for cover letter generation.
            </p>
            <Button
              variant="outline"
              onClick={() => router.push("/profile")}
              className="border-[rgba(60,90,140,0.4)]"
            >
              <User className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </motion.div>
        </TabsContent>

        {/* Danger Zone */}
        <TabsContent value="danger">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-6">
              <h3 className="text-sm font-medium text-red-400 mb-4">
                Danger Zone
              </h3>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-(--text-secondary)">
                      Delete all jobs
                    </p>
                    <p className="text-xs text-(--text-muted)">
                      Remove all job applications permanently
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDeleteAllJobs}
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                    Delete All
                  </Button>
                </div>

                <div className="border-t border-red-500/20 pt-4">
                  <p className="text-sm text-(--text-secondary) mb-2">
                    Delete account
                  </p>
                  <p className="text-xs text-(--text-muted) mb-3">
                    This will permanently delete your account and all data.
                    Type <strong>DELETE</strong> to confirm.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center max-w-sm">
                    <Input
                      value={confirmText}
                      onChange={(e) => setConfirmText(e.target.value)}
                      placeholder="Type DELETE"
                      className="bg-(--bg-primary) border-red-500/30 text-(--text-primary)"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={confirmText !== "DELETE" || deleting}
                      onClick={handleDeleteAccount}
                    >
                      {deleting ? "Deleting..." : "Delete Account"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
