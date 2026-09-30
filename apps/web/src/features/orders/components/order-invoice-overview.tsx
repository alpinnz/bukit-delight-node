import type { ReactNode } from "react";
import formatters from "../../../helpers/formatters";

export type InvoiceRecord = {
  id?: string;
  status?: string;
  created_at?: string;
  table_id?: { name?: string };
  customer_id?: { username?: string };
  quality?: number | string;
  promo?: number;
  price?: number;
  total_price?: number;
};
type OrderInvoiceOverviewProps = {
  data?: InvoiceRecord;
  account?: { username?: string };
  change?: number | null;
  status?: string;
  no_transaction?: string;
};

type TextTitleValueProps = {
  title: string;
  value?: ReactNode;
  value2?: ReactNode;
  boldLeft?: boolean;
  boldRight?: boolean;
  colorRight?: "brand";
  paddingTop?: "1rem" | "0.25rem";
};

const TextTitleValue = ({
  title,
  value,
  value2,
  boldLeft,
  boldRight,
  colorRight,
  paddingTop,
}: TextTitleValueProps) => {
  return (
    <div
      className={`flex items-center ${paddingTop === "1rem" ? "pt-4" : paddingTop ? "pt-1" : ""}`}
    >
      <span className={`flex-1 ${boldLeft ? "font-bold" : "font-normal"}`}>
        {title}
      </span>
      <div className="flex items-center justify-end">
        <span
          className={`ml-4 flex-1 text-right ${boldRight ? "font-bold" : "font-normal"} ${value2 ? "line-through" : ""} ${colorRight === "brand" ? "text-brand-primary" : "text-black"}`}
        >
          {value}
        </span>
        {value2 && (
          <span
            className={`ml-4 flex-1 text-right ${boldRight ? "font-bold" : "font-normal"} ${colorRight === "brand" ? "text-brand-primary" : "text-black"}`}
          >
            {value2}
          </span>
        )}
      </div>
    </div>
  );
};

const OrderInvoiceOverview = ({
  data,
  account,
  change,
  status,
  no_transaction,
}: OrderInvoiceOverviewProps) => {
  if (!data) return null;

  return (
    <div>
      <TextTitleValue
        title="Tanggal"
        paddingTop="1rem"
        boldRight
        value={formatters.formatIndonesianDateTime(data.created_at ?? "")}
      />
      {no_transaction && (
        <TextTitleValue
          title="No. Transaction"
          paddingTop="0.25rem"
          boldRight
          value={no_transaction}
        />
      )}
      <TextTitleValue
        title="No. Order"
        paddingTop="0.25rem"
        boldRight
        value={data.id ?? ""}
      />
      <TextTitleValue
        title="No. Meja"
        paddingTop="0.25rem"
        boldRight
        value={data.table_id?.name ?? ""}
      />
      <TextTitleValue
        title="Atas Nama"
        paddingTop="0.25rem"
        boldRight
        value={data.customer_id?.username ?? ""}
      />
      {account && (
        <TextTitleValue
          title="Cashier"
          paddingTop="0.25rem"
          boldRight
          value={account.username ?? ""}
        />
      )}
      {status && (
        <TextTitleValue
          title="Status"
          paddingTop="0.25rem"
          boldRight
          value={status}
        />
      )}
      <div aria-hidden="true" className="mt-4 h-px bg-black/25" />
      <TextTitleValue
        title="Jumlah Item"
        paddingTop="1rem"
        boldLeft
        boldRight
        value={data.quality || ""}
      />
      {Number(data.promo ?? 0) > 0 ? (
        <div>
          <TextTitleValue
            title="Promo"
            paddingTop="0.25rem"
            boldLeft
            boldRight
            colorRight="brand"
            value={formatters.formatRupiah(data.promo ?? 0)}
          />
          <TextTitleValue
            title="Total Harga"
            paddingTop="0.25rem"
            boldLeft
            boldRight
            colorRight="brand"
            value={formatters.formatRupiah(data.price ?? 0)}
            value2={formatters.formatRupiah(data.total_price ?? 0)}
          />
        </div>
      ) : (
        <TextTitleValue
          title="Total Harga"
          paddingTop="0.25rem"
          boldLeft
          boldRight
          colorRight="brand"
          value2={formatters.formatRupiah(data.total_price ?? 0)}
        />
      )}
      {change === 0 || change ? (
        <TextTitleValue
          title="Kembalian"
          paddingTop="0.25rem"
          boldLeft
          boldRight
          colorRight="brand"
          value={formatters.formatRupiah(change)}
        />
      ) : null}
      <div aria-hidden="true" className="mt-4 h-px bg-black/25" />
    </div>
  );
};

export default OrderInvoiceOverview;
