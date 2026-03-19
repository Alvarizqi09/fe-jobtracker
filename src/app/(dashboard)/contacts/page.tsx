"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Users, Briefcase, UserCheck, Link, Handshake } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";
import { useContacts } from "@/hooks/useContacts";
import { ContactCard } from "@/components/contacts/ContactCard";
import { AddContactModal } from "@/components/contacts/AddContactModal";
import type { Contact, CreateContactDTO } from "@/types/contact.types";

export default function ContactsPage() {
  const {
    contacts,
    loading,
    fetchContacts,
    createContact,
    updateContact,
    deleteContact,
  } = useContacts();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const filtered = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase()) ||
      c.role.toLowerCase().includes(search.toLowerCase()),
  );

  const stats = {
    total: contacts.length,
    recruiters: contacts.filter((c) => c.relationship === "recruiter").length,
    interviewers: contacts.filter((c) => c.relationship === "interviewer")
      .length,
    referrals: contacts.filter((c) => c.relationship === "referral").length,
  };

  const handleSubmit = useCallback(
    async (data: CreateContactDTO) => {
      try {
        if (editingContact) {
          await updateContact(editingContact._id, data);
          toast.success("Contact updated");
        } else {
          await createContact(data);
          toast.success("Contact added");
        }
        setEditingContact(null);
      } catch {
        toast.error("Failed to save contact");
      }
    },
    [editingContact, createContact, updateContact],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm("Delete this contact?")) return;
      try {
        await deleteContact(id);
        toast.success("Contact deleted");
      } catch {
        toast.error("Failed to delete contact");
      }
    },
    [deleteContact],
  );

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-syne mb-2 text-(--text-primary)">
            Contacts
          </h1>
          <p className="text-sm text-(--text-muted)">
            Manage recruiters, interviewers, and connections.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingContact(null);
            setModalOpen(true);
          }}
          className="shrink-0 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300" />
          <Plus className="mr-2 h-4 w-4 relative z-10" />
          <span className="relative z-10">Add Contact</span>
        </Button>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { icon: Users, label: "Total", value: stats.total, color: "var(--accent-cyan)" },
          { icon: Briefcase, label: "Recruiters", value: stats.recruiters, color: "#3B82F6" },
          { icon: UserCheck, label: "Interviewers", value: stats.interviewers, color: "#F59E0B" },
          { icon: Handshake, label: "Referrals", value: stats.referrals, color: "#10B981" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-[rgba(60,90,140,0.3)] bg-(--bg-card)/50 p-3 flex items-center gap-3"
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: s.color + "15" }}
            >
              <s.icon className="h-4 w-4" style={{ color: s.color }} />
            </div>
            <div>
              <div className="text-lg font-semibold text-(--text-primary)">
                {s.value}
              </div>
              <div className="text-xs text-(--text-muted)">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="mb-6 relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-(--text-muted)" />
        <Input
          placeholder="Search by name, company, or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Grid */}
      {!loading && contacts.length === 0 ? (
        <div className="mt-16 flex flex-col items-center justify-center p-8 text-center border rounded-xl border-dashed bg-(--bg-card)/30">
          <div className="w-16 h-16 bg-(--bg-hover) rounded-full flex items-center justify-center mb-4">
            <Users className="h-8 w-8 text-(--text-muted)" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-(--text-primary)">
            No contacts yet
          </h3>
          <p className="text-sm text-(--text-muted) max-w-sm mb-6">
            Keep track of recruiters, interviewers, and connections related to
            your job search.
          </p>
          <Button
            onClick={() => setModalOpen(true)}
            variant="secondary"
          >
            Add Your First Contact
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filtered.map((contact, i) => (
              <motion.div
                key={contact._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: i * 0.03 }}
              >
                <ContactCard
                  contact={contact}
                  onClick={() => {
                    setEditingContact(contact);
                    setModalOpen(true);
                  }}
                  onDelete={handleDelete}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modal */}
      <AddContactModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingContact(null);
        }}
        onSubmit={handleSubmit}
        editContact={editingContact}
      />
    </div>
  );
}
