import {
  useState,
  type ChangeEvent,
  type ComponentType,
  type MouseEvent,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";
import {
  IconButton,
  lighten,
  makeStyles,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Toolbar,
  Typography,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { useDispatch } from "react-redux";
import Actions from "../../actions";
import type { AppDispatch } from "../../store";

type DivTablePaginationProps = {
  component: "div";
  rowsPerPageOptions: number[];
  count: number;
  rowsPerPage: number;
  page: number;
  onChangePage: (
    event: MouseEvent<HTMLButtonElement> | null,
    page: number,
  ) => void;
  onChangeRowsPerPage: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
};
const DivTablePagination =
  TablePagination as unknown as ComponentType<DivTablePaginationProps>;

type SortOrder = "asc" | "desc";
export type TableColumn<Row extends object> = {
  id: string;
  label: string;
  numeric?: boolean;
  disablePadding?: boolean;
  cell?: (row: Row) => ReactNode;
};

type TableCustomProps<Row extends object> = {
  title: string;
  rows: Row[];
  columns: TableColumn<Row>[];
  loading?: boolean;
  update?: boolean;
  add?: boolean;
  remove?: boolean;
  no?: boolean;
};

type ToolbarProps = {
  title: string;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  setPage: Dispatch<SetStateAction<number>>;
  loading?: boolean;
  add?: boolean;
};

type HeadProps<Row extends object> = {
  visuallyHiddenClassName: string;
  order: SortOrder;
  orderBy: string;
  onRequestSort: (event: MouseEvent<HTMLElement>, property: string) => void;
  columns: TableColumn<Row>[];
  update?: boolean;
  remove?: boolean;
  no?: boolean;
};

type ActionMenuProps<Row extends object> = {
  row: Row;
  loading?: boolean;
  update?: boolean;
  remove?: boolean;
};

const compareValues = (left: unknown, right: unknown): number => {
  if (typeof left === "number" && typeof right === "number") {
    return left < right ? -1 : left > right ? 1 : 0;
  }
  if (typeof left === "string" && typeof right === "string") {
    return left < right ? -1 : left > right ? 1 : 0;
  }
  return 0;
};

const descendingComparator = <Row extends object>(
  firstRow: Row,
  secondRow: Row,
  orderBy: string,
): number => {
  const firstValue = firstRow[orderBy as keyof Row];
  const secondValue = secondRow[orderBy as keyof Row];
  return compareValues(secondValue, firstValue);
};

const getComparator = <Row extends object>(
  order: SortOrder,
  orderBy: string,
) =>
  order === "desc"
    ? (firstRow: Row, secondRow: Row) =>
        descendingComparator(firstRow, secondRow, orderBy)
    : (firstRow: Row, secondRow: Row) =>
        -descendingComparator(firstRow, secondRow, orderBy);

const stableSort = <Row extends object>(
  rows: Row[],
  comparator: (firstRow: Row, secondRow: Row) => number,
): Row[] =>
  rows
    .map((row, index) => [row, index] as const)
    .sort(([firstRow, firstIndex], [secondRow, secondIndex]) => {
      const order = comparator(firstRow, secondRow);
      return order !== 0 ? order : firstIndex - secondIndex;
    })
    .map(([row]) => row);

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: "1 1 100%",
  },
}));

const EnhancedTableToolbar = ({
  title,
  search,
  setSearch,
  setPage,
  loading,
  add,
}: ToolbarProps) => {
  const classes = useToolbarStyles();
  const dispatch = useDispatch<AppDispatch>();
  const openCreateDialog = () =>
    dispatch(Actions.Service.openFormDialog("create", {}));

  return (
    <Toolbar className={classes.root}>
      <Typography
        className={classes.title}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        {title}
      </Typography>
      <TextField
        id="outlined-search"
        type="search"
        size="small"
        aria-label="Search Input"
        placeholder="Search"
        variant="outlined"
        value={search}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          setPage(0);
          setSearch(event.target.value);
        }}
      />
      {add && (
        <IconButton
          aria-controls="simple-menu"
          aria-haspopup="true"
          disabled={loading}
          onClick={openCreateDialog}
          aria-label="Add"
        >
          <AddIcon />
        </IconButton>
      )}
    </Toolbar>
  );
};

