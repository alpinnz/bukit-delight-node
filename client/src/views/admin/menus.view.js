/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import AdminLayout from "./../../components/layouts/admin";
import Table from "./../../components/table";
import { useSelector, useDispatch } from "react-redux";
import Actions from "./../../redux/actions";
import Axios from "./../../helpers/axios";
import Form from "./../../components/admin/menus/form";

const MenusView = () => {
  const Menus = useSelector((state) => state.Menus);
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
    Axios.get("api/v1/categories")
      .then((response) => {
        console.log(response);
        const data = response["data"]["data"];
        dispatch(Actions.Categories.UPDATE(data));
      })
      .catch((err) => {
        console.log(err);
        dispatch(Actions.Services.popupNotification(`Categories :${err}`));
      });

    Axios.get("api/v1/menus")
      .then((response) => {
        console.log(response);
        const data = response["data"]["data"];
        dispatch(Actions.Menus.UPDATE(data));
      })
      .catch((err) => {
        console.log(err);
        dispatch(Actions.Services.popupNotification(`Menus :${err}`));
      });
  };

  const columns = [
    {
      name: "Name",
      selector: "name",
      sortable: true,
    },
    {
      name: "Price",
      selector: "price",
      sortable: true,
    },
    {
      name: "Promo",
      selector: "promo",
      sortable: true,
    },
    {
      name: "Categories",
      selector: "name_categories",
      sortable: true,
    },
    {
      name: "Description",
      selector: "desc",
      sortable: true,
      width: `30rem`,
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
    <AdminLayout title="Menus">
      <Form form={form} setForm={setForm} />
      <Table
        title="Data Menus"
        columns={columns}
        data={Menus["data"]}
        form={form}
        setForm={setForm}
      />
    </AdminLayout>
  );
};

export default MenusView;
