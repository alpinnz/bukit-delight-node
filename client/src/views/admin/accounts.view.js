/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import AdminLayout from "./../../components/layouts/admin";
import Table from "./../../components/table";
import { useSelector, useDispatch } from "react-redux";
import Actions from "./../../redux/actions";
import Axios from "./../../helpers/axios";
import Backdrop from "./../../components/backdrop";
import Snackbar from "./../../components/snackbar";
import Form from "./../../components/admin/accounts/form";

const AccountsView = () => {
  const Accounts = useSelector((state) => state.Accounts);
  console.log(Accounts["data"]);
  const [form, setForm] = React.useState({
    open: false,
    type: null,
    row: {},
  });
  const [isLoading, setIsLoading] = React.useState(false);

  console.log(form);

  const dispatch = useDispatch();

  React.useEffect(() => {
    Load_API();
  }, []);

  const Load_API = async () => {
    setIsLoading(true);
    await Axios.get("api/v1/roles")
      .then((response) => {
        console.log(response);
        const data = response["data"]["data"];
        dispatch(Actions.Roles.UPDATE(data));
      })
      .catch((err) => {
        console.log(err);
      });
    await Axios.get("api/v1/accounts")
      .then((response) => {
        console.log(response);
        const data = response["data"]["data"];
        dispatch(Actions.Accounts.UPDATE(data));
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const columns = [
    {
      name: "Username",
      selector: "username",
      sortable: true,
    },
    {
      name: "Email",
      selector: "email",
      sortable: true,
    },
    {
      name: "Roles",
      selector: "name_roles",
      sortable: true,
    },
    {
      name: "Password",
      selector: "password",
      sortable: true,
    },
  ];

  return (
    <AdminLayout title="Accounts">
      <Form form={form} setForm={setForm} />
      <Snackbar />
      <Backdrop onOpen={isLoading} />
      <Table
        title="Data Accounts"
        columns={columns}
        data={Accounts["data"]}
        form={form}
        setForm={setForm}
      />
    </AdminLayout>
  );
};

export default AccountsView;
