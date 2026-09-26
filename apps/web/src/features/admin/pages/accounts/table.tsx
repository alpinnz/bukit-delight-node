import { useSelector } from "react-redux";
import TableCustom from "../../../../components/common/table.custom";
import AccountForm from "./form";

type Account = {
  _id: string;
  username: string;
  email: string;
  role_name: string;
  password?: string;
};
type AccountsState = { data?: Account[]; loading: boolean };

const AccountTable = () => {
  const accounts = useSelector(
    (state: { Accounts: AccountsState }) => state.Accounts,
  );
  if (!accounts.data) return null;

  const columns = [
    { id: "username", numeric: false, disablePadding: true, label: "Username" },
    { id: "email", numeric: false, disablePadding: false, label: "Email" },
    { id: "role_name", numeric: false, disablePadding: false, label: "Role" },
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
        title="Accounts"
        columns={columns}
        rows={accounts.data}
        loading={accounts.loading}
        add
        update
        remove
        no
      />
      <AccountForm />
    </div>
  );
};

export default AccountTable;
