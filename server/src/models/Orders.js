const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const schema = new mongoose.Schema(
  {

    customer: {
      type: String,
      required: true,
    },
    id_table: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tables",
    },
    note: {
      type: String,

    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'payment']
    },

  },

  {
    timestamps: true,
  }
);

schema.plugin(uniqueValidator, { type: "mongoose-unique-validator" });


module.exports = mongoose.model("Orders", schema);
