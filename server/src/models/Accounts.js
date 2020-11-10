const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const schema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    activateLink: {
      data: String,
      default: "",
    },
    resetLink: {
      data: String,
      default: "",
    },
    id_role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Roles",
    },
  },
  {
    timestamps: true,
  }
);

schema.plugin(uniqueValidator, { type: "mongoose-unique-validator" });

module.exports = mongoose.model("Accounts", schema);
