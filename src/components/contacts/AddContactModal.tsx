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
import type { Contact, CreateContactDTO } from "@/types/contact.types";

const RELATIONSHIPS = [
  { value: "recruiter", label: "Recruiter" },
  { value: "interviewer", label: "Interviewer" },
  { value: "referral", label: "Referral" },
  { value: "connection", label: "Connection" },
  { value: "other", label: "Other" },
] as const;

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
    linkedin: editContact?.linkedin ?? "",
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

  const set = (key: keyof CreateContactDTO, val: any) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-[95vw] sm:max-w-lg bg-(--bg-card) border-[rgba(60,90,140,0.5)] max-h-[90vh] overflow-y-auto">
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
                className="bg-(--bg-primary) border-[rgba(60,90,140,0.4)] text-(--text-primary)"
              />
            </div>
            <div>
              <Label className="text-xs text-(--text-muted)">Role *</Label>
              <Input
                value={form.role}
                onChange={(e) => set("role", e.target.value)}
                required
                placeholder="e.g. HR Manager"
                className="bg-(--bg-primary) border-[rgba(60,90,140,0.4)] text-(--text-primary)"
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
                className="bg-(--bg-primary) border-[rgba(60,90,140,0.4)] text-(--text-primary)"
              />
            </div>
            <div>
              <Label className="text-xs text-(--text-muted)">Relationship</Label>
              <Select
                value={form.relationship}
                onValueChange={(v) => set("relationship", v ?? "")}
              >
                <SelectTrigger className="bg-(--bg-primary) border-[rgba(60,90,140,0.4)] text-(--text-primary)">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-(--bg-card) border-[rgba(60,90,140,0.5)]">
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
                className="bg-(--bg-primary) border-[rgba(60,90,140,0.4)] text-(--text-primary)"
              />
            </div>
            <div>
              <Label className="text-xs text-(--text-muted)">Phone</Label>
              <Input
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                className="bg-(--bg-primary) border-[rgba(60,90,140,0.4)] text-(--text-primary)"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs text-(--text-muted)">LinkedIn</Label>
            <Input
              value={form.linkedin}
              onChange={(e) => set("linkedin", e.target.value)}
              placeholder="https://linkedin.com/in/..."
              className="bg-(--bg-primary) border-[rgba(60,90,140,0.4)] text-(--text-primary)"
            />
          </div>

          <div>
            <Label className="text-xs text-(--text-muted)">Follow-up Date</Label>
            <Input
              type="date"
              value={form.followUpDate ? String(form.followUpDate).split("T")[0] : ""}
              onChange={(e) => set("followUpDate", e.target.value)}
              className="bg-(--bg-primary) border-[rgba(60,90,140,0.4)] text-(--text-primary) max-w-xs"
            />
          </div>

          <div>
            <Label className="text-xs text-(--text-muted)">Notes</Label>
            <Textarea
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Any additional notes..."
              className="bg-(--bg-primary) border-[rgba(60,90,140,0.4)] text-(--text-primary) min-h-[60px]"
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
