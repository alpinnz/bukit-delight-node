import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import InitialCentroidsTable from "./initial-centroids-table";

const mocks = vi.hoisted(() => ({ reduxState: {} as Record<string, unknown> }));

vi.mock("react-redux", () => ({
  useSelector: (selector: (state: unknown) => unknown) =>
    selector(mocks.reduxState),
}));
vi.mock("../../../../components/organisms/management-table", () => ({
  default: ({
    title,
    columns,
    rows,
  }: {
    title: string;
    columns: Array<{ label: string }>;
    rows: Array<{ name: string }>;
  }) => (
    <section>
      <h1>{title}</h1>
      <div>
        {columns.map(({ label }) => (
          <span key={label}>{label}</span>
        ))}
      </div>
      <div>{rows.map((row) => row.name)}</div>
    </section>
  ),
}));

describe("InitialCentroidsTable", () => {
  afterEach(cleanup);
  beforeEach(() => {
    mocks.reduxState = {
      Favorites: {
        loading: false,
        data: {
          initial_centroids: [{ no: 1, c: "c1", name: "Nasi", x: 2, y: 1 }],
        },
      },
    };
  });

  it("renders initial cluster labels and menu coordinates", () => {
    render(<InitialCentroidsTable />);
    expect(screen.getByText("C Awal")).toBeDefined();
    expect(screen.getByText("C")).toBeDefined();
    expect(screen.getByText("Name Menu")).toBeDefined();
    expect(screen.getByText("Nasi")).toBeDefined();
  });

  it("renders nothing while initial centroids are unavailable", () => {
    mocks.reduxState = { Favorites: { loading: true, data: null } };
    const { container } = render(<InitialCentroidsTable />);
    expect(container.textContent).toBe("");
  });
});
