import { sanitizeRichTextHtml } from "@/lib/utils";

export function RichText({ html }: { html: string }) {
  const safeHtml = sanitizeRichTextHtml(html);

  return (
    <div className="rich-text" dangerouslySetInnerHTML={{ __html: safeHtml }} />
  );
}
