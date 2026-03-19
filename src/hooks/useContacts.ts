"use client";

import { useCallback, useState } from "react";
import { api } from "@/lib/api";
import type { Contact, CreateContactDTO } from "@/types/contact.types";

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/contacts");
      setContacts(data.contacts);
    } finally {
      setLoading(false);
    }
  }, []);

  const createContact = useCallback(async (dto: CreateContactDTO) => {
    const { data } = await api.post("/contacts", dto);
    setContacts((prev) => [data.contact, ...prev]);
    return data.contact;
  }, []);

  const updateContact = useCallback(
    async (id: string, dto: Partial<CreateContactDTO>) => {
      const { data } = await api.put(`/contacts/${id}`, dto);
      setContacts((prev) =>
        prev.map((c) => (c._id === id ? data.contact : c)),
      );
      return data.contact;
    },
    [],
  );

  const deleteContact = useCallback(async (id: string) => {
    await api.delete(`/contacts/${id}`);
    setContacts((prev) => prev.filter((c) => c._id !== id));
  }, []);

  return {
    contacts,
    loading,
    fetchContacts,
    createContact,
    updateContact,
    deleteContact,
  };
}
