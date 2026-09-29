import { useEffect, useState, type FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import Mobile from "./home/mobile";
import Laptop from "./laptop.page";
import Actions from "../../../actions";
import type { RootState } from "../../../reducers";
import type { AppDispatch } from "../../../store";

const CustomerTableSelection = () => {
  const tables = useSelector((state: RootState) => state.Tables.data);
  const loading = useSelector((state: RootState) => state.Tables.loading);
  const currentTable = useSelector((state: RootState) => state.Tables.table);
  const customer = useSelector((state: RootState) => state.Customers.customer);
  const [tableId, setTableId] = useState("");
  const [isChanging, setIsChanging] = useState(!currentTable);
  const dispatch = useDispatch<AppDispatch>();

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const selectedTable = tables.find((table) => table._id === tableId);
    if (selectedTable) {
      dispatch(Actions.Tables.setTable(selectedTable));
      setIsChanging(false);
    }
  };

  if (!isChanging && currentTable) {
    return (
      <section className="flex min-h-screen flex-col items-center justify-center gap-4 bg-stone-100 px-5 text-center">
        <p className="text-sm text-slate-600">Halo, {customer?.username}</p>
        <h1 className="text-2xl font-bold text-brand-brown">
          Meja {currentTable.name} dipilih
        </h1>
        <p className="max-w-sm text-sm leading-6 text-slate-600">
          Pilihan meja ini akan digunakan untuk pesanan Anda.
        </p>
        <button
          type="button"
          onClick={() => setIsChanging(true)}
          className="min-h-11 rounded-lg border border-brand-primary px-5 py-2 text-sm font-semibold text-brand-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
        >
          Ganti meja
        </button>
      </section>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-100 px-5 py-10">
      <section className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl sm:p-8">
        <p className="text-sm text-slate-600">Halo, {customer?.username}</p>
        <h1 className="mt-2 text-2xl font-bold text-brand-brown">
          Pilih meja
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Pilih meja yang akan digunakan untuk pesanan Anda.
        </p>
        {loading ? (
          <p className="mt-6 text-sm text-slate-600" role="status">
            Memuat daftar meja…
          </p>
        ) : tables.length > 0 ? (
          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <label
              htmlFor="customer-table"
              className="block text-sm font-medium text-slate-700"
            >
              Meja
            </label>
            <select
              id="customer-table"
              required
              value={tableId}
              onChange={(event) => setTableId(event.currentTarget.value)}
              className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-brand-primary focus:outline-none focus:ring-4 focus:ring-brand-primary/10"
            >
              <option value="" disabled>
                Pilih meja
              </option>
              {tables.map((table) => (
                <option key={table._id} value={table._id}>
                  {table.name}
                </option>
              ))}
            </select>
            <button
              type="submit"
              disabled={!tableId}
              className="min-h-11 w-full rounded-lg bg-brand-primary px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              Lanjut ke menu
            </button>
          </form>
        ) : (
          <p
            className="mt-6 rounded-lg bg-amber-50 p-4 text-sm text-amber-900"
            role="status"
          >
            Belum ada meja yang tersedia. Silakan hubungi kasir.
          </p>
        )}
      </section>
    </main>
  );
};

const CustomerHomePage = () => {
  const table = useSelector((state: RootState) => state.Tables.table);

  useEffect(() => {
    document.title = "Home";
  }, []);

  if (!table) return <CustomerTableSelection />;

  return (
    <div>
      <div className="md:hidden">
        <Mobile />
      </div>
      <div className="hidden md:block">
        <Laptop />
      </div>
    </div>
  );
};

export default CustomerHomePage;
