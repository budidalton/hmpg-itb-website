import { formatDisplayDate, slugify, uniqueBy } from "@/lib/utils";

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
});
