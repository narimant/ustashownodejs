const { validationResult } = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const Comment = require("../models/Comment");
const Post = require("../models/Post");
const Product = require("../models/Product");
const getAllUsers = async (req, res) => {
  try {
    if (req.query.pn) {
      const paginate = 10;
      const pageNumber = req.query.pn;
      const GolUsers = await User.find()
        .sort({ _id: -1 })
        .select({
          email: 1,
          displayName: 1,
          userIsActive: 1,
          viewed: 1,
          createdAt: 1,
        })
        .skip((pageNumber - 1) * paginate)
        .limit(paginate);
      const AllUsersNum = await User.find();
      res.status(200).json({ GolUsers, AllUsersNum });
    } else {
      const AllUsers = await User.find();
      res.status(200).json(AllUsers);
    }
  } catch (error) {
    res.status(400).json({ msg: "error" });
  }
};

const getUserPartOfData = async (req, res) => {
  try {
    const theSlug = req.params.slug;
    if (theSlug == "info") {
      const goalUser = await User.findById(req.user._id).select({
        displayName: 1,
        email: 1,
        createdAt: 1,
        updatedAt: 1,
      });
      res.status(200).json(goalUser);
    } else if (theSlug == "favorite") {
      const goalUser = await User.findById(req.user._id)
        .select({
          favoriteProducts: 1,
        })
        .populate({
          path: "favoriteProducts",
          populate: { path: "categories", model: "Category" },
        });

      res.status(200).json(goalUser);
    } else if (theSlug == "cart") {
      const goalUser = await User.findById(req.user._id)
        .select({
          cart: 1,
        })
        .populate({
          path: "cart",
          populate: { path: "categories", model: "Category" },
        });

      res.status(200).json(goalUser);
    } else if (theSlug == "files") {
      const goalUser = await User.findById(req.user._id).select({
        userProducts: 1,
      });
      res.status(200).json(goalUser);
    } else if (theSlug == "comments") {
      const goalUser = await User.findById(req.user._id);
      const userComments=await Comment.find({email:goalUser.email}).sort({_id:-1})
      let PostProduct={};
      const fullDataUserComment=[];
      for (let index = 0; index < userComments.length; index++) {
        if(userComments[index].typeOfModel=="post"){
          PostProduct =await Post.findById(userComments[index].src_id).select({title:1,slug:1})
        }else{
          PostProduct =await Product.findById(userComments[index].src_id).select({title:1,slug:1})  
        }
       const newCommentData={
        createdAt:userComments[index].createdAt,
        published:userComments[index].published,
        typeOfModel:userComments[index].typeOfModel,
        message:userComments[index].message,
        src_id:userComments[index].src_id,
        src:PostProduct,
       
       } 
       fullDataUserComment.push(newCommentData);
      }
  
      
      res.status(200).json(fullDataUserComment);
    } else if (theSlug == "payments") {
      const goalUser = await User.findById(req.user._id).select({
        payments: 1,
      });
      res.status(200).json(goalUser);
    } else {
      res.status(200).json({ msg: "عدم تاعیین بخش مورد نیاز" });
    }
  } catch (error) {
    res.status(400).json(error);
  }
};
//registere
const registerUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ msg: errors.errors[0].msg });
    } else {
      //زCHECK CONFRIM PASWORD

      if (req.body.password === req.body.rePassword) {
        //CHECK EMAIL EXIST
        const emailExist = await User.find({ email: req.body.email });
        if (emailExist.length < 1) {
          //MAKING USER

          const data = req.body;

          data.displayName = req.body.displayName.toLowerCase();
          data.email = req.body.email;

          const hashedPassword = await bcrypt.hash(req.body.password, 10);
          data.password = hashedPassword;
          const userActiveCode = Math.floor(
            Math.random() * 90000000 + 10000000
          );
          const newUser = new User({
            displayName: data.displayName,
            password: hashedPassword,
            email: data.email,
            activeCOde: userActiveCode,
          });

          newUser
            .save()
            .then((data) => {
              //making auth cookie
              const token = jwt.sign(
                { _id: newUser._id, email: newUser.email },
                process.env.TOKEN_SECRET
              );
              const MAIL_HOST = process.env.MAIL_HOST;
              const MAIL_PORT = process.env.MAIL_PORT;
              const MAIL_USER = process.env.MAIL_USER;
              const MAIL_PASSWORD = process.env.MAIL_PASSWORD;
              const MAIL_MAIN_ADDRESS = process.env.MAIL_MAIN_ADDRESS;

              const transporter = nodemailer.createTransport({
                host: MAIL_HOST,
                port: MAIL_PORT,
                tls: true,
                auth: {
                  user: MAIL_USER,
                  pass: MAIL_PASSWORD,
                },
              });
              transporter
                .sendMail({
                  from: MAIL_MAIN_ADDRESS,
                  to: newUser.email,
                  subject: "احراز هویت فروشگاه اوستاشو",
                  html: `<html><head></head><body><h1>احراز هویت اوستاشو</h1><div>کد احراز هویت :<strong>${userActiveCode}</strong></div></body></html>`,
                })
                .then((data) => {
                  res
                    .status(200)
                    .json({ msg: "ثبت نام موفقیت آمیز بود", auth: token });
                })
                .catch((error) => {
                  console.log(error);
                  res.status(400).json(error);
                });

              //email to user acount
            })
            .catch((error) => console.log(error));
        } else {
          res.status(422).json({ msg: "لطفا ایمیل دیگری وارد کنید" });
        }
      } else {
        res
          .status(422)
          .json({ msg: "دو رمز عبور وارد شده باهم مطابقت ندارند" });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "خطا در زخیره بنر" });
  }
};

