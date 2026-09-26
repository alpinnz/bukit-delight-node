import AdminTemplate from "../../../components/templates/admin";
import CategoryTable from "./categories/table";

const AdminCategoriesPage = () => (
  <AdminTemplate title="Categories">
    <CategoryTable />
  </AdminTemplate>
);

export default AdminCategoriesPage;
