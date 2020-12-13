import React from "react";
import ReactTable from "react-data-table-component";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import ListMenu from "./list.menu";

const Table = ({ title, columns, data, form, setForm }) => {
  const filter = columns[0].selector;
  const titleFilter = columns[0].name;
  const [textSearch, setTextSearch] = React.useState("");
  const [resetPagination, setResetPagination] = React.useState(false);
  const filteredItems = data.filter(
    (item) =>
      item[filter] &&
      item[filter].toLowerCase().includes(textSearch.toLowerCase())
  );

  const subHeaderComponentMemo = React.useMemo(() => {
    const onRefresh = () => {
      if (textSearch) {
        setResetPagination(!resetPagination);
        setTextSearch("");
      }
    };

    return (
      <TextField
        id="outlined-search"
        type="search"
        size="small"
        aria-label="Search Input"
        placeholder={`Filter By ${titleFilter}`}
        variant="outlined"
        value={textSearch}
        onChange={(e) => {
          onRefresh();
          setTextSearch(e.target.value);
        }}
      />
    );
  }, [titleFilter, textSearch, resetPagination]);

  const onAdd = () => setForm({ ...form, open: true, type: "add", row: {} });
  const onEdit = (row) => {
    setForm({ ...form, open: true, type: "edit", row: row });
  };
  const onDelete = (row) => {
    setForm({ ...form, open: true, type: "delete", row: row });
  };

  const actions = (
    <IconButton color="primary" onClick={() => onAdd()}>
      <AddIcon />
    </IconButton>
  );

  columns.push({
    cell: (row) => (
      <ListMenu
        row={row}
        onDeleteRow={() => onDelete(row)}
        onEditRow={() => onEdit(row)}
      />
    ),
    allowOverflow: true,
    button: true,
    width: "56px", // custom width for icon button
  });

  return (
    <>
      <ReactTable
        title={`${title}`}
        columns={columns}
        data={filteredItems}
        pagination
        actions={actions}
        paginationResetDefaultPage={resetPagination}
        subHeader
        subHeaderComponent={subHeaderComponentMemo}
        persistTableHead
      />
    </>
  );
};

export default Table;
