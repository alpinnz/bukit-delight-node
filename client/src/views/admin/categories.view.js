/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import AdminLayout from "./../../components/layouts/admin";
import Table from "./../../components/table";
import { useSelector, useDispatch } from "react-redux";
import Actions from "./../../redux/actions";
import Axios from "./../../helpers/axios";
import Form from "./../../components/admin/categories/form";

const CategoriesView = () => {
  const Categories = useSelector((state) => state.Categories);
  const [form, setForm] = React.useState({
    open: false,
    type: null,
    row: {},
  });
  const dispatch = useDispatch();

  React.useEffect(() => {
    LOAD_API_GET();
  }, []);

  const LOAD_API_GET = async () => {
    await Axios.get("api/v1/categories")
      .then((response) => {
        const data = response["data"]["data"];
        dispatch(Actions.Categories.UPDATE(data));
      })
      .catch((err) => {
        dispatch(Actions.Services.popupNotification(`Categories :${err}`));
        console.log(err);
      });
  };

  const columns = [
    {
      name: "Name",
      selector: "name",
      sortable: true,
    },
    {
      name: "Description",
      selector: "desc",
      sortable: true,
      width: `45rem`,
    },
    {
      name: "Image",
      grow: 0,
      cell: (row) => (
        <img height="56px" width="76px" alt={row.name} src={row.image} />
      ),
    },
  ];

  return (
    <AdminLayout title="Categories">
      <Form form={form} setForm={setForm} />
      <Table
        title="Data Categories"
        columns={columns}
        data={Categories["data"]}
        form={form}
        setForm={setForm}
      />
    </AdminLayout>
  );
};

export default CategoriesView;
