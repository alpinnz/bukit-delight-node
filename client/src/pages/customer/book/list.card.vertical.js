/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import ListCartVerticalCustom from "./list.card.vertical.custom";

import Actions from "./../../../actions";

import { useSelector, useDispatch } from "react-redux";

const ListCardVertical = () => {
  const Categories = useSelector((state) => state.Categories);
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(Actions.Categories.onLoad());
  }, []);

  return (
    <div>
      <ListCartVerticalCustom data={Categories["data"]} />
    </div>
  );
};

export default ListCardVertical;
