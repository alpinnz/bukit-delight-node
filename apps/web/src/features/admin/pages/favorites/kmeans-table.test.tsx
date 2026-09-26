import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import KMeansTable from "./kmeans-table";

const mocks = vi.hoisted(() => ({ reduxState: {} as Record<string, unknown> }));

vi.mock("react-redux", () => ({
  useSelector: (selector: (state: unknown) => unknown) =>
    selector(mocks.reduxState),
}));

const oneIteration = {
  iterasi: 1,
  data: [{ no: 1, c1: 1, c2: 2, c3: 3, cluster: 1 }],
  new_data: {
    data: [
      {
        no: 1,
        c1: { x: 1, y: 2 },
        c2: { x: 3, y: 4 },
        c3: { x: 5, y: 6 },
      },
    ],
    detail: {
      sum: {
        c1: { x: 1, y: 2 },
        c2: { x: 3, y: 4 },
        c3: { x: 5, y: 6 },
      },
      count: {
        c1: { x: 1, y: 1 },
        c2: { x: 1, y: 1 },
        c3: { x: 1, y: 1 },
      },
      avg: {
        c1: { x: 1.23456, y: 2.34567 },
        c2: { x: 3.45678, y: 4.56789 },
        c3: { x: 5.67891, y: 6.78912 },
      },
    },
  },
};

describe("KMeansTable", () => {
  afterEach(cleanup);
  beforeEach(() => {
    mocks.reduxState = {
      Favorites: { loading: false, data: { data_kmeans: [oneIteration] } },
    };
  });

  it("renders each iteration and appends sum, count, and three-decimal averages", () => {
    render(<KMeansTable />);
    expect(screen.getByText("Data K-Means")).toBeDefined();
    expect(screen.getByText("Iterasi 1")).toBeDefined();
    expect(screen.getByText("1.000")).toBeDefined();
    expect(screen.getByText("sum")).toBeDefined();
    expect(screen.getByText("count")).toBeDefined();
    expect(screen.getByText("avg")).toBeDefined();
    expect(screen.getByText("1.235")).toBeDefined();
    expect(screen.getByText("6.789")).toBeDefined();
  });

  it("renders nothing until k-means data is available", () => {
    mocks.reduxState = { Favorites: { loading: true, data: null } };
    const { container } = render(<KMeansTable />);
    expect(container.textContent).toBe("");
  });
});
