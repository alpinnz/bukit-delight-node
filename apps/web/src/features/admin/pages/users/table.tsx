import { useSelector } from "react-redux";
import TableCustom from "../../../../components/common/table.custom";
import AccountForm from "./form";

type User = {
  _id: string;
  username: string;
  email: string;
  role_names: string;
  password?: string;
};
type UsersState = { data?: User[]; loading: boolean };

const UserTable = () => {
  const users = useSelector(
    (state: { Users: UsersState }) => state.Users,
  );
  if (!users.data) return null;

  const columns = [
    { id: "username", numeric: false, disablePadding: true, label: "Username" },
    { id: "email", numeric: false, disablePadding: false, label: "Email" },
    { id: "role_names", numeric: false, disablePadding: false, label: "Roles" },
    {
      id: "password",
      numeric: false,
      disablePadding: false,
      label: "Password",
    },
  ];

  return (
    <div>
      <TableCustom
        title="Users"
        columns={columns}
        rows={users.data}
        loading={users.loading}
        add
        update
        remove
        no
      />
      <AccountForm />
    </div>
  );
};

export default UserTable;
