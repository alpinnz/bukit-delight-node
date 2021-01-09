/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import TableCustom from "./../../../components/common/table.custom";
import { useDispatch, useSelector } from "react-redux";
import Form from "./form";
import Actions from "./../../../actions";

const Table = () => {
  const Accounts = useSelector((state) => state.Accounts);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(Actions.Accounts.onLoad());
    dispatch(Actions.Roles.onLoad());
  }, []);

  const columns = [
    {
      id: "username",
      numeric: false,
      disablePadding: true,
      label: "Username",
    },
    {
      id: "email",
      numeric: false,
      disablePadding: false,
      label: "Email",
    },
    {
      id: "role_name",
      numeric: false,
      disablePadding: false,
      label: "Role",
    },
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
        rows={Accounts["data"]}
        loading={Accounts.loading}
      />
      <Form />
    </div>
  );
};

export default Table;
