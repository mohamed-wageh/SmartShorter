const mongoose = require("mongoose");

const shortLinkSchema = new mongoose.Schema({
  slug: {
    type: String,
    unique: true,
    required: true,
  },
  ios: {
    primary: {
      type: String,
      required: true,
    },
    fallback: {
      type: String,
      required: true,
    },
  },
  android: {
    primary: {
      type: String,
      required: true,
    },
    fallback: {
      type: String,
      required: true,
    },
  },
  web: String,
});

module.exports = mongoose.model("ShortLink", shortLinkSchema);
