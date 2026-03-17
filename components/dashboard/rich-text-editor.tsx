"use client";

import { LinkIcon } from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect } from "react";

import { cn } from "@/lib/utils";

export function RichTextEditor({
  name,
  initialValue,
}: {
  name: string;
  initialValue: string;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: "Tulis isi laporan di sini...",
      }),
    ],
    content: initialValue,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "min-h-[24rem] rich-text rounded-3xl border border-brand-stroke/30 bg-white px-6 py-5 focus:outline-none",
      },
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    editor.commands.setContent(initialValue);
  }, [editor, initialValue]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {[
          {
            label: "Bold",
            action: () => editor?.chain().focus().toggleBold().run(),
          },
          {
            label: "Italic",
            action: () => editor?.chain().focus().toggleItalic().run(),
          },
          {
            label: "Heading",
            action: () =>
              editor?.chain().focus().toggleHeading({ level: 2 }).run(),
          },
          {
            label: "List",
            action: () => editor?.chain().focus().toggleBulletList().run(),
          },
          {
            label: "Quote",
            action: () => editor?.chain().focus().toggleBlockquote().run(),
          },
          {
            label: "Link",
            action: () => {
              const href = window.prompt("Masukkan URL");
              if (!href) {
                return;
              }

              editor?.chain().focus().setLink({ href }).run();
            },
            icon: <LinkIcon size={14} />,
          },
        ].map((item) => (
          <button
            className={cn(
              "border-brand-stroke/30 bg-brand-surface text-brand-ink inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold tracking-[0.16em] uppercase",
              item.label === "Bold" &&
                editor?.isActive("bold") &&
                "border-brand-maroon",
              item.label === "Italic" &&
                editor?.isActive("italic") &&
                "border-brand-maroon",
            )}
            key={item.label}
            onClick={item.action}
            type="button"
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>

      <input
        name={name}
        type="hidden"
        value={editor?.getHTML() ?? initialValue}
      />
      <EditorContent editor={editor} />
    </div>
  );
}
