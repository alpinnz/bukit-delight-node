import { LOADING, SET_ORDERS } from "./../actions/orders.action";

const initialState = {
  loading: false,
  data: [],
  dataByCategory: {},
};

const MenusReducer = (state = initialState, action) => {
  if (action.type === LOADING) {
    return { ...state, loading: action.payload };
  }
  if (action.type === SET_ORDERS) {
    return {
      ...state,
      loading: false,
      data: action.payload,
    };
  }

  return state;
};
export default MenusReducer;
