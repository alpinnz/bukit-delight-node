import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import FavoriteResultsTable from "./favorite-results-table";

const mocks = vi.hoisted(() => ({ reduxState: {} as Record<string, unknown> }));

vi.mock("react-redux", () => ({
  useSelector: (selector: (state: unknown) => unknown) =>
    selector(mocks.reduxState),
}));
vi.mock("../../../../components/common/table.custom", () => ({
  default: ({
    title,
    columns,
    rows,
  }: {
    title: string;
    columns: Array<{
      label: string;
      id: string;
      cell?: (row: TestMenu) => React.ReactNode;
    }>;
    rows: TestMenu[];
  }) => (
    <section>
      <h1>{title}</h1>
      <div>
        {columns.map(({ label }) => (
          <span key={label}>{label}</span>
        ))}
      </div>
      {rows.map((row) => (
        <div key={row.no}>
          <span>{row.name}</span>
          {columns.map((column) => (
            <div key={column.id}>{column.cell?.(row)}</div>
          ))}
        </div>
      ))}
    </section>
  ),
}));

type TestMenu = {
  no: number;
  name: string;
  desc?: string;
  image?: string;
  price: number;
  promo?: number;
  duration?: number;
  isAvailable?: boolean;
};

describe("FavoriteResultsTable", () => {
  afterEach(cleanup);
  beforeEach(() => {
    mocks.reduxState = {
      Favorites: {
        loading: false,
        data: {
          menu_favorit: [
            {
              no: 1,
              name: "Nasi",
              desc: "Menu utama",
              image: "/nasi.png",
              price: 120,
              promo: 10,
              duration: 8,
              isAvailable: true,
            },
          ],
        },
      },
    };
  });

  it("renders favorite menu data and display formatting", () => {
    render(<FavoriteResultsTable />);
    expect(screen.getByText("Result Pemesanan")).toBeDefined();
    expect(screen.getByText("Description")).toBeDefined();
    expect(screen.getByText("Nasi")).toBeDefined();
    expect(screen.getByText("8 Minute")).toBeDefined();
    expect(screen.getByText("Tersedia")).toBeDefined();
    expect(screen.getByRole("img", { name: "Nasi" })).toBeDefined();
  });

  it("renders nothing until favorite menu data is available", () => {
    mocks.reduxState = { Favorites: { loading: true, data: null } };
    const { container } = render(<FavoriteResultsTable />);
    expect(container.textContent).toBe("");
  });
});
