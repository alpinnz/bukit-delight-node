import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { EllipsisVerticalIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useMemo, useState, type ReactNode } from "react";
import { useDispatch } from "react-redux";
import Actions from "../../actions";
import type { AppDispatch } from "../../store";

type SortOrder = "asc" | "desc";
export type TableColumn<Row extends object> = {
  id: string;
  label: string;
  numeric?: boolean;
  disablePadding?: boolean;
  cell?: (row: Row) => ReactNode;
};

type TableCustomProps<Row extends object> = {
  title: string;
  rows: Row[];
  columns: TableColumn<Row>[];
  loading?: boolean;
  update?: boolean;
  add?: boolean;
  remove?: boolean;
  no?: boolean;
};

const compareValues = (left: unknown, right: unknown): number => {
  if (typeof left === "number" && typeof right === "number") {
    return left < right ? -1 : left > right ? 1 : 0;
  }
  if (typeof left === "string" && typeof right === "string") {
    return left.localeCompare(right);
  }
  return 0;
};

const stableSort = <Row extends object>(
  rows: Row[],
  order: SortOrder,
  orderBy: string,
): Row[] =>
  rows
    .map((row, index) => ({ row, index }))
    .sort(
      ({ row: left, index: leftIndex }, { row: right, index: rightIndex }) => {
        const leftValue = left[orderBy as keyof Row];
        const rightValue = right[orderBy as keyof Row];
        const comparison = compareValues(leftValue, rightValue);
        const ordered = order === "asc" ? comparison : -comparison;
        return ordered || leftIndex - rightIndex;
      },
    )
    .map(({ row }) => row);

