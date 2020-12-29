/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import AdminLayout from "./../../components/layouts/admin";
import Table from "./../../components/table";
import { useSelector, useDispatch } from "react-redux";
import Actions from "./../../redux/actions";
import Axios from "./../../helpers/axios";
import Form from "./../../components/admin/tables/form";

const TablesView = () => {
  const Tables = useSelector((state) => state.Tables);
  const [form, setForm] = React.useState({
    open: false,
    type: null,
    row: {},
  });

  const dispatch = useDispatch();

  React.useEffect(() => {
    LOAD_API_GET();
  }, []);

  const LOAD_API_GET = () => {
    Axios.get("api/v1/tables")
      .then((response) => {
        console.log(response);
        const data = response["data"]["data"];
        dispatch(Actions.Tables.UPDATE(data));
      })
      .catch((err) => {
        console.log(err);
        dispatch(Actions.Services.popupNotification(`Tables :${err}`));
      });
  };

  const columns = [
    {
      name: "Name",
      selector: "name",
      sortable: true,
    },
    {
      name: "Desc",
      // selector: "name",
      // sortable: true,
    },
  ];

  return (
    <AdminLayout title="Tables">
      <Form form={form} setForm={setForm} />
      <Table
        title="Data Tables"
        columns={columns}
        data={Tables["data"]}
        form={form}
        setForm={setForm}
      />
    </AdminLayout>
  );
};

export default TablesView;
