import { seedReports } from "@/lib/data/seed";
import { filterReports } from "@/lib/repositories/content-repository";

describe("filterReports", () => {
  it("filters reports by query, year, category, period, and published status", () => {
    const result = filterReports(seedReports, {
      query: "evaluasi",
      year: "2026",
      period: "Maret 2026",
      category: "laporan-akhir-tahun",
      status: "published",
    });

    expect(result).toHaveLength(1);
    expect(result[0]?.slug).toBe(
      "evaluasi-strategis-pencapaian-tahunan-hmpg-itb",
    );
  });

  it("returns all published reports when optional filters are unset", () => {
    const result = filterReports(seedReports, {
      year: "all",
      period: "all",
      category: "all",
      status: "published",
    });

    expect(result.every((report) => report.status === "published")).toBe(true);
  });
});