const TableCustom = <Row extends object>({
  title,
  rows,
  columns,
  loading = false,
  update = false,
  add = false,
  remove = false,
  no = false,
}: TableCustomProps<Row>) => {
  const dispatch = useDispatch<AppDispatch>();
  const [order, setOrder] = useState<SortOrder>("asc");
  const [orderBy, setOrderBy] = useState(columns[0]?.id ?? "");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const filterColumn = columns[0]?.id;

  const filteredRows = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    if (!query || !filterColumn) return rows;
    return rows.filter((row) => {
      const value = row[filterColumn as keyof Row];
      return (
        value !== null &&
        value !== undefined &&
        String(value).toLocaleLowerCase().includes(query)
      );
    });
  }, [filterColumn, rows, search]);
  const sortedRows = useMemo(
    () => stableSort(filteredRows, order, orderBy),
    [filteredRows, order, orderBy],
  );
  const visibleRows = sortedRows.slice(
    page * rowsPerPage,
    (page + 1) * rowsPerPage,
  );
  const emptyRows = Math.max(0, rowsPerPage - visibleRows.length);
  const hasRowActions = update || remove;

  const requestSort = (columnId: string) => {
    const nextOrder = orderBy === columnId && order === "asc" ? "desc" : "asc";
    setOrder(nextOrder);
    setOrderBy(columnId);
  };
  const openCreateDialog = () =>
    dispatch(Actions.Service.openFormDialog("create", {}));
  const openRowDialog = (kind: "update" | "delete", row: Row) =>
    dispatch(Actions.Service.openFormDialog(kind, row));

  return (
    <section className="mb-4 w-full overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
      <header className="flex flex-wrap items-center gap-3 border-b border-slate-200 px-4 py-3">
        <h2 className="min-w-40 flex-1 text-lg font-semibold text-slate-900">
          {title}
        </h2>
        <label htmlFor={`search-${title}`} className="sr-only">
          Search {title}
        </label>
        <input
          id={`search-${title}`}
          type="search"
          aria-label={`Search ${title}`}
          placeholder="Search"
          value={search}
          onChange={(event) => {
            setPage(0);
            setSearch(event.target.value);
          }}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 sm:w-56"
        />
        {add && (
          <button
            type="button"
            aria-label={`Add ${title}`}
            disabled={loading}
            onClick={openCreateDialog}
            className="rounded-md p-2 text-indigo-700 hover:bg-indigo-50 disabled:opacity-50"
          >
            <PlusIcon aria-hidden="true" className="size-5" />
          </button>
        )}
      </header>
      <div className="overflow-x-auto">
        <table
          aria-label={title}
          className="min-w-full divide-y divide-slate-200 text-sm"
        >
          <thead className="bg-slate-50">
            <tr>
              {no && (
                <th
                  scope="col"
                  className="px-3 py-3 text-center font-semibold text-slate-700"
                >
                  No
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.id}
                  scope="col"
                  aria-sort={
                    orderBy === column.id
                      ? order === "asc"
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                  className={`px-3 py-3 font-semibold text-slate-700 ${column.numeric ? "text-right" : "text-left"}`}
                >
                  <button
                    type="button"
                    onClick={() => requestSort(column.id)}
                    className="inline-flex items-center gap-1 hover:text-indigo-700 focus-visible:outline-2 focus-visible:outline-indigo-600"
                  >
                    {column.label}
                    {orderBy === column.id && (
                      <span aria-hidden="true">
                        {order === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </button>
                </th>
              ))}
              {hasRowActions && (
                <th
                  scope="col"
                  className="px-3 py-3 text-center font-semibold text-slate-700"
                >
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {visibleRows.map((row, index) => (
              <tr
                key={String(Reflect.get(row, "_id") ?? index)}
                className="hover:bg-slate-50"
              >
                {no && (
                  <td className="px-3 py-3 text-center text-slate-600">
                    {page * rowsPerPage + index + 1}
                  </td>
                )}
                {columns.map((column) => {
                  const value = row[column.id as keyof Row];
                  return (
                    <td
                      key={column.id}
                      className={`px-3 py-3 text-slate-700 ${column.numeric ? "text-right" : "text-left"}`}
                    >
                      {column.cell ? column.cell(row) : (value as ReactNode)}
                    </td>
                  );
                })}
                {hasRowActions && (
                  <td className="px-3 py-2 text-center">
                    <div className="relative inline-block text-left">
                      <Menu>
                        <MenuButton
                          aria-label={`Actions for row ${index + 1}`}
                          className="rounded-md p-1 text-slate-600 hover:bg-slate-100"
                        >
                          <EllipsisVerticalIcon
                            aria-hidden="true"
                            className="size-5"
                          />
                        </MenuButton>
                        <MenuItems className="absolute right-0 z-20 mt-1 w-36 rounded-md bg-white py-1 text-left shadow-lg ring-1 ring-black/5 focus:outline-none">
                          {update && (
                            <MenuItem>
                              <button
                                type="button"
                                disabled={loading}
                                onClick={() => openRowDialog("update", row)}
                                className="block w-full px-3 py-2 text-sm text-slate-700 data-focus:bg-slate-100 disabled:opacity-50"
                              >
                                Update
                              </button>
                            </MenuItem>
                          )}
                          {remove && (
                            <MenuItem>
                              <button
                                type="button"
                                disabled={loading}
                                onClick={() => openRowDialog("delete", row)}
                                className="block w-full px-3 py-2 text-sm text-red-700 data-focus:bg-red-50 disabled:opacity-50"
                              >
                                Delete
                              </button>
                            </MenuItem>
                          )}
                        </MenuItems>
                      </Menu>
                    </div>
                  </td>
                )}
              </tr>
            ))}
            {visibleRows.length === 0 && (
              <tr>
                <td
                  colSpan={
                    columns.length + Number(no) + Number(Boolean(hasRowActions))
                  }
                  className="px-4 py-10 text-center text-slate-500"
                >
                  {search
                    ? "No matching records found."
                    : "No records available."}
                </td>
              </tr>
            )}
            {emptyRows > 0 &&
              visibleRows.length > 0 &&
              Array.from({ length: emptyRows }, (_, index) => (
                <tr key={`empty-${index}`} aria-hidden="true">
                  <td
                    colSpan={
                      columns.length +
                      Number(no) +
                      Number(Boolean(hasRowActions))
                    }
                    className="h-12"
                  />
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <footer className="flex flex-wrap items-center justify-end gap-4 border-t border-slate-200 px-4 py-3 text-sm text-slate-600">
        <label className="flex items-center gap-2">
          Rows per page
          <select
            value={rowsPerPage}
            onChange={(event) => {
              setRowsPerPage(Number(event.target.value));
              setPage(0);
            }}
            className="rounded border border-slate-300 bg-white px-2 py-1"
          >
            {[5, 10, 25].map((count) => (
              <option key={count} value={count}>
                {count}
              </option>
            ))}
          </select>
        </label>
        <span>
          {filteredRows.length === 0
            ? "0"
            : `${page * rowsPerPage + 1}–${Math.min((page + 1) * rowsPerPage, filteredRows.length)}`}{" "}
          of {filteredRows.length}
        </span>
        <button
          type="button"
          aria-label="Previous page"
          disabled={page === 0}
          onClick={() => setPage((current) => Math.max(0, current - 1))}
          className="rounded px-2 py-1 hover:bg-slate-100 disabled:opacity-40"
        >
          Previous
        </button>
        <button
          type="button"
          aria-label="Next page"
          disabled={(page + 1) * rowsPerPage >= filteredRows.length}
          onClick={() => setPage((current) => current + 1)}
          className="rounded px-2 py-1 hover:bg-slate-100 disabled:opacity-40"
        >
          Next
        </button>
      </footer>
    </section>
  );
};

export default TableCustom;