//login user
const loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ msg: errors.errors[0].msg });
  } else {
    //CHECK EMAIL EXIST
    const emailExist = await User.find({ email: req.body.email });
    if (emailExist.length > 0) {
      const data = req.body;
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const validPassword = await bcrypt.compare(
        req.body.password,
        emailExist[0].password
      );

      if (validPassword) {
        const token = jwt.sign(
          { _id: emailExist[0]._id, email: emailExist[0].email },
          process.env.TOKEN_SECRET
        );
        res.status(200).json({ msg: "با مفقیت وارد شدید", auth: token });
      } else {
        res.status(400).json({ msg: "نام کاربری یا رمز عبور اشتباه است" });
      }
    } else {
      res.status(400).json({ msg: "acount not found" });
    }
  }
};

const UpdateMiniUser = async (req, res) => {
  try {
    //express validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ msg: errors.errors[0].msg });
    } else {
      if (!req.body.displayName || !req.body.password) {
        res.status(400).json({ msg: "خطا در اطلاعات ارسالی" });
      } else {
        const data = req.body;

        data.displayName = req.body.displayName;
        updatedAt = new Date().toLocaleDateString("fa-IR", {
          hour: "2-digit",
          minute: "2-digit",
        });
        const findUser = await User.findById(req.params.id);

        const validPassword = await bcrypt.compare(
          req.body.password,
          findUser.password
        );

        if (validPassword) {
          await User.findByIdAndUpdate(
            req.params.id,
            { displayName: req.body.displayName, updatedAt: updatedAt },
            { new: true }
          );

          res.status(200).json({ msg: "کاربر با موفقیت بروز رسانی شد" });
        } else {
          res.status(400).json({ msg: "پسور وارد شده صحیح نیست" });
        }
      }
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "خطا در زخیره کاربر", error });
  }
};

const UpdateUser = async (req, res) => {
  try {
    //express validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ msg: errors.errors[0].msg });
    } else {
      const data = req.body;
      data.displayName = req.body.displayName.toLowerCase();

      await User.findByIdAndUpdate(req.params.id, data, { new: true });

      res.status(200).json({ msg: "کاربر با موفقیت بروز رسانی شد" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "خطا در زخیره کاربر" });
  }
};

const DeleteUser = async (req, res) => {
  try {
    await User.findByIdAndRemove(req.params.id);

    res.status(200).json({ msg: "کاربر با موفقیت  حذف شد" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "خطا در حذف کاربر" });
  }
};

const getOneUserById = async (req, res) => {
  try {
    const goalUser = await User.findById(req.params.id)
      .select({ password: false })
      .populate({
        path: "favoriteProducts",
        populate: {
          path: "categories",
          model: "Category",
        },
        path: "cart",
        populate: {
          path: "categories",
          model: "Category",
        },
      });
    res.status(200).json(goalUser);
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: error });
  }
};

