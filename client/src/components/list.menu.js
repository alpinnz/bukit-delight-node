import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";

const ListMenu = ({ row, onDeleteRow, onEditRow, size }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const editRow = () => {
    if (onEditRow) {
      console.log(row);
      onEditRow(row);
    }
  };

  const deleteRow = () => {
    if (onDeleteRow) {
      console.log(row);
      onDeleteRow(row);
    }
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
        size={size}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="menu"
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={editRow}>
          <ListItemIcon>
            <EditIcon fontSize="small" color="secondary" />
          </ListItemIcon>
          <Typography variant="inherit">Edit</Typography>
        </MenuItem>

        <Divider />

        <MenuItem onClick={deleteRow}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="secondary" />
          </ListItemIcon>
          <Typography variant="inherit">Delete</Typography>
        </MenuItem>
      </Menu>
    </div>
  );
};

export default ListMenu;
