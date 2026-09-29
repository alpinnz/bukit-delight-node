import AdminTemplate from "../../../components/templates/admin";
import UserTable from "./users/table";

const AdminUsersPage = () => (
  <AdminTemplate title="Users">
    <UserTable />
  </AdminTemplate>
);

export default AdminUsersPage;
