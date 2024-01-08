const mongoose = require("mongoose");
const PaymentSchema = new mongoose.Schema({

  email: {
    require: true,
    type: String,
  },
  resnumber:{
    required:true,
    type:String
  },
 amount:{
  required:true,
  type:Number
 },
 payed:{
  required:true,
  type:Boolean,
  default:false
},
  userProducts:[
    {
    type: mongoose.Schema.Types.ObjectId,
    ref:"Product"
    }
  ],

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
module.exports = mongoose.model("Payment", PaymentSchema);
