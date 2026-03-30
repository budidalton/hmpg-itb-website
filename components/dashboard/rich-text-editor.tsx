"use client";

import { useEffect, useRef, useState } from "react";
import {
  ImageIcon,
  LinkIcon,
  ListIcon,
  ListOrderedIcon,
  LoaderCircleIcon,
} from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import Image from "@tiptap/extension-image";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";

import {
  CMS_UPLOAD_SIZE_LIMIT_LABEL,
  cn,
  getCmsImageUploadError,
  normalizeRichTextHref,
} from "@/lib/utils";
import { DashboardModal } from "@/components/dashboard/dashboard-modal";
import { Button } from "@/components/ui/button";

export function RichTextEditor({
  name,
  initialValue,
  onDirty,
}: {
  name: string;
  initialValue: string;
  onDirty?: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [htmlValue, setHtmlValue] = useState(initialValue);
  const [uploadError, setUploadError] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkValue, setLinkValue] = useState("");
  const [linkError, setLinkError] = useState("");
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: false,
      }),
      Link.configure({
        openOnClick: false,
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
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
    onUpdate({ editor: activeEditor }) {
      setHtmlValue(activeEditor.getHTML());
      onDirty?.();
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    editor.commands.setContent(initialValue);
    setHtmlValue(initialValue);
  }, [editor, initialValue]);

  async function handleImageFileChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const validationError = getCmsImageUploadError(file);

    if (validationError) {
      setUploadError(validationError);
      event.target.value = "";
      return;
    }

    setUploadError("");
    setIsUploadingImage(true);

    try {
      const formData = new FormData();
      formData.set("file", file);

      const response = await fetch("/api/dashboard/report-images", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(payload?.error ?? "Gagal mengunggah gambar.");
      }

      const payload = (await response.json()) as { src: string };
      editor
        ?.chain()
        .focus()
        .setImage({ src: payload.src, alt: file.name })
        .run();
      editor?.chain().focus().createParagraphNear().run();
      onDirty?.();
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : "Gagal mengunggah gambar.",
      );
    } finally {
      event.target.value = "";
      setIsUploadingImage(false);
    }
  }

  function openLinkModal() {
    setLinkValue(editor?.getAttributes("link").href ?? "");
    setLinkError("");
    setIsLinkModalOpen(true);
  }

  function closeLinkModal() {
    setIsLinkModalOpen(false);
    setLinkError("");
  }

  function handleSaveLink() {
    const normalizedHref = normalizeRichTextHref(linkValue);

    if (!normalizedHref) {
      setLinkError("Masukkan URL yang valid, misalnya https://example.com.");
      return;
    }

    editor?.chain().focus().setLink({ href: normalizedHref }).run();
    closeLinkModal();
  }

  function handleRemoveLink() {
    editor?.chain().focus().unsetLink().run();
    closeLinkModal();
  }

  return (
    <>
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
              label: "Bullet List",
              action: () => editor?.chain().focus().toggleBulletList().run(),
              icon: <ListIcon size={14} />,
            },
            {
              label: "Ordered List",
              action: () => editor?.chain().focus().toggleOrderedList().run(),
              icon: <ListOrderedIcon size={14} />,
            },
            {
              label: "Quote",
              action: () => editor?.chain().focus().toggleBlockquote().run(),
            },
            {
              label: "Link",
              action: openLinkModal,
              icon: <LinkIcon size={14} />,
            },
            {
              label: isUploadingImage ? "Uploading..." : "Image",
              action: () => {
                if (isUploadingImage) {
                  return;
                }

                fileInputRef.current?.click();
              },
              icon: isUploadingImage ? (
                <LoaderCircleIcon className="animate-spin" size={14} />
              ) : (
                <ImageIcon size={14} />
              ),
            },
          ].map((item) => (
            <button
              className={cn(
                "border-brand-stroke/30 bg-brand-surface text-brand-ink hover:border-brand-maroon/50 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold tracking-[0.16em] uppercase transition-colors",
                item.label === "Bold" &&
                  editor?.isActive("bold") &&
                  "border-brand-maroon bg-brand-maroon/5",
                item.label === "Italic" &&
                  editor?.isActive("italic") &&
                  "border-brand-maroon bg-brand-maroon/5",
                item.label === "Heading" &&
                  editor?.isActive("heading", { level: 2 }) &&
                  "border-brand-maroon bg-brand-maroon/5",
                item.label === "Bullet List" &&
                  editor?.isActive("bulletList") &&
                  "border-brand-maroon bg-brand-maroon/5",
                item.label === "Ordered List" &&
                  editor?.isActive("orderedList") &&
                  "border-brand-maroon bg-brand-maroon/5",
                item.label === "Quote" &&
                  editor?.isActive("blockquote") &&
                  "border-brand-maroon bg-brand-maroon/5",
                item.label === "Link" &&
                  editor?.isActive("link") &&
                  "border-brand-maroon bg-brand-maroon/5",
                item.label === "Image" &&
                  isUploadingImage &&
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
          accept="image/*"
          className="hidden"
          data-testid="rich-text-image-upload"
          onChange={handleImageFileChange}
          ref={fileInputRef}
          type="file"
        />
        <input name={name} type="hidden" value={htmlValue} />
        <EditorContent editor={editor} />
        {uploadError ? (
          <p className="rounded-[0.9rem] border border-[#831618]/18 bg-[#831618]/8 px-3 py-2 text-sm font-medium text-[#831618]">
            {uploadError}
          </p>
        ) : (
          <p className="text-brand-body text-xs leading-6">
            Upload gambar inline hingga {CMS_UPLOAD_SIZE_LIMIT_LABEL}.
          </p>
        )}
      </div>

      <DashboardModal
        description="Tambahkan tautan yang valid untuk teks yang sedang dipilih. Anda juga bisa menghapus link yang sudah terpasang."
        onClose={closeLinkModal}
        open={isLinkModalOpen}
        primaryAction={
          <Button onClick={handleSaveLink} type="button">
            Simpan link
          </Button>
        }
        secondaryAction={
          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            {editor?.isActive("link") ? (
              <Button onClick={handleRemoveLink} type="button" variant="ghost">
                Hapus link
              </Button>
            ) : null}
            <Button onClick={closeLinkModal} type="button" variant="outline">
              Batal
            </Button>
          </div>
        }
        title="Atur URL link"
      >
        <label className="block space-y-2">
          <span className="text-brand-ink text-sm font-semibold">
            URL tujuan
          </span>
          <input
            autoFocus
            className="border-brand-sand/80 focus:border-brand-maroon h-12 w-full rounded-[1rem] border bg-white px-4 text-sm outline-none"
            onChange={(event) => {
              setLinkValue(event.target.value);
              if (linkError) {
                setLinkError("");
              }
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleSaveLink();
              }
            }}
            placeholder="https://example.com"
            type="url"
            value={linkValue}
          />
        </label>
        {linkError ? (
          <p className="mt-3 rounded-[0.9rem] border border-[#831618]/18 bg-[#831618]/8 px-3 py-2 text-sm font-medium text-[#831618]">
            {linkError}
          </p>
        ) : (
          <p className="text-brand-body mt-3 text-xs leading-6">
            Gunakan URL lengkap seperti https://example.com atau domain yang
            ingin diarahkan.
          </p>
        )}
      </DashboardModal>
    </>
  );
}
