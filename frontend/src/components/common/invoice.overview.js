import React, { useEffect } from "react";
import { Typography, makeStyles } from "@material-ui/core";
import convert from "./../../helpers/convert";

const useStyles = makeStyles({
  title: {
    flexGrow: 1,
  },
});

const TextTitleValue = (props) => {
  const classes = useStyles();
  const {
    title,
    value,
    value2,
    boldLeft,
    boldRight,
    colorRight,
    paddingTop,
  } = props;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        paddingTop: paddingTop,
      }}
    >
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
            color: colorRight ? colorRight : "#000000",
            marginLeft: "1rem",
            textDecorationLine: value2 ? "line-through" : null,
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
              color: colorRight ? colorRight : "#000000",
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

const Overview = (props) => {
  const { data, account, change, status, no_transaction } = props;

  useEffect(() => {}, [change, data, change]);

  if (!data) {
    return <div />;
  }

  return (
    <div>
      <TextTitleValue
        title="Tanggal"
        paddingTop="1rem"
        boldRight
        value={convert.DateToTanggal(data["createdAt"])}
      />
      {no_transaction && (
        <TextTitleValue
          title="No. Transaction"
          paddingTop="0.25rem"
          boldRight
          value={no_transaction || ""}
        />
      )}

      <TextTitleValue
        title="No. Order"
        paddingTop="0.25rem"
        boldRight
        value={data["_id"] || ""}
      />
      <TextTitleValue
        title="No. Meja"
        paddingTop="0.25rem"
        boldRight
        value={data["id_table"]["name"] || ""}
      />
      <TextTitleValue
        title="Atas Nama"
        paddingTop="0.25rem"
        boldRight
        value={data["id_customer"]["username"] || ""}
      />
      {account && (
        <TextTitleValue
          title="Kasir"
          paddingTop="0.25rem"
          boldRight
          value={account["username"] || ""}
        />
      )}
      {status && (
        <TextTitleValue
          title="Status"
          paddingTop="0.25rem"
          boldRight
          value={status || ""}
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
        value={data["quality"] || ""}
      />
      {data["promo"] > 0 ? (
        <div>
          <TextTitleValue
            title="Promo"
            paddingTop="0.25rem"
            boldLeft
            boldRight
            colorRight="#CF672E"
            value={convert.Rp(data["promo"])}
          />

          <TextTitleValue
            title="Total Harga"
            paddingTop="0.25rem"
            boldLeft
            boldRight
            colorRight="#CF672E"
            value={convert.Rp(data["price"])}
            value2={convert.Rp(data["total_price"])}
          />
        </div>
      ) : (
        <div>
          <TextTitleValue
            title="Total Harga"
            paddingTop="0.25rem"
            boldLeft
            boldRight
            colorRight="#CF672E"
            value2={convert.Rp(data["total_price"])}
          />
        </div>
      )}
      {change === 0 || change ? (
        <TextTitleValue
          title="Kembalian"
          paddingTop="0.25rem"
          boldLeft
          boldRight
          colorRight="#CF672E"
          value={convert.Rp(change)}
        />
      ) : (
        <div />
      )}
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

export default Overview;
