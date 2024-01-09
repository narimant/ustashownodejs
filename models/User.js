const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  displayName: {
    type: String,
    require: true,
  
  },
  email: {
    require: true,
    type: String,
    unique: true,
  },
  password: {
    required: true,
    type: String,
  },
  favoriteProducts:[
    {
    type: mongoose.Schema.Types.ObjectId,
    ref:"Product"
    }
  ],
  userProducts: {
    required: true,
    type: [],
    default: [],
  },
  // comments: {
  //   required: true,
  //   type: [],
  //   default: [],
  // },
  payments: {
    required: true,
    type: [],
    default: [],
  },
  cart: [
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
  activeCOde: {
    require: true,
    type: Number,
  },
  userIsActive: {
    required: true,
    type: Boolean,
    default: false,
  },
  emailSend: {
    required: true,
    type: Boolean,
    default: true,
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
module.exports = mongoose.model("User", UserSchema);
