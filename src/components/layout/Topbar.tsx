"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import toast from "react-hot-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./Sidebar";
import { useAuth } from "@/hooks/useAuth";
import { logOut } from "@/lib/firebase";

function initials(nameOrEmail: string): string {
  const parts = nameOrEmail.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "JD";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0]}${parts[1]![0]}`.toUpperCase();
}

export function Topbar() {
  const { user } = useAuth();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async (): Promise<void> => {
    setLoggingOut(true);
    try {
      await logOut();
      router.replace("/login");
    } catch {
      toast.error("Logout failed");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <header className="h-14 flex items-center justify-between px-4 border-b border-border bg-(--bg-secondary)">
      <div className="flex items-center gap-2">
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-(--text-primary) hover:bg-(--bg-hover)"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              }
            />
            <SheetContent
              side="left"
              className="p-0 bg-(--bg-secondary) border-border w-72"
            >
              <Sidebar variant="mobile" />
            </SheetContent>
          </Sheet>
        </div>
        <div className="hidden md:block font-jetbrains text-xs text-(--text-secondary)">
          {new Date().toLocaleDateString(undefined, {
            weekday: "short",
            month: "short",
            day: "2-digit",
          })}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:block text-right">
          <div className="text-sm text-(--text-primary) font-medium">
            {user?.displayName ?? "Agent"}
          </div>
          <div className="text-xs text-(--text-secondary)">
            {user?.email ?? ""}
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                className="h-9 w-9 rounded-full p-0 hover:bg-(--bg-hover)"
              >
                <Avatar className="h-9 w-9 border border-border">
                  <AvatarImage
                    src={user?.photoURL ?? ""}
                    alt={user?.displayName ?? "User"}
                  />
                  <AvatarFallback className="bg-(--bg-card) text-(--text-primary)">
                    {initials(user?.displayName ?? user?.email ?? "JobDeck")}
                  </AvatarFallback>
                </Avatar>
              </Button>
            }
          />
          <DropdownMenuContent
            align="end"
            className="bg-(--bg-card) border-border text-(--text-primary)"
          >
            <DropdownMenuItem
              onClick={() => router.push("/profile")}
              className="cursor-pointer focus:bg-(--bg-hover)"
            >
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleLogout}
              disabled={loggingOut}
              className="cursor-pointer focus:bg-(--bg-hover)"
            >
              {loggingOut ? "Signing out…" : "Sign out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
