import type { AnyAction } from "redux";
import type { FavoriteAnalysis } from "@bukit-delight/shared";
import { LOADING, MOUNT, SET_FAVORITES } from "../actions/favorites.action";

export type {
  FavoriteAnalysis,
  FavoriteMenuRecord,
} from "@bukit-delight/shared";

export type FavoritesState = {
  mount: boolean;
  loading: boolean;
  data: FavoriteAnalysis | [];
};

const initialState: FavoritesState = {
  mount: false,
  loading: false,
  data: [],
};

const FavoritesReducer = (
  state: FavoritesState = initialState,
  action: AnyAction,
): FavoritesState => {
  if (action.type === MOUNT) return { ...state, mount: true };
  if (action.type === LOADING) {
    return { ...state, loading: action.payload as boolean };
  }
  if (action.type === SET_FAVORITES) {
    return {
      ...state,
      loading: false,
      data: action.payload as FavoriteAnalysis,
    };
  }
  return state;
};

export default FavoritesReducer;
