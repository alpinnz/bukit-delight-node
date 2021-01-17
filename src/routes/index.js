const Router = require("express").Router();
// Router v1
const v1 = require("./v1");
Router.use("/api/v1", v1);

Router.get("/", (req, res) => {
  req.app.io.emit("FromAPI", "test");
  res.json("index");
});

// Not Path
// Router.use((req, res, next) => {
//   const err = new Error("Not Path");
//   err.status = 404;
//   next(err);
// });

module.exports = Router;
