const mongoose = require("mongoose");
const Category = require("./Category");
const ProductSchema = new mongoose.Schema({
  title: {
    required: true,
    type: String,
  },
  seoTitle: {
    
    type: String,
  },
  seoDescription: {
   
    type: String,
  },
  slug: {
    required: true,
    type: String,
    unique:true
  },
  mainFile:{
    required:true,
    type:String
  },
  image: {
    required: true,
    type: String,
  },
  imageAlt: {
    required: true,
    type: String,
  },
  price: {
    required: true,
    type: String,
  },
  shortDesc: {
    required: true,
    type: String,
  },
  body: {
    required: true,
    type: String,
  },
  tags: {
    required: true,
    type: Array,
    default:[]
  },
  relatedProducts: {

    type: Array,
    default:[]
  },
  comments: {

    type: Array,
    default:[]
  },
  typeOfProduct: {
 
    type: String,

  },
  pageView: {
    required: true,
    type: Number,
    default:0
  },
  buyNumber: {
    required: true,
    type: Number,
    default:0
  },
  features: {
    required: true,
    type: Array,
    default:[]
  },
  categories: [ {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref:"Category"
  }],
  published: {
    required: true,
    type: Boolean,
    default:false
  },

  date: {
    type: String,
    default: new Date().toLocaleDateString("fa-IR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  },
  updatedAt: {
    type: String,
    default: new Date().toLocaleDateString("fa-IR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  },
});
module.exports = mongoose.model("Product", ProductSchema);
