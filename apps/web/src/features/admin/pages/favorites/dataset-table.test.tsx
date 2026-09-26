import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import DatasetTable from "./dataset-table";

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
    columns: Array<{ label: string }>;
    rows: Array<{ name_menu: string }>;
  }) => (
    <section>
      <h1>{title}</h1>
      <div>
        {columns.map(({ label }) => (
          <span key={label}>{label}</span>
        ))}
      </div>
      <div>{rows.map((row) => row.name_menu)}</div>
    </section>
  ),
}));

describe("DatasetTable", () => {
  afterEach(cleanup);
  beforeEach(() => {
    mocks.reduxState = {
      Favorites: {
        loading: false,
        data: {
          DataSet: [{ no: 1, name_menu: "Nasi", x: 2, y: 1 }],
        },
      },
    };
  });

  it("renders dataset rows and coordinates", () => {
    render(<DatasetTable />);
    expect(screen.getByText("DataSet")).toBeDefined();
    expect(screen.getByText("Name Menu")).toBeDefined();
    expect(screen.getByText("X")).toBeDefined();
    expect(screen.getByText("Y")).toBeDefined();
    expect(screen.getByText("Nasi")).toBeDefined();
  });

  it("waits for dataset data instead of dereferencing a missing response", () => {
    mocks.reduxState = { Favorites: { loading: true, data: null } };
    const { container } = render(<DatasetTable />);
    expect(container.textContent).toBe("");
  });
});
