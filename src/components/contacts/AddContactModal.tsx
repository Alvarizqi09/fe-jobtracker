"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { Contact, CreateContactDTO, MeetingType } from "@/types/contact.types";

const RELATIONSHIPS = [
  { value: "recruiter", label: "Recruiter" },
  { value: "interviewer", label: "Interviewer" },
  { value: "referral", label: "Referral" },
  { value: "connection", label: "Connection" },
  { value: "other", label: "Other" },
] as const;

const MEETING_TYPES: { value: MeetingType; label: string }[] = [
  { value: "google_meet", label: "Google Meet" },
  { value: "zoom", label: "Zoom" },
  { value: "teams", label: "Microsoft Teams" },
  { value: "offline", label: "Offline / On-site" },
  { value: "other", label: "Other" },
];

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateContactDTO) => Promise<void>;
  editContact?: Contact | null;
}

export function AddContactModal({ open, onClose, onSubmit, editContact }: Props) {
  const [form, setForm] = useState<CreateContactDTO>({
    name: editContact?.name ?? "",
    role: editContact?.role ?? "",
    company: editContact?.company ?? "",
    email: editContact?.email ?? "",
    meetingLink: editContact?.meetingLink ?? "",
    meetingType: editContact?.meetingType,
    meetingLocationUrl: editContact?.meetingLocationUrl ?? "",
    phone: editContact?.phone ?? "",
    notes: editContact?.notes ?? "",
    relationship: editContact?.relationship ?? "other",
    followUpDate: editContact?.followUpDate?.split("T")[0] ?? "",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form };
      if (payload.followUpDate) {
        payload.followUpDate = new Date(payload.followUpDate).toISOString();
      }
      await onSubmit(payload);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const set = (key: keyof CreateContactDTO, val: string | undefined) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-[95vw] sm:max-w-lg bg-(--bg-card) border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-(--text-primary)">
            {editContact ? "Edit Contact" : "Add Contact"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-(--text-muted)">Name *</Label>
              <Input
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                required
                className="bg-(--bg-primary) border-border text-(--text-primary)"
              />
            </div>
            <div>
              <Label className="text-xs text-(--text-muted)">Role *</Label>
              <Input
                value={form.role}
                onChange={(e) => set("role", e.target.value)}
                required
                placeholder="e.g. HR Manager"
                className="bg-(--bg-primary) border-border text-(--text-primary)"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-(--text-muted)">Company *</Label>
              <Input
                value={form.company}
                onChange={(e) => set("company", e.target.value)}
                required
                className="bg-(--bg-primary) border-border text-(--text-primary)"
              />
            </div>
            <div>
              <Label className="text-xs text-(--text-muted)">Relationship</Label>
              <Select
                value={form.relationship}
                onValueChange={(v) => set("relationship", v ?? "")}
              >
                <SelectTrigger className="bg-(--bg-primary) border-border text-(--text-primary)">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-(--bg-card) border-border">
                  {RELATIONSHIPS.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-(--text-muted)">Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                className="bg-(--bg-primary) border-border text-(--text-primary)"
              />
            </div>
            <div>
              <Label className="text-xs text-(--text-muted)">Phone</Label>
              <Input
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                className="bg-(--bg-primary) border-border text-(--text-primary)"
              />
            </div>
          </div>

          {/* Meeting Section */}
          <div className="space-y-3 rounded-lg border border-border/50 p-3 bg-(--bg-secondary)/30">
            <div className="text-xs font-medium text-(--text-muted) uppercase tracking-wider">
              Interview / Meeting
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-(--text-muted)">Meeting Type</Label>
                <Select
                  value={form.meetingType ?? ""}
                  onValueChange={(v) => set("meetingType", v || undefined)}
                >
                  <SelectTrigger className="bg-(--bg-primary) border-border text-(--text-primary)">
                    <SelectValue placeholder="Select type..." />
                  </SelectTrigger>
                  <SelectContent className="bg-(--bg-card) border-border">
                    {MEETING_TYPES.map((mt) => (
                      <SelectItem key={mt.value} value={mt.value}>
                        {mt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-(--text-muted)">Meeting Link</Label>
                <Input
                  value={form.meetingLink}
                  onChange={(e) => set("meetingLink", e.target.value)}
                  placeholder="https://meet.google.com/..."
                  className="bg-(--bg-primary) border-border text-(--text-primary)"
                />
              </div>
            </div>

            {form.meetingType === "offline" && (
              <div>
                <Label className="text-xs text-(--text-muted)">Location URL (Google Maps)</Label>
                <Input
                  value={form.meetingLocationUrl}
                  onChange={(e) => set("meetingLocationUrl", e.target.value)}
                  placeholder="https://maps.google.com/..."
                  className="bg-(--bg-primary) border-border text-(--text-primary)"
                />
              </div>
            )}
          </div>

          <div>
            <Label className="text-xs text-(--text-muted)">Follow-up Date</Label>
            <Input
              type="date"
              value={form.followUpDate ? String(form.followUpDate).split("T")[0] : ""}
              onChange={(e) => set("followUpDate", e.target.value)}
              className="bg-(--bg-primary) border-border text-(--text-primary) max-w-xs"
            />
          </div>

          <div>
            <Label className="text-xs text-(--text-muted)">Notes</Label>
            <Textarea
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Any additional notes..."
              className="bg-(--bg-primary) border-border text-(--text-primary) min-h-[60px]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving
                ? "Saving..."
                : editContact
                  ? "Update"
                  : "Add Contact"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
