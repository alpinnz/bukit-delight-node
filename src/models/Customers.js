const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const schema = new mongoose.Schema(
  {
    username: {
      type: String,
      // trim: true,
      required: true,
    },
    // mac: {
    //   type: String,
    //   trim: true,
    //   required: true,
    //   unique: true,
    //   lowercase: true,
    // },
    // password: {
    //   type: String,
    //   required: true,
    // },
  },
  {
    timestamps: true,
  }
);

// schema.plugin(uniqueValidator, { type: "mongoose-unique-validator" });

module.exports = mongoose.model("Customers", schema);
