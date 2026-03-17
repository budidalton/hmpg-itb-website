import { render, screen } from "@testing-library/react";

import { SiteHeader } from "@/components/site/site-header";
import { seedSettings } from "@/lib/data/seed";

vi.mock("next/navigation", () => ({
  usePathname: () => "/reports",
}));

describe("SiteHeader", () => {
  it("renders branded navigation and highlights the archive route while on reports", () => {
    render(<SiteHeader settings={seedSettings} />);

    expect(screen.getByText("HMPG ITB")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "HMPG’S Archives" })).toHaveClass(
      "text-brand-maroon",
    );
    expect(screen.getByRole("link", { name: "Login" })).toBeInTheDocument();
  });
});
