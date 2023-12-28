const mongoose = require("mongoose");
const Product = require("./Product");
const CategorySchema = new mongoose.Schema({
  title: {
    required: true,
    type: String,
  },
  slug: {
    required: true,
    type: String,
  },
  image: {
    required: true,
    type: String,
  },
  imageAlt: {
    required: true,
    type: String,
  },
  shortDesc: {
    required: true,
    type: String,
  },
  situation: {
    required: true,
    type: Boolean,
  },
// product:[{
//   type:mongoose.Schema.Types.ObjectId,
//   ref:"Product"
// }],
  date: {
    type: String,
    default: new Date().toLocaleDateString("fa-IR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  },
  UpdateDate: {
    type: String,
    default: new Date().toLocaleDateString("fa-IR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  },
});
module.exports = mongoose.model("Category", CategorySchema);
