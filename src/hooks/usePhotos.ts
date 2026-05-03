"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

export interface Photo {
  id: string;
  url: string;
  caption: string | null;
  uploaded_by: string;
  course_id: string;
  created_at: string;
}

export function usePhotos() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [uploading, setUploading] = useState(false);

  const fetch = useCallback(async () => {
    const { data } = await supabase
      .from("photos")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setPhotos(data);
  }, []);

  useEffect(() => {
    fetch();
    const channel = supabase
      .channel("photos-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "photos" }, fetch)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetch]);

  const uploadPhoto = async (
    file: File,
    uploadedBy: string,
    caption: string,
    courseId: string
  ): Promise<boolean> => {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("photos")
        .upload(path, file, { contentType: file.type });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from("photos").getPublicUrl(path);

      const { error: dbError } = await supabase.from("photos").insert({
        url: urlData.publicUrl,
        caption: caption || null,
        uploaded_by: uploadedBy,
        course_id: courseId,
      });

      if (dbError) throw dbError;
      await fetch();
      return true;
    } catch {
      return false;
    } finally {
      setUploading(false);
    }
  };

  return { photos, uploading, uploadPhoto };
}
