const ADD = (cart) => {
  return {
    type: "Cart/ADD_CART",
    payload: cart,
  };
};

const EDIT = (_id, { qty, note }) => {
  return {
    type: "Cart/EDIT_CART",
    payload: { _id, qty, note },
  };
};

const DELETE = (id) => {
  return {
    type: "Cart/DELETE",
    payload: id,
  };
};

const CartAction = {
  ADD,
  EDIT,
  DELETE,
};
export default CartAction;
