const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const schema = new mongoose.Schema(
  {
    id_account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Accounts",
      required: true,
    },
    id_order: {
      type: mongoose.Schema.Types.ObjectId,
      unique: true,
      ref: "Orders",
      required: true,
    },
    note: {
      type: String,
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "proses", "done"],
    },
  },
  {
    timestamps: true,
  }
);

schema.plugin(uniqueValidator, { type: "mongoose-unique-validator" });

module.exports = mongoose.model("Transactions", schema);
