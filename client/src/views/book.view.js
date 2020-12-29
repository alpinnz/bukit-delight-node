/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import ListCartVertical from "./../components/customer/book/list.card.vertical";
import ContainerBase from "./../components/container.base";
import Actions from "./../redux/actions";
import Axios from "./../helpers/axios";
import { useSelector, useDispatch } from "react-redux";

const BookView = () => {
  const Categories = useSelector((state) => state.Categories);
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
        dispatch(Actions.Services.popupNotification(`Categories :${err}`));
        console.log(err);
      });
  };

  return (
    <ContainerBase type="home" navigationActive={1}>
      <ListCartVertical data={Categories["data"]} />
    </ContainerBase>
  );
};

export default BookView;
