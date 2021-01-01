const initialState = {
  data: [],
};

const CartReducer = (state = initialState, action) => {
  if (action.type === "Cart/ADD_CART") {
    let temp = state.data;
    temp.push(action.payload);
    return { ...state, data: temp };
  }
  if (action.type === "Cart/EDIT_CART") {
    let temp = state.data;
    const i = temp.findIndex((e) => e._id === action.payload._id);
    temp[i] = {
      ...temp[i],
      note: action.payload.note,
      qty: action.payload.qty,
    };
    return { ...state, data: temp };
  }
  return state;
};

export default CartReducer;
