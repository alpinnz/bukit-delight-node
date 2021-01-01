const initialState = {
  data: [],
};

const AcctionsReducer = (state = initialState, action) => {
  if (action.type === "Accounts/UPDATE") {
    const result = action.payload.map((e) => {
      e["name_roles"] = e["id_role"]["name"];
      e["_id_roles"] = e["id_role"]["_id"];
      e["password"] = "********";
      return e;
    });
    return { ...state, data: result };
  }

  return state;
};
export default AcctionsReducer;
