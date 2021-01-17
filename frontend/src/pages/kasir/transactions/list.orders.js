import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Typography,
  MenuItem,
  Menu,
  IconButton,
  Button,
} from "@material-ui/core";
import FilterListIcon from "@material-ui/icons/FilterList";
import Actions from "./../../../actions";

const TextTitleValue = (props) => {
  const { title, value, color, component, variant } = props;

  return (
    <div>
      <div style={{ display: "flex" }}>
        <div style={{ width: "6rem" }}>
          <Typography
            align="left"
            variant={variant}
            color={color}
            component={component}
          >
            {title}
          </Typography>
        </div>
        <div style={{ marginRight: "1rem" }}>
          <Typography
            align="left"
            variant={variant}
            color={color}
            component={component}
          >
            :
          </Typography>
        </div>
        <div>
          <Typography
            align="left"
            variant={variant}
            color={color}
            component={component}
          >
            {value}
          </Typography>
        </div>
      </div>
    </div>
  );
};

const ListOrders = () => {
  const Orders = useSelector((state) => state.Orders);
  const [anchorEl, setAnchorEl] = useState(null);
  const [sortKey, setSortKey] = useState(null);

  const dispatch = useDispatch();
  const onOpen = (order) => {
    dispatch(Actions.Orders.setOrder(order));
    dispatch(Actions.Service.openDialogReview());
  };

  const data = Orders.data.sort((a, b) => {
    return a[sortKey] - b[sortKey];
  });

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const sortStatus = () => {
    setSortKey("status");
    handleClose();
  };

  const sortTable = () => {
    setSortKey("table_name");
    handleClose();
  };

  return (
    <div
      style={{
        paddingLeft: "0.5rem",
        paddingRight: "0.5rem",
        paddingTop: "0.5rem",
        paddingButton: "0.5rem",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <IconButton
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleClick}
        >
          <FilterListIcon />
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={sortTable}>No Meja</MenuItem>
          <MenuItem onClick={sortStatus}>Status</MenuItem>
        </Menu>
      </div>

      {data.map((e, i) => {
        // if (e["isExpired"]) {
        return (
          <div
            key={i}
            style={{
              paddingTop: "0.5rem",
            }}
          >
            <Button
              fullWidth
              style={{
                padding: "1rem",
                boxShadow: "1px 0.5px 2.5px 0.5px #9E9E9E",
                borderRadius: 20,
                display: "block",
                textTransform: "none",
              }}
              onClick={() => onOpen(e)}
            >
              <div style={{ width: "100%" }}>
                {/* <TextTitleValue
                  variant="h6"
                  component="h2"
                  title="No Order"
                  value={e["_id"]}
                /> */}
                <TextTitleValue
                  color={"textSecondary"}
                  title="No Meja"
                  value={e["id_table"]["name"]}
                />
                <TextTitleValue
                  color={"textSecondary"}
                  title="Customer"
                  value={e["id_customer"]["username"]}
                />
                <TextTitleValue
                  color={"textSecondary"}
                  title="Note"
                  value={e["note"]}
                />
                <TextTitleValue
                  color={"textSecondary"}
                  title="Status"
                  value={e["status"]}
                />

                <Typography variant="body2" component="p"></Typography>
              </div>
            </Button>
          </div>
        );
        //   }
        //   return null;
      })}
    </div>
  );
};

export default ListOrders;
