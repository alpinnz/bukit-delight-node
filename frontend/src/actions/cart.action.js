export const LOADING = "CARD/LOADING";
export const MOUNT = "CARD/MOUNT";
export const SET_DATA = "CART/SET_DATA";
export const CREATE = "CART/CREATE";
export const UPDATE = "CART/UPDATE";
export const DELETE = "CART/DELETE";
export const CLEAN = "CART/CLEAN";

export const SET_ORDER = "CART/SET_ORDER";
export const CLEAN_ORDER = "CART/CLEAN_ORDER";

export const SET_TRANSACTION = "CART/SET_TRANSACTION";
export const CLEAN_TRANSACTION = "CART/CLEAN_TRANSACTION";

export const DIALOG_MENU_OPEN = "CART/DIALOG_MENU_OPEN";
export const DIALOG_MENU_HIDE = "CART/DIALOG_MENU_HIDE";

export const DIALOG_PAYMENT_OPEN = "CART/DIALOG_PAYMENT_OPEN";
export const DIALOG_PAYMENT_HIDE = "CART/DIALOG_PAYMENT_HIDE";

export const SELECTED_ADD = "CART/SELECTED_ADD";
export const SELECTED_EDIT = "CART/SELECTED_EDIT";
export const SELECTED_CLEAN = "CART/SELECTED_CLEAN";
export const SELECTED_INCREMENT_QUALITY = "CART/SELECTED_INCREMENT_QUALITY";
export const SELECTED_DESCREMENT_QUALITY = "CART/SELECTED_DESCREMENT_QUALITY";
export const SELECTED_CHANGE_NOTE = "CART/SELECTED_CHANGE_NOTE";

const onMount = () => {
  return async (dispatch, getState) => {
    dispatch(onLoading(true));
    const state = await getState();
    const Menus = state.Menus;
    const Cart = state.Cart;

    let data = [];

    await Cart.data.forEach(async (e) => {
      let menu = await Menus.data.find((x) => `${x._id}` === `${e.id_menu}`);

      if (menu) {
        let cart = {
          _id: e["_id"],
          id_menu: ["id_menu"],
          menu,
          quality: e["quality"],
          note: e["note"],
        };
        const quality = cart["quality"];

        let total_price = Number(quality) * Number(menu.price);
        if (menu.promo) {
          let promo = Number(menu.promo);
          let total_promo = promo * quality;
          let after_promo = total_price - total_promo;
          cart["quality"] = Number(quality);
          cart["promo"] = promo;
          cart["total_price"] = after_promo;
        } else {
          cart["quality"] = Number(quality);
          cart["total_price"] = total_price;
        }
        data.push(cart);
      }
    });

    dispatch(setData(data));
    dispatch(onLoading(false));
  };
};

const setOrder = (order) => {
  return {
    type: SET_ORDER,
    payload: order,
  };
};

const cleanOrder = () => {
  return {
    type: CLEAN_ORDER,
  };
};

const setTransaction = (transaction) => {
  return {
    type: SET_TRANSACTION,
    payload: transaction,
  };
};

const cleanTransaction = () => {
  return {
    type: CLEAN_TRANSACTION,
  };
};

const setData = (data) => {
  return {
    type: SET_DATA,
    payload: data,
  };
};

const onCreate = (menu, quality, note) => {
  return {
    type: CREATE,
    payload: { menu, quality, note },
  };
};

const onUpdate = (menu, _id, quality, note) => {
  return {
    type: UPDATE,
    payload: { menu, _id, quality, note },
  };
};

const onDelete = (id_cart) => {
  return {
    type: DELETE,
    payload: id_cart,
  };
};

const onClean = () => {
  return {
    type: CLEAN,
  };
};

const onLoading = (bool) => {
  return {
    type: LOADING,
    payload: bool,
  };
};

const dialogMenuOpen = () => {
  return {
    type: DIALOG_MENU_OPEN,
  };
};

const dialogMenuHide = () => {
  return {
    type: DIALOG_MENU_HIDE,
  };
};

const dialogPaymentOpen = () => {
  return {
    type: DIALOG_PAYMENT_OPEN,
  };
};

const dialogPaymentHide = () => {
  return {
    type: DIALOG_PAYMENT_HIDE,
  };
};

const selectedAdd = (menu) => {
  return {
    type: SELECTED_ADD,
    payload: menu,
  };
};

const selectedEdit = (menu, id_cart, quality, note) => {
  return {
    type: SELECTED_EDIT,
    payload: { menu, id_cart, quality, note },
  };
};

const selectedClean = () => {
  return {
    type: SELECTED_CLEAN,
  };
};

const selectedIncrementQuality = () => {
  return {
    type: SELECTED_INCREMENT_QUALITY,
  };
};
const selectedDescrementQuality = () => {
  return {
    type: SELECTED_DESCREMENT_QUALITY,
  };
};
const selectedChangeNote = (note) => {
  return {
    type: SELECTED_CHANGE_NOTE,
    payload: note,
  };
};

const AccountsAction = {
  onMount,
  onCreate,
  onUpdate,
  onDelete,
  onClean,
  onLoading,
  dialogPaymentOpen,
  dialogPaymentHide,
  dialogMenuOpen,
  dialogMenuHide,
  selectedAdd,
  selectedEdit,
  selectedClean,
  selectedIncrementQuality,
  selectedDescrementQuality,
  selectedChangeNote,
  setOrder,
  cleanOrder,
  setTransaction,
  cleanTransaction,
};

export default AccountsAction;
