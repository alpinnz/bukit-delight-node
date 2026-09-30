import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import OwnerUsersPage from "./users";
import OwnerCategoriesPage from "./categories";
import OwnerFavoritesPage from "./favorites";
import OwnerMenusPage from "./menus";
import OwnerTablesPage from "./tables";
import OwnerTransactionsPage from "./transactions";

vi.mock("../../../components/templates/owner/layout", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <main>{children}</main>
  ),
}));
vi.mock("./users/table", () => ({
  default: () => <div>users table</div>,
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

describe("owner feature pages", () => {
  it.each([
    ["users table", OwnerUsersPage],
    ["categories table", OwnerCategoriesPage],
    ["menus table", OwnerMenusPage],
    ["tables table", OwnerTablesPage],
    ["transactions table", OwnerTransactionsPage],
  ])("renders %s", (content, Page) => {
    render(<Page />);
    expect(screen.getByText(content)).toBeDefined();
  });

  it("renders each section of the favorites analysis", () => {
    render(<OwnerFavoritesPage />);
    expect(screen.getByText("dataset table")).toBeDefined();
    expect(screen.getByText("cluster start table")).toBeDefined();
    expect(screen.getByText("kmeans table")).toBeDefined();
    expect(screen.getByText("cluster table")).toBeDefined();
    expect(screen.getByText("favorites table")).toBeDefined();
  });
});
