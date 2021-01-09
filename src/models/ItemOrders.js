const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const schema = new mongoose.Schema(
  {
    id_order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Orders",
      required: true,
    },
    id_menu: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Menus",
      required: true,
    },
    quality: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    note: {
      type: String,
      required: true,
    },
  },

  {
    timestamps: true,
  }
);

schema.plugin(uniqueValidator, { type: "mongoose-unique-validator" });


module.exports = mongoose.model("ItemOrders", schema);
