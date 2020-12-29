const ADD = (cart) => {
  return {
    type: "Cart/ADD_CART",
    payload: cart,
  };
};

const EDIT = (id, cart) => {
  return {
    type: "Cart/EDIT_CART",
    payload: { _id: id, cart: cart },
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
