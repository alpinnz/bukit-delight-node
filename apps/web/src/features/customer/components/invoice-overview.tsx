import type { ReactNode } from "react";
import { Typography, makeStyles } from "@material-ui/core";
import Convert from "../../../helpers/convert";

const useStyles = makeStyles({ title: { flexGrow: 1 } });

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
  colorRight?: string;
  paddingTop?: string;
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
  const classes = useStyles();

  return (
    <div style={{ display: "flex", alignItems: "center", paddingTop }}>
      <Typography
        align="left"
        style={{ fontWeight: boldLeft ? "bold" : "normal" }}
        className={classes.title}
      >
        {title}
      </Typography>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <Typography
          align="right"
          className={classes.title}
          style={{
            fontWeight: boldRight ? "bold" : "normal",
            color: colorRight ?? "#000000",
            marginLeft: "1rem",
            textDecorationLine: value2 ? "line-through" : undefined,
          }}
        >
          {value}
        </Typography>
        {value2 && (
          <Typography
            align="right"
            className={classes.title}
            style={{
              fontWeight: boldRight ? "bold" : "normal",
              color: colorRight ?? "#000000",
              marginLeft: "1rem",
            }}
          >
            {value2}
          </Typography>
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
          title="Kasir"
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
      <div
        style={{
          marginTop: "1rem",
          backgroundColor: "#000",
          opacity: 0.25,
          height: 1,
        }}
      />
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
            colorRight="#CF672E"
            value={Convert.Rp(data.promo ?? 0)}
          />
          <TextTitleValue
            title="Total Harga"
            paddingTop="0.25rem"
            boldLeft
            boldRight
            colorRight="#CF672E"
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
          colorRight="#CF672E"
          value2={Convert.Rp(data.total_price ?? 0)}
        />
      )}
      {change === 0 || change ? (
        <TextTitleValue
          title="Kembalian"
          paddingTop="0.25rem"
          boldLeft
          boldRight
          colorRight="#CF672E"
          value={Convert.Rp(change)}
        />
      ) : null}
      <div
        style={{
          marginTop: "1rem",
          backgroundColor: "#000",
          opacity: 0.25,
          height: 1,
        }}
      />
    </div>
  );
};

export default CustomerInvoiceOverview;
