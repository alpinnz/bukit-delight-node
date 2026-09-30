import { useSelector } from "react-redux";
import ManagementTable from "../../../../components/organisms/management-table";
import TableForm from "./form";

type DiningTable = { id: string; name: string };
type TablesState = { data?: DiningTable[]; loading: boolean };

const DiningTableList = () => {
  const tables = useSelector((state: { Tables: TablesState }) => state.Tables);
  if (!tables.data) return null;

  const columns = [
    { id: "name", numeric: false, disablePadding: false, label: "Name" },
  ];

  return (
    <div>
      <ManagementTable
        title="Tables"
        columns={columns}
        rows={tables.data}
        loading={tables.loading}
        add
        update
        remove
        no
      />
      <TableForm />
    </div>
  );
};

export default DiningTableList;
