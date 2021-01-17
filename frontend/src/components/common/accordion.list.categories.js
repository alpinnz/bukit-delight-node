import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import convert from "./../../helpers/convert";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginBottom: "1rem",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

const AccordionListCategories = (props) => {
  const { data } = props;
  const classes = useStyles();

  const ItemView = (props) => {
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
          {item["promo"] > 0 ? (
            <div style={{ display: "flex", alignItems: "center" }}>
              <Typography
                style={{
                  color: "#CF672E",
                  width: "5rem",
                  textDecorationLine:
                    item["promo"] > 0 ? "line-through" : "none",
                }}
                variant="caption"
              >
                {`@${convert.RpIndonesia(
                  Number(item["id_menu"]["price"]) -
                    Number(item["id_menu"]["promo"])
                )}`}
              </Typography>
              <Typography style={{ color: "#CF672E" }} variant="caption">
                {`@${convert.RpIndonesia(item["id_menu"]["price"])}`}
              </Typography>
            </div>
          ) : (
            <Typography style={{ color: "#CF672E" }} variant="caption">
              {`@${convert.RpIndonesia(item["id_menu"]["price"])}`}
            </Typography>
          )}

          {item["note"] && (
            <Typography style={{ color: "#9da4ba" }} variant="subtitle2">
              {item["note"] !== "null" ? item["note"] : ""}
            </Typography>
          )}
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
            {`${convert.RpIndonesia(item["total_price"])}`}
          </Typography>
        </div>
      </div>
    );
  };

  return (
    <div className={classes.root}>
      {data.map((e, i) => {
        return (
          <Accordion
            elevation={0}
            style={{ backgroundColor: "transparent" }}
            key={`Accordion-${i}`}
          >
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
                  <ItemView
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
};

export default AccordionListCategories;
