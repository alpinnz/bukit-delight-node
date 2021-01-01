export const UPDATE = (tables) => {
  return {
    type: "Tables/UPDATE",
    payload: tables,
  };
};

const TablesAction = {
  UPDATE,
};
export default TablesAction;
