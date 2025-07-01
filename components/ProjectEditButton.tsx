"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabaseClient";

export function ProjectEditButton({ projectId }: { projectId: number }) {
  const [isCeo, setIsCeo] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkRole() {
      const supabase = createSupabaseBrowserClient();
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      if (userId) {
        const { data } = await supabase.from("users").select("role").eq("id", userId).single();
        if (data?.role === "ceo") setIsCeo(true);
      }
    }
    checkRole();
  }, []);

  if (!isCeo) return null;

  return (
    <Button
      className="mb-8"
      onClick={() => router.push(`/projectsedit?edit=${projectId}`)}
    >
      Edit Project
    </Button>
  );
} 