"use client";

import { useState, useRef } from "react";
import { NavBar } from "@/components/NavBar";
import { usePhotos } from "@/hooks/usePhotos";
import { COURSES } from "@/lib/constants";

const NAMES = ["Alex Beaven", "Walter Todd", "Simon Reeves", "Dinesh Fonseka"];

export default function PhotosPage() {
  const { photos, uploading, uploadPhoto } = usePhotos();
  const [name, setName] = useState("");
  const [caption, setCaption] = useState("");
  const [courseId, setCourseId] = useState("general");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleUpload = async () => {
    if (!file || !name) return;
    const ok = await uploadPhoto(file, name, caption, courseId);
    if (ok) {
      setFile(null);
      setPreview(null);
      setCaption("");
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <>
      <NavBar />
      <main className="px-4 py-6 md:py-10 max-w-2xl mx-auto">
        <h1
          className="text-2xl md:text-4xl mb-6 text-center"
          style={{ fontFamily: "var(--font-bungee)" }}
        >
          <span className="text-yellow-400">Photo</span>{" "}
          <span className="text-white">Wall</span>
        </h1>

        {/* Upload */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-4 mb-8">
          <h2 className="text-white font-bold text-sm mb-3">📸 Add a photo</h2>

          <div className="grid gap-3">
            <select
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white text-sm focus:outline-none focus:ring-1 focus:ring-yellow-400/50"
            >
              <option value="">Who are you?</option>
              {NAMES.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>

            <select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white text-sm focus:outline-none focus:ring-1 focus:ring-yellow-400/50"
            >
              <option value="general">General / Off course</option>
              {COURSES.map((c) => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
            </select>

            <input
              type="text"
              placeholder="Caption (optional)"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-yellow-400/50"
            />

            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center cursor-pointer hover:border-white/40 transition-colors"
            >
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="preview" className="max-h-40 mx-auto rounded-lg object-cover" />
              ) : (
                <div className="text-white/40 text-sm">
                  <div className="text-3xl mb-2">📷</div>
                  Tap to choose a photo
                </div>
              )}
              <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
            </div>

            <button
              onClick={handleUpload}
              disabled={!file || !name || uploading}
              className="w-full py-3 rounded-xl bg-yellow-400 text-green-900 font-bold hover:bg-yellow-300 disabled:opacity-40 transition-colors"
            >
              {uploading ? "Uploading..." : "Upload Photo"}
            </button>
          </div>
        </div>

        {/* Gallery */}
        {photos.length === 0 ? (
          <div className="text-center text-white/30 py-12">
            <div className="text-4xl mb-3">📷</div>
            No photos yet — be the first!
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {photos.map((photo) => (
              <div key={photo.id} className="rounded-2xl overflow-hidden bg-white/5 border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.url}
                  alt={photo.caption ?? ""}
                  className="w-full aspect-square object-cover"
                />
                <div className="p-3">
                  <div className="text-white text-xs font-bold">{photo.uploaded_by}</div>
                  {photo.caption && <div className="text-white/50 text-xs mt-0.5">{photo.caption}</div>}
                  <div className="text-white/20 text-[10px] mt-1">
                    {COURSES.find((c) => c.id === photo.course_id)?.name ?? "General"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
