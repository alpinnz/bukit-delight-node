import { MOUNT, LOADING, SET_MENUS } from "./../actions/menus.action";

const initialState = {
  mount: false,
  loading: false,
  data: [],
};

const MenusReducer = (state = initialState, action) => {
  if (action.type === MOUNT) {
    return { ...state, mount: true };
  }
  if (action.type === LOADING) {
    return { ...state, loading: action.payload };
  }
  if (action.type === SET_MENUS) {
    const data = action.payload.map((e) => {
      e["category_id"] = e["id_category"]["_id"];
      e["category_name"] = e["id_category"]["name"];
      return e;
    });
    return {
      ...state,
      loading: false,
      data: data,
    };
  }

  return state;
};
export default MenusReducer;
