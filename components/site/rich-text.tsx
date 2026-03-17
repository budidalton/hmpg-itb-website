import DOMPurify from "isomorphic-dompurify";

export function RichText({ html }: { html: string }) {
  const safeHtml = DOMPurify.sanitize(html);

  return (
    <div className="rich-text" dangerouslySetInnerHTML={{ __html: safeHtml }} />
  );
}
