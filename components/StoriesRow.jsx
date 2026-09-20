"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function StoriesRow({ stories }) {
  const [open, setOpen] = useState(null);
  const router = useRouter();

  if (!stories.length) return null;

  const handleClick = (story) => {
    if (story.link_product_id) {
      router.push(`/product/${story.link_product_id}`);
    } else {
      setOpen(story);
    }
  };

  return (
    <>
      <div className="flex gap-3 overflow-x-auto px-4 py-3">
        {stories.map((story) => (
          <button
            key={story.id}
            onClick={() => handleClick(story)}
            className="flex shrink-0 flex-col items-center gap-1"
          >
            <span
              className="block h-16 w-16 overflow-hidden rounded-full p-[2px]"
              style={{ background: "linear-gradient(45deg, var(--brand), var(--brand-soft))" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={story.image_url}
                alt={story.title || "story"}
                className="h-full w-full rounded-full border-2 object-cover"
                style={{ borderColor: "var(--surface)" }}
              />
            </span>
            {story.title && (
              <span className="max-w-16 truncate text-[11px]" style={{ color: "var(--muted)" }}>
                {story.title}
              </span>
            )}
          </button>
        ))}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={() => setOpen(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={open.image_url} alt={open.title || "story"} className="max-h-[85vh] max-w-[92vw] rounded-2xl object-contain" />
        </div>
      )}
    </>
  );
}
