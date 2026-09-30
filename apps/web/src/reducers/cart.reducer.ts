import type { AnyAction } from "redux";
import {
  CLEAN,
  CLEAN_ORDER,
  CLEAN_TRANSACTION,
  CREATE,
  DELETE,
  DIALOG_MENU_HIDE,
  DIALOG_MENU_OPEN,
  DIALOG_PAYMENT_HIDE,
  DIALOG_PAYMENT_OPEN,
  LOADING,
  SELECTED_ADD,
  SELECTED_CHANGE_NOTE,
  SELECTED_CLEAN,
  SELECTED_DESCREMENT_QUALITY,
  SELECTED_EDIT,
  SELECTED_INCREMENT_QUALITY,
  SET_DATA,
  SET_ORDER,
  SET_TRANSACTION,
  UPDATE,
} from "../actions/cart.action";

export type CartMenu = {
  price?: string | number;
  promo?: string | number;
  [key: string]: unknown;
};

export type CartItem = {
  id: string;
  menu_id?: string;
  menu: CartMenu;
  note: string;
  quality: number;
  promo?: number;
  total_promo: number;
  total_price: number;
};

export type CartSelection = {
  bool: boolean;
  menu: CartMenu;
  id_cart: string | null;
  quality: number;
  note: string;
};

export type CartState = {
  loading: boolean;
  selected: CartSelection;
  order: unknown | null;
  transaction: unknown | null;
  dialog_menu: { open: boolean };
  dialog_payment: { open: boolean };
  dialog_cart?: {
    open: boolean;
    menu: CartMenu;
    id_cart: string | null;
    quality: number;
    note: string;
  };
  data: CartItem[];
};

const initialState: CartState = {
  loading: false,
  selected: { bool: false, menu: {}, id_cart: null, quality: 0, note: "" },
  order: null,
  transaction: null,
  dialog_menu: { open: false },
  dialog_payment: { open: false },
  data: [],
};

const calculateCartTotals = (menu: CartMenu, quality: number) => {
  const price = Number(quality) * Number(menu.price);
  const promo = menu.promo ? Number(menu.promo) : 0;
  const total_promo = promo * Number(quality);
  return { total_promo, total_price: price - total_promo };
};

const CartReducer = (
  state: CartState = initialState,
  action: AnyAction,
): CartState => {
  if (action.type === SET_TRANSACTION) {
    return { ...state, transaction: action.payload as unknown };
  }
  if (action.type === CLEAN_TRANSACTION) {
    return { ...state, transaction: null };
  }
  if (action.type === SET_ORDER) {
    return { ...state, order: action.payload as unknown };
  }
  if (action.type === CLEAN_ORDER) {
    return { ...state, order: null };
  }
  if (action.type === LOADING) {
    return { ...state, loading: action.payload as boolean };
  }
  if (action.type === SET_DATA) {
    return { ...state, data: action.payload as CartItem[] };
  }
  if (action.type === CREATE) {
    const { menu, quality, note } = action.payload as {
      menu: CartMenu;
      quality: number;
      note?: string;
    };
    const id = new Date().getTime().toString();
    return {
      ...state,
      loading: false,
      data: [
        ...state.data,
        {
          id,
          menu,
          note: note ?? "",
          quality,
          ...calculateCartTotals(menu, quality),
        },
      ],
    };
  }
  if (action.type === UPDATE) {
    const { id, menu, quality, note } = action.payload as {
      id: string;
      menu: CartMenu;
      quality: number;
      note?: string;
    };
    const updatedItem: CartItem = {
      id,
      menu,
      quality,
      note: note ?? "",
      ...calculateCartTotals(menu, quality),
    };
    return {
      ...state,
      loading: false,
      data: state.data.map((item) => (item.id === id ? updatedItem : item)),
    };
  }
  if (action.type === DELETE) {
    return {
      ...state,
      loading: false,
      data: state.data.filter((item) => item.id !== action.payload),
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
      dialog_payment: { open: false },
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
        menu: action.payload as CartMenu,
        quality: 0,
        note: "",
      },
    };
  }
  if (action.type === SELECTED_EDIT) {
    const { menu, id_cart, quality, note } = action.payload as {
      menu: CartMenu;
      id_cart: string | null | undefined;
      quality: number;
      note?: string;
    };
    return {
      ...state,
      loading: false,
      selected: {
        ...state.selected,
        bool: true,
        id_cart: id_cart ?? null,
        menu,
        quality,
        note: note ?? "",
      },
    };
  }
  if (action.type === SELECTED_CLEAN) {
    return {
      ...state,
      loading: false,
      selected: {
        ...state.selected,
        bool: false,
        id_cart: null,
        menu: {},
        quality: 0,
        note: "",
      },
    };
  }
  if (action.type === SELECTED_INCREMENT_QUALITY) {
    return {
      ...state,
      selected: { ...state.selected, quality: state.selected.quality + 1 },
    };
  }
  if (action.type === SELECTED_DESCREMENT_QUALITY) {
    if (state.selected.quality <= 0) return state;
    return {
      ...state,
      selected: { ...state.selected, quality: state.selected.quality - 1 },
    };
  }
  if (action.type === SELECTED_CHANGE_NOTE) {
    return {
      ...state,
      selected: { ...state.selected, note: action.payload as string },
    };
  }
  if (action.type === DIALOG_MENU_OPEN) {
    return { ...state, dialog_menu: { open: true } };
  }
  if (action.type === DIALOG_MENU_HIDE) {
    return { ...state, dialog_menu: { open: false } };
  }
  if (action.type === DIALOG_PAYMENT_OPEN) {
    return { ...state, dialog_payment: { open: true } };
  }
  if (action.type === DIALOG_PAYMENT_HIDE) {
    return { ...state, dialog_payment: { open: false } };
  }
  return state;
};

export default CartReducer;
