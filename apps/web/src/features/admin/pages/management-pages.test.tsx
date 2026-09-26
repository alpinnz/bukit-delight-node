import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import AdminAccountsPage from "./accounts";
import AdminCategoriesPage from "./categories";
import AdminFavoritesPage from "./favorites";
import AdminMenusPage from "./menus";
import AdminTablesPage from "./tables";
import AdminTransactionsPage from "./transactions";

vi.mock("../../../components/templates/admin", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <main>{children}</main>
  ),
}));
vi.mock("./accounts/table", () => ({
  default: () => <div>accounts table</div>,
}));
vi.mock("./categories/table", () => ({
  default: () => <div>categories table</div>,
}));
vi.mock("./tables/table", () => ({
  default: () => <div>tables table</div>,
}));
vi.mock("./menus/table", () => ({
  default: () => <div>menus table</div>,
}));
vi.mock("./transactions/table", () => ({
  default: () => <div>transactions table</div>,
}));
vi.mock("./favorites/dataset-table", () => ({
  default: () => <div>dataset table</div>,
}));
vi.mock("./favorites/initial-centroids-table", () => ({
  default: () => <div>cluster start table</div>,
}));
vi.mock("./favorites/kmeans-table", () => ({
  default: () => <div>kmeans table</div>,
}));
vi.mock("./favorites/cluster-tables", () => ({
  default: () => <div>cluster table</div>,
}));
vi.mock("./favorites/favorite-results-table", () => ({
  default: () => <div>favorites table</div>,
}));

describe("admin feature pages", () => {
  it.each([
    ["accounts table", AdminAccountsPage],
    ["categories table", AdminCategoriesPage],
    ["menus table", AdminMenusPage],
    ["tables table", AdminTablesPage],
    ["transactions table", AdminTransactionsPage],
  ])("renders %s", (content, Page) => {
    render(<Page />);
    expect(screen.getByText(content)).toBeDefined();
  });

  it("renders each section of the favorites analysis", () => {
    render(<AdminFavoritesPage />);
    expect(screen.getByText("dataset table")).toBeDefined();
    expect(screen.getByText("cluster start table")).toBeDefined();
    expect(screen.getByText("kmeans table")).toBeDefined();
    expect(screen.getByText("cluster table")).toBeDefined();
    expect(screen.getByText("favorites table")).toBeDefined();
  });
});
