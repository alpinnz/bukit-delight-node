const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const schema = new mongoose.Schema({
  id_account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Accounts",
  },
  id_customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customers",
  },
  token: String,
  expires: Date,
  created: { type: Date, default: Date.now },
  createdByIp: String,
  revoked: Date,
  revokedByIp: String,
  replacedByToken: String,
});

schema.virtual("isExpired").get(function () {
  return Date.now() >= this.expires;
});

schema.virtual("isActive").get(function () {
  return !this.revoked && !this.isExpired;
});

schema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    // remove these props when object is serialized
    delete ret._id;
    delete ret.id_account;
    delete ret.id_customer;
  },
});

schema.plugin(uniqueValidator, { type: "mongoose-unique-validator" });

module.exports = mongoose.model("RefreshTokens", schema);
