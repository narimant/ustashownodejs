const mongoose = require("mongoose");
const PostSchema = new mongoose.Schema({
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
  body: {
    required: true,
    type: String,
  },
  tags: {
    required: true,
    type: Array,
    default:[]
  },
  relatedPosts: {

    type: Array,
    default:[]
  },
  comments: {

    type: Array,
    default:[]
  },
  type: {
 
    type: String,
   default:"post"
  },
  pageView: {
    required: true,
    type: Number,
    default:0
  },
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
module.exports = mongoose.model("Post", PostSchema);
