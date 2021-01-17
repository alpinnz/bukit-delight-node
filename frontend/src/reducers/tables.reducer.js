import {
  MOUNT,
  LOADING,
  SET_TABLES,
  SET_TABLE,
  CLEAN_TABLE,
} from "./../actions/tables.action";

const initialState = {
  mount: false,
  loading: false,
  data: [],
  table: null,
};

const TablesReducer = (state = initialState, action) => {
  if (action.type === MOUNT) {
    return { ...state, mount: true };
  }
  if (action.type === LOADING) {
    return { ...state, loading: action.payload };
  }
  if (action.type === SET_TABLES) {
    return {
      ...state,
      loading: false,
      data: action.payload,
    };
  }

  if (action.type === SET_TABLE) {
    return {
      ...state,
      loading: false,
      table: action.payload,
    };
  }
  if (action.type === CLEAN_TABLE) {
    return {
      ...state,
      loading: false,
      table: null,
    };
  }

  return state;
};
export default TablesReducer;
