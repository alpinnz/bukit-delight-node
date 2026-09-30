import type { AnyAction } from "redux";
import type { ThunkAction } from "redux-thunk";
import type { CartItem, CartMenu } from "../reducers/cart.reducer";
import type { MenuRecord } from "../reducers/menus.reducer";

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

type CartThunk = ThunkAction<void, unknown, unknown, AnyAction>;
type CartMountState = {
  Menus: { data: MenuRecord[] };
  Cart: {
    data: Array<{
      id: string;
      menu_id: string;
      quality: number | string;
      note?: string;
    }>;
  };
};

const onMount = (): CartThunk => {
  return (dispatch, getState) => {
    dispatch(onLoading(true));
    const { Menus, Cart } = getState() as CartMountState;
    const data: CartItem[] = Cart.data.flatMap((item) => {
      const menu = Menus.data.find(({ id }) => `${id}` === `${item.menu_id}`);
      if (!menu) return [];

      const quality = Number(item.quality);
      const promo = menu.promo ? Number(menu.promo) : 0;
      const total_price = quality * Number(menu.price);
      const total_promo = promo * quality;
      return [
        {
          id: item.id,
          menu_id: item.menu_id,
          menu,
          quality,
          note: item.note ?? "",
          promo,
          total_promo,
          total_price: total_price - total_promo,
        },
      ];
    });
    dispatch(setData(data));
    dispatch(onLoading(false));
  };
};

const setOrder = (order: unknown) => ({ type: SET_ORDER, payload: order });
const cleanOrder = () => ({ type: CLEAN_ORDER });
const setTransaction = (transaction: unknown) => ({
  type: SET_TRANSACTION,
  payload: transaction,
});
const cleanTransaction = () => ({ type: CLEAN_TRANSACTION });
const setData = (data: CartItem[]) => ({ type: SET_DATA, payload: data });

const onCreate = (menu: CartMenu, quality: number, note: string) => ({
  type: CREATE,
  payload: { menu, quality, note },
});
const onUpdate = (
  menu: CartMenu,
  id: string,
  quality: number,
  note: string,
) => ({ type: UPDATE, payload: { menu, id: id, quality, note } });
const onDelete = (id: string) => ({ type: DELETE, payload: id });
const onClean = () => ({ type: CLEAN });
const onLoading = (isLoading: boolean) => ({
  type: LOADING,
  payload: isLoading,
});

const dialogMenuOpen = () => ({ type: DIALOG_MENU_OPEN });
const dialogMenuHide = () => ({ type: DIALOG_MENU_HIDE });
const dialogPaymentOpen = () => ({ type: DIALOG_PAYMENT_OPEN });
const dialogPaymentHide = () => ({ type: DIALOG_PAYMENT_HIDE });

const selectedAdd = (menu: CartMenu) => ({
  type: SELECTED_ADD,
  payload: menu,
});
const selectedEdit = (
  menu: CartMenu,
  id_cart: string | null | undefined,
  quality: number,
  note: string | undefined,
) => ({ type: SELECTED_EDIT, payload: { menu, id_cart, quality, note } });
const selectedClean = () => ({ type: SELECTED_CLEAN });
const selectedIncrementQuality = () => ({
  type: SELECTED_INCREMENT_QUALITY,
});
const selectedDescrementQuality = () => ({
  type: SELECTED_DESCREMENT_QUALITY,
});
const selectedChangeNote = (note: string) => ({
  type: SELECTED_CHANGE_NOTE,
  payload: note,
});

const CartAction = {
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

export default CartAction;
