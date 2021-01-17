import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

export default function SimpleAccordion() {
  const categories = useSelector((state) => state.Orders.order.categories);
  const classes = useStyles();

  const ItemOrderView = (props) => {
    const { item } = props;
    return (
      <div style={{ width: "100%", display: "flex", paddingBottom: "1rem" }}>
        <div
          style={{
            width: "10%",
            display: "flex",

            alignItems: "self-start",
            justifyContent: "flex-start",
          }}
        >
          <Typography style={{ color: "#333333" }} align="left">
            {item["quality"]}
          </Typography>
        </div>
        <div
          style={{
            width: "60%",
          }}
        >
          <Typography style={{ color: "#333333" }}>
            {item["id_menu"]["name"]}
          </Typography>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Typography
              style={{
                color: "#CF672E",
                width: "5rem",
                textDecorationLine: item["promo"] > 0 ? "line-through" : "none",
              }}
              variant="caption"
            >
              {`@Rp ${item["id_menu"]["price"]}`}
            </Typography>
            {item["promo"] > 0 ? (
              <Typography style={{ color: "#CF672E" }} variant="caption">
                {`@Rp ${item["id_menu"]["price"]}`}
              </Typography>
            ) : (
              <div />
            )}
          </div>

          <Typography style={{ color: "#9da4ba" }} variant="subtitle2">
            {item["note"]}
          </Typography>
        </div>
        <div
          style={{
            width: "30%",
            display: "flex",

            alignItems: "self-start",
            justifyContent: "flex-end",
          }}
        >
          <Typography style={{ color: "#333333" }} align="right">
            {`Rp ${item["total_price"]}`}
          </Typography>
        </div>
      </div>
    );
  };

  return (
    <div className={classes.root}>
      {categories.map((e, i) => {
        return (
          <Accordion key={`Accordion-${i}`}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${i}a-content`}
              id={`panel${i}a-header`}
            >
              <Typography className={classes.heading}>{e["name"]}</Typography>
            </AccordionSummary>
            <AccordionDetails style={{ display: "block" }}>
              {e["itemOrders"].map((item, index) => {
                return (
                  <ItemOrderView
                    key={`AccordionDetails-${i}-${index}`}
                    item={item}
                  />
                );
              })}
            </AccordionDetails>
          </Accordion>
        );
      })}
    </div>
  );
}
