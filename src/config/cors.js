const cors = require("cors");

exports.Cors = () => {
  app.use(cors());
  app.get("/", function (req, res, next) {
    const {} = req;
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
  });
};
