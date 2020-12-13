const UPDATE = (menus) => {
  return {
    type: "Menus/UPDATE",
    payload: menus,
  };
};

const MenusAction = {
  UPDATE,
};
export default MenusAction;
