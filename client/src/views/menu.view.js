/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import ListCartVertical from "./../components/customer/menu/menu.list.vertical";
import ContainerBase from "./../components/container.base";
import Actions from "./../redux/actions";
import Axios from "./../helpers/axios";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import BannerImage from "../components/customer/menu/banner.image";

const MenuView = () => {
  let { _id } = useParams();
  const Menus = useSelector((state) =>
    state.Menus.data.filter((e) => e._id_categories === _id)
  );
  const Categories = useSelector((state) =>
    state.Categories.data.find((e) => e._id === _id)
  );

  const dispatch = useDispatch();

  React.useEffect(() => {
    LOAD_API_GET();
  }, []);

  const LOAD_API_GET = () => {
    Axios.get("api/v1/menus")
      .then((response) => {
        console.log(response);
        const data = response["data"]["data"];
        dispatch(Actions.Menus.UPDATE(data));
      })
      .catch((err) => {
        dispatch(Actions.Services.popupNotification(`Categories :${err}`));
        console.log(err);
      });
    Axios.get("api/v1/categories")
      .then((response) => {
        console.log(response);
        const data = response["data"]["data"];
        dispatch(Actions.Categories.UPDATE(data));
      })
      .catch((err) => {
        dispatch(Actions.Services.popupNotification(`Categories :${err}`));
        console.log(err);
      });
  };

  return (
    <ContainerBase
      navigationActive={1}
      type="menu"
      title={Categories ? Categories.name : ""}
    >
      <BannerImage image={Categories ? Categories.image : null} />
      <ListCartVertical data={Menus} />
    </ContainerBase>
  );
};

export default MenuView;
