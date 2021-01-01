const initialState = {
  data: [],
  form: {
    open: false,
    type: "",
    validate: false,
    data: [
      {
        name: {
          value: "",
          error: "",
        },
        desc: {
          value: "",
          error: "",
        },
        image: {
          value: "",
          error: "",
        },
      },
    ],
  },
};

const MenusReducer = (state = initialState, action) => {
  if (action.type === "Menus/UPDATE") {
    const result = action.payload.map((e) => {
      e["name_categories"] = e["id_category"]["name"];
      e["_id_categories"] = e["id_category"]["_id"];
      return e;
    });
    return { ...state, data: result };
  }
  return state;
};
export default MenusReducer;
