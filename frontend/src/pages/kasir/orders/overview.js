import React, { useEffect } from "react";
import { Typography, makeStyles } from "@material-ui/core";
import { useSelector } from "react-redux";

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
  const { change } = props;

  useEffect(() => {}, [change]);
  const order = useSelector((state) => state.Orders.order);
  if (!order) {
    return <div />;
  }

  return (
    <div style={{ backgroundColor: "#f3f7ff" }}>
      <TextTitleValue
        title="Tanggal"
        paddingTop="1rem"
        boldRight
        value={order["createdAt"] || ""}
      />
      <TextTitleValue
        title="No. Order"
        paddingTop="0.25rem"
        boldRight
        value={order["_id"] || ""}
      />
      <TextTitleValue
        title="No. Meja"
        paddingTop="0.25rem"
        boldRight
        value={order["id_table"]["name"] || ""}
      />
      <TextTitleValue
        title="Atas Nama"
        paddingTop="0.25rem"
        boldRight
        value={order["id_customer"]["username"] || ""}
      />
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
        value={order["quality"] || ""}
      />

      <TextTitleValue
        title="Promo"
        paddingTop="0.25rem"
        boldLeft
        boldRight
        colorRight="#CF672E"
        value={order["promo"] || ""}
      />

      <TextTitleValue
        title="Total Harga"
        paddingTop="0.25rem"
        boldLeft
        boldRight
        colorRight="#CF672E"
        value={order["price"] || ""}
        value2={order["total_price"] || ""}
      />
      {change === 0 || change ? (
        <TextTitleValue
          title="Kembalian"
          paddingTop="0.25rem"
          boldLeft
          boldRight
          colorRight="#CF672E"
          value={change}
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