const EnhancedTableHead = <Row extends object>({
  visuallyHiddenClassName,
  order,
  orderBy,
  onRequestSort,
  columns,
  update,
  remove,
  no,
}: HeadProps<Row>) => {
  const createSortHandler =
    (property: string) => (event: MouseEvent<HTMLElement>) =>
      onRequestSort(event, property);

  return (
    <TableHead>
      <TableRow>
        {no && (
          <TableCell align="center" padding="checkbox">
            No
          </TableCell>
        )}
        {columns.map((column) => (
          <TableCell
            key={column.id}
            align={column.numeric ? "right" : "left"}
            padding={column.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === column.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === column.id}
              direction={orderBy === column.id ? order : "asc"}
              onClick={createSortHandler(column.id)}
            >
              {column.label}
              {orderBy === column.id ? (
                <span className={visuallyHiddenClassName}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        {(update || remove) && <TableCell align="center" padding="checkbox" />}
      </TableRow>
    </TableHead>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    overflowX: "auto",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
}));

const ActionMenu = <Row extends object>({
  row,
  loading,
  update,
  remove,
}: ActionMenuProps<Row>) => {
  const dispatch = useDispatch<AppDispatch>();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const openDialog = (type: "update" | "delete") => {
    dispatch(Actions.Service.openFormDialog(type, row));
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        aria-controls="simple-menu"
        aria-haspopup="true"
        aria-label="Row actions"
        onClick={(event) => setAnchorEl(event.currentTarget)}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        {update && (
          <MenuItem onClick={() => openDialog("update")} disabled={loading}>
            Update
          </MenuItem>
        )}
        {remove && (
          <MenuItem onClick={() => openDialog("delete")} disabled={loading}>
            Delete
          </MenuItem>
        )}
      </Menu>
    </div>
  );
};

const TableCustom = <Row extends object>({
  title,
  rows,
  columns,
  loading,
  update,
  add,
  remove,
  no,
}: TableCustomProps<Row>) => {
  const classes = useStyles();
  const [order, setOrder] = useState<SortOrder>("asc");
  const [orderBy, setOrderBy] = useState("calories");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const filterColumn = columns[0]?.id;
  const filteredRows = rows.filter((row) => {
    if (!filterColumn) return false;
    const filterValue = row[filterColumn as keyof Row];
    return (
      Boolean(filterValue) &&
      String(filterValue).toLowerCase().includes(search.toLowerCase())
    );
  });
  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const handleRequestSort = (
    _event: MouseEvent<HTMLElement>,
    property: string,
  ) => {
    const isAscending = orderBy === property && order === "asc";
    setOrder(isAscending ? "desc" : "asc");
    setOrderBy(property);
  };
  const handleChangePage = (
    _event: MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => setPage(newPage);
  const handleChangeRowsPerPage = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10));
    setPage(0);
  };
  const rowNumber = (index: number) =>
    page === 0 ? index + 1 : index + 1 + rowsPerPage * page;

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar
          title={title}
          search={search}
          setSearch={setSearch}
          setPage={setPage}
          loading={loading}
          add={add}
        />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size="medium"
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              visuallyHiddenClassName={classes.visuallyHidden}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              columns={columns}
              update={update}
              remove={remove}
              no={no}
            />
            <TableBody>
              {stableSort(filteredRows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow hover tabIndex={-1} key={index}>
                    {no && (
                      <TableCell align="center" padding="checkbox">
                        {rowNumber(index)}
                      </TableCell>
                    )}
                    {columns.map((column, columnIndex) => {
                      const cellValue = row[column.id as keyof Row];
                      if (!cellValue && cellValue !== 0) return null;
                      return (
                        <TableCell key={`${columnIndex}-${String(cellValue)}`}>
                          {column.cell
                            ? column.cell(row)
                            : (cellValue as ReactNode)}
                        </TableCell>
                      );
                    })}
                    {(update || remove) && (
                      <TableCell align="center" padding="checkbox">
                        <ActionMenu
                          update={update}
                          remove={remove}
                          row={row}
                          loading={loading}
                        />
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <DivTablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
};

export default TableCustom;
