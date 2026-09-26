import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  makeStyles,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Convert from "../../../helpers/convert";

type OrderedMenu = {
  name: string;
  price: number | string;
  promo?: number | string;
};
type OrderedItem = {
  quality: number;
  id_menu: OrderedMenu;
  promo?: number | string;
  note?: string | null;
  total_price: number | string;
};
export type OrderedCategory = { name: string; itemOrders: OrderedItem[] };

const useStyles = makeStyles((theme) => ({
  root: { width: "100%", marginBottom: "1rem" },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: 400,
  },
}));

const OrderedItemView = ({ item }: { item: OrderedItem }) => {
  const hasPromo = Number(item.promo ?? 0) > 0;

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
          {item.quality}
        </Typography>
      </div>
      <div style={{ width: "60%" }}>
        <Typography style={{ color: "#333333" }}>
          {item.id_menu.name}
        </Typography>
        {hasPromo ? (
          <div style={{ display: "flex", alignItems: "center" }}>
            <Typography
              style={{
                color: "#CF672E",
                width: "5rem",
                textDecorationLine: "line-through",
              }}
              variant="caption"
            >
              {`@${Convert.RpIndonesia(
                Number(item.id_menu.price) - Number(item.id_menu.promo ?? 0),
              )}`}
            </Typography>
            <Typography style={{ color: "#CF672E" }} variant="caption">
              {`@${Convert.RpIndonesia(item.id_menu.price)}`}
            </Typography>
          </div>
        ) : (
          <Typography style={{ color: "#CF672E" }} variant="caption">
            {`@${Convert.RpIndonesia(item.id_menu.price)}`}
          </Typography>
        )}
        {item.note && item.note !== "null" && (
          <Typography style={{ color: "#9da4ba" }} variant="subtitle2">
            {item.note}
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
          {Convert.RpIndonesia(item.total_price)}
        </Typography>
      </div>
    </div>
  );
};

const CustomerAccordionListCategories = ({
  data,
}: {
  data: OrderedCategory[];
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {data.map((category, categoryIndex) => (
        <Accordion
          elevation={0}
          style={{ backgroundColor: "transparent" }}
          key={`Accordion-${categoryIndex}`}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel${categoryIndex}a-content`}
            id={`panel${categoryIndex}a-header`}
          >
            <Typography className={classes.heading}>{category.name}</Typography>
          </AccordionSummary>
          <AccordionDetails style={{ display: "block" }}>
            {category.itemOrders.map((item, itemIndex) => (
              <OrderedItemView
                key={`AccordionDetails-${categoryIndex}-${itemIndex}`}
                item={item}
              />
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default CustomerAccordionListCategories;
