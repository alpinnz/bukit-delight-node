import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ClusterTables from "./cluster-tables";

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
    rows: Array<{ name: string; total_transactions: number; price: number }>;
  }) => (
    <section>
      <h2>{title}</h2>
      <div>
        {columns.map(({ label }) => (
          <span key={label}>{label}</span>
        ))}
      </div>
      <div>{rows.map((row) => row.name)}</div>
    </section>
  ),
}));

describe("ClusterTables", () => {
  afterEach(cleanup);
  beforeEach(() => {
    mocks.reduxState = {
      Favorites: {
        loading: false,
        data: {
          menu_cluster_akhir: {
            c1: [{ no: 1, name: "Nasi", total_transactions: 10, price: 150 }],
            c2: [{ no: 2, name: "Soto", total_transactions: 8, price: 120 }],
            c3: [{ no: 3, name: "Jus", total_transactions: 6, price: 80 }],
          },
        },
      },
    };
  });

  it("renders all final clusters and their menu records", () => {
    render(<ClusterTables />);
    expect(screen.getByText("Cluster 1")).toBeDefined();
    expect(screen.getByText("Cluster 2")).toBeDefined();
    expect(screen.getByText("Cluster 3")).toBeDefined();
    expect(screen.getAllByText("Transactions")).toHaveLength(3);
    expect(screen.getByText("Nasi")).toBeDefined();
    expect(screen.getByText("Soto")).toBeDefined();
    expect(screen.getByText("Jus")).toBeDefined();
  });

  it("renders nothing until final cluster data is available", () => {
    mocks.reduxState = { Favorites: { loading: true, data: null } };
    const { container } = render(<ClusterTables />);
    expect(container.textContent).toBe("");
  });
});
