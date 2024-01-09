const mongoose = require("mongoose");
const CommentSchema = new mongoose.Schema({

  email: {
    require: true,
    type: String,
  },
  message:{
    required:true,
    type:String
  },
 displayName:{
  required:true,
  type:String
 },
 src_id:{
required:true,
type: mongoose.Types.ObjectId,

},
typeOfModel:{
  required:true,
  type:String,
  enum:["post","product"]
},

 published:{
  required:true,
  type:Boolean,
  default:false,
 },
 parentId:{
  type:String,
  default:""
 },
replayCount:{
type:Number,
default:0
},
  viewed: {
    require: true,
    type: Boolean,
    default: false,
  },
  createdAt: {
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
module.exports = mongoose.model("Comment", CommentSchema);
