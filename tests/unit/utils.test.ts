import {
  formatDisplayDate,
  normalizeRichTextHref,
  sanitizeRichTextHtml,
  slugify,
  uniqueBy,
} from "@/lib/utils";

describe("utils", () => {
  it("slugifies editorial titles into URL-safe slugs", () => {
    expect(slugify(" Evaluasi Strategis & Pencapaian Tahunan HMPG ITB ")).toBe(
      "evaluasi-strategis-pencapaian-tahunan-hmpg-itb",
    );
  });

  it("formats display dates in Indonesian locale", () => {
    expect(formatDisplayDate("2026-03-12T00:00:00.000Z")).toBe("12 Maret 2026");
  });

  it("deduplicates arrays by a derived key", () => {
    const result = uniqueBy(
      [
        { id: "1", label: "A" },
        { id: "2", label: "B" },
        { id: "1", label: "A duplicate" },
      ],
      (item) => item.id,
    );

    expect(result).toEqual([
      { id: "1", label: "A" },
      { id: "2", label: "B" },
    ]);
  });

  it("removes dangerous HTML while keeping editor content", () => {
    expect(
      sanitizeRichTextHtml(
        '<p onclick="alert(1)">Halo</p><script>alert(1)</script><a href="javascript:alert(1)">Klik</a><img src="/image.png" onerror="alert(1)" />',
      ),
    ).toBe('<p>Halo</p><a>Klik</a><img src="/image.png" />');
  });

  it("normalizes external rich text links without affecting internal links", () => {
    expect(normalizeRichTextHref("google.com")).toBe("https://google.com");
    expect(normalizeRichTextHref("www.google.com")).toBe(
      "https://www.google.com",
    );
    expect(normalizeRichTextHref("https://google.com")).toBe(
      "https://google.com",
    );
    expect(normalizeRichTextHref("/reports")).toBe("/reports");
    expect(normalizeRichTextHref("#ringkasan")).toBe("#ringkasan");
  });

  it("rewrites stored links without protocol to use https", () => {
    expect(sanitizeRichTextHtml('<p><a href="google.com">Google</a></p>')).toBe(
      '<p><a href="https://google.com">Google</a></p>',
    );
  });
});
