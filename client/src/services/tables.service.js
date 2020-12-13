import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import Actions from "./../redux/actions";
import Axios from "./../helpers/axios";

const URL_PATH = "api/v1/tables";

const FETCH_GET = async () => {
  const dispatch = useDispatch();
  return Axios.get(URL_PATH)
    .then((response) => {
      console.log(response);
      const data = response["data"]["data"];
      dispatch(Actions.Tables.UPDATE(data));
    })
    .catch((err) => {
      console.log(err);
      dispatch(Actions.Services.popupNotification(err.toString()));
    });
};

const TablesService = { FETCH_GET };

export default TablesService;
