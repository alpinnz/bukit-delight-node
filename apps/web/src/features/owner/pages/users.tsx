import OwnerTemplate from "../../../components/templates/owner/layout";
import UserTable from "./users/table";

const OwnerUsersPage = () => (
  <OwnerTemplate title="Users">
    <UserTable />
  </OwnerTemplate>
);

export default OwnerUsersPage;
