import AdminTemplate from "../../../components/templates/admin";
import AccountTable from "./accounts/table";

const AdminAccountsPage = () => (
  <AdminTemplate title="Accounts">
    <AccountTable />
  </AdminTemplate>
);

export default AdminAccountsPage;
