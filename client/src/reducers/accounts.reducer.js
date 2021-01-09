import { LOADING, SET_ACCOUNTS } from "./../actions/accounts.action";

const initialState = {
  loading: false,
  data: [],
};

const AccountsReducer = (state = initialState, action) => {
  if (action.type === LOADING) {
    return { ...state, loading: action.payload };
  }
  if (action.type === SET_ACCOUNTS) {
    const data = action.payload.map((e) => {
      if (e.id_role) {
        e["role_id"] = e["id_role"]["_id"];
        e["role_name"] = e["id_role"]["name"];
      }
      e["password"] = "******";
      return e;
    });
    return {
      ...state,
      loading: false,
      data: data,
    };
  }

  return state;
};
export default AccountsReducer;
