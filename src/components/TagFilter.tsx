"use client";

import { cn } from "@/lib/utils";

interface TagFilterProps {
  tags: string[];
  activeTag: string | null;
  onTagChange: (tag: string | null) => void;
}

export default function TagFilter({
  tags,
  activeTag,
  onTagChange,
}: TagFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={() => onTagChange(null)}
        className={cn(
          "px-4 py-1.5 text-xs tracking-widest uppercase font-heading rounded-full border transition-all duration-300 cursor-pointer",
          activeTag === null
            ? "bg-accent text-white border-accent"
            : "bg-transparent text-muted border-border hover:text-foreground hover:border-muted"
        )}
      >
        All
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onTagChange(tag)}
          className={cn(
            "px-4 py-1.5 text-xs tracking-widest uppercase font-heading rounded-full border transition-all duration-300 cursor-pointer",
            activeTag === tag
              ? "bg-accent text-white border-accent"
              : "bg-transparent text-muted border-border hover:text-foreground hover:border-muted"
          )}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
