import React, { useEffect } from "react";
import ContainerBase from "./../../../components/common/container.customer.base";
import BannerImage from "./banner.image";
import ListCardVertical from "./list.card.vertical";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
// import Actions from "./../../../actions";
import MenuDialog from "./menu.dialog";

const MobilePage = () => {
  let { _id } = useParams();
  const Menus = useSelector((state) =>
    state.Menus.data.filter((e) => e.id_category._id === _id)
  );
  const Categories = useSelector((state) =>
    state.Categories.data.find((e) => e._id === _id)
  );
  // const dispatch = useDispatch();

  useEffect(() => {
    // dispatch(Actions.Menus.onLoad());
    // dispatch(Actions.Categories.onLoad());
  }, [_id]);

  return (
    <ContainerBase
      type="menu"
      navigationActive={1}
      title={Categories ? Categories.name : ""}
    >
      <BannerImage image={Categories ? Categories.image : null} />

      <ListCardVertical data={Menus} />
      <MenuDialog />
    </ContainerBase>
  );
};

export default MobilePage;
