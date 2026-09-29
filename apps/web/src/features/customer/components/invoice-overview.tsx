import type { ReactNode } from "react";
import Convert from "../../../helpers/convert";

export type InvoiceRecord = {
  _id?: string;
  status?: string;
  createdAt?: string;
  id_table?: { name?: string };
  id_customer?: { username?: string };
  quality?: number | string;
  promo?: number;
  price?: number;
  total_price?: number;
};
type InvoiceOverviewProps = {
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

const CustomerInvoiceOverview = ({
  data,
  account,
  change,
  status,
  no_transaction,
}: InvoiceOverviewProps) => {
  if (!data) return null;

  return (
    <div>
      <TextTitleValue
        title="Tanggal"
        paddingTop="1rem"
        boldRight
        value={Convert.DateToTanggal(data.createdAt ?? "")}
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
        value={data._id ?? ""}
      />
      <TextTitleValue
        title="No. Meja"
        paddingTop="0.25rem"
        boldRight
        value={data.id_table?.name ?? ""}
      />
      <TextTitleValue
        title="Atas Nama"
        paddingTop="0.25rem"
        boldRight
        value={data.id_customer?.username ?? ""}
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
            value={Convert.Rp(data.promo ?? 0)}
          />
          <TextTitleValue
            title="Total Harga"
            paddingTop="0.25rem"
            boldLeft
            boldRight
            colorRight="brand"
            value={Convert.Rp(data.price ?? 0)}
            value2={Convert.Rp(data.total_price ?? 0)}
          />
        </div>
      ) : (
        <TextTitleValue
          title="Total Harga"
          paddingTop="0.25rem"
          boldLeft
          boldRight
          colorRight="brand"
          value2={Convert.Rp(data.total_price ?? 0)}
        />
      )}
      {change === 0 || change ? (
        <TextTitleValue
          title="Kembalian"
          paddingTop="0.25rem"
          boldLeft
          boldRight
          colorRight="brand"
          value={Convert.Rp(change)}
        />
      ) : null}
      <div aria-hidden="true" className="mt-4 h-px bg-black/25" />
    </div>
  );
};

export default CustomerInvoiceOverview;
