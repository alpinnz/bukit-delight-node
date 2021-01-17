import {
  CLEAN_ORDER,
  CLEAN_TRANSACTION,
  SET_ORDER,
  SET_TRANSACTION,
  LOADING,
  CREATE,
  DELETE,
  UPDATE,
  CLEAN,
  SET_DATA,
  DIALOG_PAYMENT_OPEN,
  DIALOG_PAYMENT_HIDE,
  DIALOG_MENU_OPEN,
  DIALOG_MENU_HIDE,
  SELECTED_ADD,
  SELECTED_EDIT,
  SELECTED_CLEAN,
  SELECTED_INCREMENT_QUALITY,
  SELECTED_DESCREMENT_QUALITY,
  SELECTED_CHANGE_NOTE,
} from "./../actions/cart.action";

const initialState = {
  loading: false,
  selected: { bool: false, menu: {}, id_cart: null, quality: 0, note: "" },
  order: null,
  transaction: null,
  dialog_menu: {
    open: false,
  },
  dialog_payment: {
    open: false,
  },
  data: [],
};

const CartReducer = (state = initialState, action) => {
  if (action.type === SET_TRANSACTION) {
    return { ...state, transaction: action.payload };
  }
  if (action.type === CLEAN_TRANSACTION) {
    return { ...state, transaction: null };
  }
  if (action.type === SET_ORDER) {
    return { ...state, order: action.payload };
  }
  if (action.type === CLEAN_ORDER) {
    return { ...state, order: null };
  }
  if (action.type === LOADING) {
    return { ...state, loading: action.payload };
  }
  if (action.type === SET_DATA) {
    return { ...state, data: action.payload };
  }
  if (action.type === CREATE) {
    const { menu, quality, note } = action.payload;
    const _id = new Date().getTime().toString();

    let price = Number(quality) * Number(menu.price);

    let promo = menu.promo ? Number(menu.promo) : 0;
    let total_promo = promo * Number(quality);
    let total_price = price - total_promo;

    return {
      ...state,
      loading: false,
      data: [
        ...state.data,
        {
          _id,
          menu,
          note,
          quality,
          total_promo,
          total_price,
        },
      ],
    };
  }
  if (action.type === UPDATE) {
    const { _id, menu, quality, note } = action.payload;

    let price = Number(quality) * Number(menu.price);

    let promo = menu.promo ? Number(menu.promo) : 0;
    let total_promo = promo * Number(quality);
    let total_price = price - total_promo;

    let data = state.data;
    let i = state.data.findIndex((e) => e._id === _id);
    if (i >= 0) {
      data[i] = { _id, menu, quality, note, total_promo, total_price };
    }

    return {
      ...state,
      loading: false,
      data: data,
    };
  }
  if (action.type === DELETE) {
    let data = state.data;
    let newData = data.filter((e) => e._id !== action.payload);

    return {
      ...state,
      loading: false,
      data: newData,
    };
  }
  if (action.type === CLEAN) {
    return {
      ...state,
      loading: false,
      dialog_cart: {
        open: false,
        menu: {},
        id_cart: null,
        quality: 0,
        note: "",
      },
      dialog_payment: {
        open: false,
      },
      data: [],
    };
  }
  if (action.type === SELECTED_ADD) {
    return {
      ...state,
      loading: false,
      selected: {
        ...state.selected,
        bool: true,
        id_cart: null,
        menu: action.payload,
        quality: 0,
        note: "",
      },
    };
  }
  if (action.type === SELECTED_EDIT) {
    const { menu, id_cart, quality, note } = action.payload;
    return {
      ...state,
      loading: false,
      selected: {
        ...state.selected,
        bool: true,
        id_cart,
        menu,
        quality,
        note,
      },
    };
  }
  if (action.type === SELECTED_CLEAN) {
    return {
      ...state,
      loading: false,
      selected: {
        ...state.dialog_cart,
        bool: false,
        id_cart: null,
        menu: {},
        quality: 0,
        note: "",
      },
    };
  }
  if (action.type === SELECTED_INCREMENT_QUALITY) {
    const count = state.selected.quality ? state.selected.quality : 0;
    const quality = count + 1;
    return {
      ...state,
      selected: { ...state.selected, quality },
    };
  }
  if (action.type === SELECTED_DESCREMENT_QUALITY) {
    const count = state.selected.quality ? state.selected.quality : 0;
    const quality = count - 1;
    if (quality >= 0) {
      return {
        ...state,
        selected: { ...state.selected, quality },
      };
    }
  }
  if (action.type === SELECTED_CHANGE_NOTE) {
    return {
      ...state,
      selected: { ...state.selected, note: action.payload },
    };
  }

  if (action.type === DIALOG_MENU_OPEN) {
    return {
      ...state,
      dialog_menu: {
        ...state.dialog_menu,
        open: true,
      },
    };
  }
  if (action.type === DIALOG_MENU_HIDE) {
    return {
      ...state,
      dialog_menu: {
        ...state.dialog_menu,
        open: false,
      },
    };
  }
  if (action.type === DIALOG_PAYMENT_OPEN) {
    return {
      ...state,
      dialog_payment: {
        ...state.dialog_payment,
        open: true,
      },
    };
  }
  if (action.type === DIALOG_PAYMENT_HIDE) {
    return {
      ...state,
      dialog_payment: {
        ...state.dialog_payment,
        open: false,
      },
    };
  }

  return state;
};
export default CartReducer;
