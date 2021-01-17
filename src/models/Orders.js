const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const schema = new mongoose.Schema(
  {
    id_customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customers",
    },
    id_table: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tables",
    },
    quality: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    promo: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    total_price: {
      type: Number,
      required: true,
    },
    note: {
      type: String,
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "cash", "virtual"],
    },
    estimasi: {
      type: Date,
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
  },

  {
    timestamps: true,
  }
);

schema.plugin(uniqueValidator, { type: "mongoose-unique-validator" });

schema.virtual("isExpired").get(function () {
  return (
    Date.now() >= this.expires ||
    this.status === "cash" ||
    this.status === "virtual"
  );
});

schema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    // remove these props when object is serialized
    delete ret.id;
    // delete ret.id_account;
    // delete ret.id_customer;
  },
});

module.exports = mongoose.model("Orders", schema);
