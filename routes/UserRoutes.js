const express = require("express");
const router = express();
const UserController = require("../controllers/UserController");
const Use = require("../models/User");
const { check } = require("express-validator");
const User = require("../models/User");
const userExist = require("../middlewares/userExist");
const isAdmin=require('../middlewares/isAdmin')
const ratelimit=require('express-rate-limit')
const limiter=ratelimit({
  windowMs:15*60*1000,
  max:5,
  statusCode:200,
  handler:function(req,res){
    res.status(429).json({msg:"کاربر گرامی به دلیل درخواستهای متعدد IP شما به مدت 15 دقیقه مسدود شده است"})
  }
})
router.post(
  "/user-login",  limiter,
  [
    check("email", " فرمت ایمیل درست نیست  ").isEmail(),
    check("password","  تعداد کاراکتر نام نمایشی بین 8 و 20 کاراکتر باید باشد").isLength({ min: 8, max: 20 }),
  ],
UserController.loginUesr
);

router.get("/users", UserController.getAllUsers);
router.post(
  "/new-user",
  [
    check(
      "displayName",
      "  تعداد کاراکتر نام نمایشی بین 8 و 20 کاراکتر باید باشد"
    ).isLength({ min: 8, max: 20 }),
    check("email", "لطفا ایمیل دیگری انتخاب کنید").custom(async (value) => {
      return User.find({ email: value }).then((email) => {
        if (email.length > 1) {
          throw "لطف ایمیل دیگری را انتخاب کنید...";
        }
      });
    }),
    check(
      "password",
      "  تعداد کاراکتر نام نمایشی بین 8 و 20 کاراکتر باید باشد"
    ).isLength({ min: 8, max: 20 }),
    check("email", " فرمت ایمیل درست نیست  ").isEmail(),
  ],
  UserController.registerUser
);
router.delete("/delete-user/:id",isAdmin, UserController.Deleteuser);
router.patch(
  "/update-mini-user/:id",
  [
    check(
      "displayName",
      "  تعداد کاراکتر نام نمایشی بین 8 و 20 کاراکتر باید باشد"
    ).isLength({ min: 8, max: 20 }),

    check(
      "password",
      "  تعداد پسورد واردشده  بین 8 و 20 کاراکتر باید باشد"
    ).isLength({ min: 8, max: 20 }),
  ],
  UserController.UpdateMiniUser
);
router.patch(
  "/update-user/:id",
  [
    check(

      "displayName",
      "  تعداد کاراکتر نام نمایشی بین 6 و 20 کاراکتر باید باشد"
    ).isLength({ min: 6, max: 20 }),
    check("email", "لطفا ایمیل دیگری انتخاب کنید").custom((value) => {
      return Use.find({ email: value }).then((email) => {
        if (email.length > 1) {
          throw "لطف ایمیل دیگری را انتخاب کنید...";
        }
      });
    })
    ,check("email", " فرمت ایمیل درست نیست  ").isEmail(),
  ],
  UserController.Updateuser
);
//for user
router.get("/get-user-data", userExist, UserController.getUserDataAccount);
router.get("/get-user-admin-data", isAdmin, UserController.getUserAdminData);
router.get(
  "/get-part-of-user-data/:slug",
  userExist,
  UserController.getUserPartOfData
);
//for admin
router.get("/get-user/:id",isAdmin, UserController.getOneUserById);
router.get(
  "/search-users",
  [check("email", "فرمت ایمیل اشتباه است").isEmail()],
  UserController.searchUsers
);
router.post(
  "/favorite-products",
  userExist,
  UserController.favoriteProductManager
);

router.post(
  "/cart-manager",
  userExist,
  UserController.cartManager
);

router.get(
  "/cart-number",
  UserController.cartNumber
);
module.exports = router;
