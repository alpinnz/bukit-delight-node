const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

schema.plugin(uniqueValidator, { type: "mongoose-unique-validator" });

module.exports = mongoose.model("Roles", schema);