const getUserDataAccount = async (req, res) => {
  try {
    const goalUser = await User.findById(req.user._id)
      .select({
        password: false,
      })
      .populate("favoriteProducts")
      .populate("cart");
    res.status(200).json(goalUser);
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: error });
  }
};

const searchUsers = async (req, res) => {
  try {
    const theUser = await User.find({ email: req.body.email });
    if (theUser.length > 0) {
      res.status(200).json({ userData: theUser[0] });
    } else {
      res.status(200).json({ userData: 0 });
    }
  } catch (error) {
    res.status(400).json(error);
  }
};

const favoriteProductManager = async (req, res) => {
  try {
    const theUser = await User.findById(req.user._id);

    if (req.body.method === "push") {
      const newUerFavoriteProducts = [
        ...theUser.favoriteProducts,
        req.body.productId,
      ];
      const newUser = {
        favoriteProducts: newUerFavoriteProducts,
      };
      await User.findByIdAndUpdate(req.user._id, newUser, {
        new: true,
      });
      res.status(200).json({ msg: "به محصولات مورد علاقه اضافه شد" });
    } else if (req.body.method === "remove") {
      const oldFavProducts = theUser.favoriteProducts;
      const pro = oldFavProducts.filter(
        (item) => String(item._id) !== req.body.productId
      );

      const newUser = {
        favoriteProducts: pro,
      };
      console.log(pro);
      await User.findByIdAndUpdate(req.user._id, newUser, {
        new: true,
      });
      res.status(200).json({ msg: "محصول مورد نظر از علایق شما حذف شد" });
    } else {
      res.status(401).json({ msg: "خطا در اطلاعات ارسالی" });
    }
  } catch (error) {}
};

const cartManager = async (req, res) => {
  try {
    const theUser = await User.findById(req.user._id);

    if (req.body.method === "push") {
      const newUerCartProducts = [...theUser.cart, req.body.productId];
      const newUser = {
        cart: newUerCartProducts,
      };
      await User.findByIdAndUpdate(req.user._id, newUser, {
        new: true,
      });
      res.status(200).json({ msg: "به محصولات مورد علاقه اضافه شد" });
    } else if (req.body.method === "remove") {
      const oldCartProducts = theUser.cart;
      const pro = oldCartProducts.filter(
        (item) => String(item._id) !== req.body.productId
      );

      const newUser = {
        cart: pro,
      };
      console.log(pro);
      await User.findByIdAndUpdate(req.user._id, newUser, {
        new: true,
      });
      res.status(200).json({ msg: "محصول از سبد حذف شد" });
    } else {
      res.status(401).json({ msg: "خطا در اطلاعات ارسالی" });
    }
  } catch (error) {
    res.status(400).json * error();
  }
};
const cartNumber = async (req, res) => {
  try {
    let token = req.cookies.auth;

    if (!token) {
      token = req.headers.auth;

    }
    if (!token) {
       
      res.status(200).json({ number: 0 });
    } else {
      
      try {
        const verrifyed = jwt.verify(token, process.env.TOKEN_SECRET);
        
        const theUser = verrifyed;
      const goalUser=await User.findById(verrifyed._id).select({cart:1})
   
      res.status(200).json({ number: goalUser.cart.length });
      } catch (error) {
        console.log(error);
        res.status(200).json({ number: 0 });
      }
    }
  } catch (error) {}
};

module.exports.getAllUsers = getAllUsers;
module.exports.registerUser = registerUser;
module.exports.Deleteuser = DeleteUser;
module.exports.Updateuser = UpdateUser;
module.exports.UpdateMiniUser = UpdateMiniUser;
module.exports.getOneUserById = getOneUserById;
module.exports.searchUsers = searchUsers;
module.exports.loginUesr = loginUser;
module.exports.getUserDataAccount = getUserDataAccount;
module.exports.getUserPartOfData = getUserPartOfData;
module.exports.favoriteProductManager = favoriteProductManager;
module.exports.cartManager = cartManager;
module.exports.cartNumber = cartNumber;
