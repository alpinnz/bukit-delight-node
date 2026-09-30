import { useSelector } from "react-redux";

type DistanceRow = {
  no: number;
  c1: number;
  c2: number;
  c3: number;
  cluster: number;
};
type Coordinates = { x: number | string; y: number | string };
type NewDataRow = {
  no: number | string;
  c1: Coordinates;
  c2: Coordinates;
  c3: Coordinates;
};
type Aggregate = { x: number; y: number };
type Detail = {
  sum: Record<"c1" | "c2" | "c3", Aggregate>;
  count: Record<"c1" | "c2" | "c3", Aggregate>;
  avg: Record<"c1" | "c2" | "c3", Aggregate>;
};
type Iteration = {
  iteration: number;
  data: DistanceRow[];
  new_data: { data: NewDataRow[]; detail: Detail };
};
type FavoritesState = {
  data: { kmeans_data?: Iteration[] } | null;
  loading: boolean;
};

const tableClass = "min-w-full divide-y divide-slate-200 text-sm";
const headerCellClass =
  "bg-slate-50 px-3 py-2 text-center font-semibold text-slate-700";
const cellClass = "whitespace-nowrap px-3 py-2 text-slate-700";

const DataTable = ({ rows }: { rows: DistanceRow[] }) => (
  <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
    <table className={tableClass}>
      <thead>
        <tr>
          {["No", "C1", "C2", "C3", "Cluster"].map((heading) => (
            <th key={heading} scope="col" className={headerCellClass}>
              {heading}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {rows.map((row) => (
          <tr key={row.no}>
            <th scope="row" className={`${cellClass} text-center font-medium`}>
              {row.no}
            </th>
            <td className={`${cellClass} text-right`}>{row.c1.toFixed(3)}</td>
            <td className={`${cellClass} text-right`}>{row.c2.toFixed(3)}</td>
            <td className={`${cellClass} text-right`}>{row.c3.toFixed(3)}</td>
            <td className={`${cellClass} text-center`}>{row.cluster}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const NewDataTable = ({ rows }: { rows: NewDataRow[] }) => (
  <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
    <table className={tableClass}>
      <thead>
        <tr>
          {["No", "C1 X", "C1 Y", "C2 X", "C2 Y", "C3 X", "C3 Y"].map(
            (heading) => (
              <th key={heading} scope="col" className={headerCellClass}>
                {heading}
              </th>
            ),
          )}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {rows.map((row, index) => (
          <tr key={`${row.no}-${index}`}>
            <th scope="row" className={`${cellClass} text-center font-medium`}>
              {row.no}
            </th>
            <td className={`${cellClass} text-center`}>{row.c1.x}</td>
            <td className={`${cellClass} text-center`}>{row.c1.y}</td>
            <td className={`${cellClass} text-center`}>{row.c2.x}</td>
            <td className={`${cellClass} text-center`}>{row.c2.y}</td>
            <td className={`${cellClass} text-center`}>{row.c3.x}</td>
            <td className={`${cellClass} text-center`}>{row.c3.y}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const appendSummaryRows = (iteration: Iteration): NewDataRow[] => {
  const { detail } = iteration.new_data;
  const sum: NewDataRow = { no: "sum", ...detail.sum };
  const count: NewDataRow = { no: "count", ...detail.count };
  const avg: NewDataRow = {
    no: "avg",
    c1: { x: detail.avg.c1.x.toFixed(3), y: detail.avg.c1.y.toFixed(3) },
    c2: { x: detail.avg.c2.x.toFixed(3), y: detail.avg.c2.y.toFixed(3) },
    c3: { x: detail.avg.c3.x.toFixed(3), y: detail.avg.c3.y.toFixed(3) },
  };
  return [...iteration.new_data.data, sum, count, avg];
};

const KMeansTable = () => {
  const favorites = useSelector(
    (state: { Favorites: FavoritesState }) => state.Favorites,
  );
  const iterations = favorites.data?.kmeans_data;
  if (!iterations) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-center text-xl font-semibold">Data K-Means</h2>
      {iterations.map((iteration) => (
        <article
          key={iteration.iteration}
          className="space-y-3 rounded-xl bg-slate-50 p-4"
        >
          <h3 className="text-lg font-semibold">{`Iterasi ${iteration.iteration}`}</h3>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <section className="min-w-0 space-y-2">
              <h4 className="text-center font-medium">Data</h4>
              <DataTable rows={iteration.data} />
            </section>
            <section className="min-w-0 space-y-2">
              <h4 className="text-center font-medium">New Data</h4>
              <NewDataTable rows={appendSummaryRows(iteration)} />
            </section>
          </div>
        </article>
      ))}
    </section>
  );
};

export default KMeansTable;
