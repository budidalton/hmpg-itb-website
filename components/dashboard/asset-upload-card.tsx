"use client";

import { useRef, useState } from "react";
import { Upload, ImageUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AssetUploadCard({
  label,
  description,
  currentSrc,
  targetType,
  targetKey,
  folder,
  pageKey,
  action,
}: {
  label: string;
  description: string;
  currentSrc: string;
  targetType: "settings" | "page";
  targetKey: string;
  folder: string;
  pageKey?: string;
  action: (formData: FormData) => Promise<void>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState("");

  return (
    <form
      action={action}
      className="border-brand-sand/70 rounded-[1.8rem] border bg-white p-5 shadow-[0_12px_30px_rgba(76,41,18,0.06)]"
    >
      <input name="folder" type="hidden" value={folder} />
      <input name="targetType" type="hidden" value={targetType} />
      <input name="targetKey" type="hidden" value={targetKey} />
      {pageKey ? <input name="pageKey" type="hidden" value={pageKey} /> : null}

      <div className="bg-brand-surface overflow-hidden rounded-[1.5rem]">
        {currentSrc ? (
          <img
            alt={label}
            className="h-56 w-full object-cover"
            src={currentSrc}
          />
        ) : (
          <div className="text-brand-body flex h-56 items-center justify-center text-sm">
            Belum ada asset
          </div>
        )}
      </div>

      <div className="mt-5">
        <h3 className="font-epilogue text-brand-ink text-xl font-bold">
          {label}
        </h3>
        <p className="text-brand-body mt-2 text-sm leading-6">{description}</p>
      </div>

      <div
        className={cn(
          "border-brand-sand/80 bg-brand-surface mt-5 rounded-[1.4rem] border border-dashed p-5 transition",
          isDragging && "border-brand-maroon bg-brand-shell",
        )}
        onDragEnter={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setIsDragging(false);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          const file = event.dataTransfer.files?.[0];

          if (!file || !inputRef.current) {
            return;
          }

          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          inputRef.current.files = dataTransfer.files;
          setFileName(file.name);
        }}
      >
        <div className="flex items-start gap-3">
          <ImageUp className="text-brand-maroon mt-0.5 h-5 w-5" />
          <div>
            <p className="text-brand-ink text-sm font-semibold">
              Drag & drop asset di sini
            </p>
            <p className="text-brand-body mt-1 text-sm leading-6">
              Atau pilih file manual. Cocok untuk logo, hero image, dan showcase
              visual.
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <input
            className="hidden"
            name="assetFile"
            onChange={(event) =>
              setFileName(event.target.files?.[0]?.name ?? "")
            }
            ref={inputRef}
            required
            type="file"
          />
          <Button
            onClick={() => inputRef.current?.click()}
            size="sm"
            type="button"
            variant="secondary"
          >
            <Upload className="h-4 w-4" />
            Pilih file
          </Button>
          <span className="text-brand-body text-sm">
            {fileName || "Belum ada file dipilih"}
          </span>
        </div>
      </div>

      <div className="mt-5">
        <Button type="submit">Ganti asset</Button>
      </div>
    </form>
  );
}
