const { validationResult } = require("express-validator");
const PaymentController = require("../models/Payment");
const Payment = require("../models/Payment");
const axios = require("axios");
const User = require("../models/User");
const Product = require("../models/Product");

const getAllPayments = async (req, res) => {
  try {
    if (req.query.pn) {
      const paginate = 10;
      const pageNumber = req.query.pn;
      const GolPayments = await Payment.find()
        .sort({ _id: -1 })
        .select({ resnumber: false })
        .skip((pageNumber - 1) * paginate)
        .limit(paginate);
      const AllPaymentsNum = await Payment.find();
      res.status(200).json({ GolPayments, AllPaymentsNum });
    } else {
      const AllPayments = await Payment.find();
      res.status(200).json(AllPayments);
    }
  } catch (error) {
    res.status(400).json({ msg: "error" });
  }
};

const UpdatePayment = async (req, res) => {
  try {
    //express validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ msg: errors.errors[0].msg });
    } else {
      const data = req.body;

      await Payment.findByIdAndUpdate(req.params.id, data, { new: true });

      res.status(200).json({ msg: "پرداخت با موفقیت بروز رسانی شد" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "خطا در زخیره پرداخت" });
  }
};

const DeletePayment = async (req, res) => {
  try {
    await Payment.findByIdAndRemove(req.params.id);

    res.status(200).json({ msg: "پرداخت با موفقیت  حذف شد" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "خطا در حذف پرداخت" });
  }
};



const getOnePaymentById = async (req, res) => {
  try {
    const goalPayment = await Payment.findById(req.params.id).populate(
      "products"
    );
    res.status(200).json(goalPayment);
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: error });
  }
};



const paymentResulCheck = async (req, res) => {
  try {
    const thePayment = await Payment.findOne({ resnumber: req.body.resnumber });

    if (!thePayment) {
      res.status(401).json({ msg: "پرداخت یافت نشد" });
      return;
    }

    let params = {
      merchant_id: process.env.MERCHANT_CODE,
      amount: thePayment.amount,
      description: "فروشگاه فایل اوستاشو",
      authority: req.body.resnumber,
    };
    const response = await axios.post(
      "https://sandbox.zarinpal.com/pg/v4/payment/verify.json",
      params
    );

    if (response.data.data.code == 100) {
      const theUser = await User.findById(req.user._id);
      const newData = {};

      //lvl 1 add products to user products
      console.log(theUser.cart);
      const userOldProducts = theUser.userProdusts;
      const userCart = theUser.cart;
      const userNewProducts = [...userOldProducts, ...userCart];
      newData.useProducts = userNewProducts;

      //lvl2 empty cart
      newData.cart = [];

      const userOldPayments=theUser.payments;
      const thisPayment=[thePayment._id];
      const userNewPayments=[...userOldPayments,thisPayment];
      newData.payments=userNewPayments;

      //update user
      await User.findByIdAndUpdate(req.user._id, newData, { new: true });


      //lvl 3:adding one to product buyNumber
      for (let index = 0; index < userCart.length; index++) {
        const theProduct = await Product.findById(userCart[i]);
        const newProduct = {
          buyNumber: theProduct.buyNumber + 1,
        };
        await Product.findByIdAndUpdate(userCart[index], newData, {
          new: true,
        });
      }

      // lvl 4:updating the payment
      const newPaymentData = {
        payed: true,
        viewed: false,
        updatedAt: new Date().toLocaleDateString("fa-IR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      await Payment.findByIdAndUpdate(thePayment._id, newPaymentData, {
        new: true,
      });

      res.status(200).json({msg:"به امید موفقیت هز چه بیشتر"})
    } else {
      res.status(401).json({ msg: "پراخت اجام نشده است" });
    }
  } catch (error) {}
};

const newPayment = async (req, res) => {
  try {
  
    const theUser = await User.findById(req.user._id);

    if (!theUser) {
      res.status(401).json({ msg: "کاربر یافت نشد" });
      return;
    }

    if (req.body.amount && req.body.amount > 0) {
      let params = {
        merchant_id: process.env.MERCHANT_CODE,
        amount: req.body.amount,
        description: "فروشگاه فایل اوستاشو",
        callback_url: "http://localhost:3000/payment-result",
        metadata: {
          email: theUser.email,
        },
      };

      const response = await axios.post(
        "https://api.zarinpal.com/pg/v4/payment/request.json",
        params
      );

      if (response.data.data.code == 100) {
        const newPayment = {
          email: theUser.email,
          resnumber: response.data.data.authority,
          amount: req.body.amount,
          payed: false,
          userProducts: req.body.products,
          viewes: false,
          createdAt: new Date().toLocaleDateString("fa-IR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          updatedAt: new Date().toLocaleDateString("fa-IR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        console.log('products',req.body.products);
        await Payment.create(newPayment);
       
        res
          .status(200)
          .json({msg:"redirected",
            link: `https://zarinpal.com/pg/StartPay/${response.data.data.authority}`,
          });
      } else {
        res.status(401).json({ msg: "   خطا در ارتباط با درگاه پرداخت  " });
      }
    } else {
      res.status(401).json({ msg: "  سبد خرید خالی است" });
      return;
    }
  } catch (error) {}
};

module.exports.getAllPayments = getAllPayments;
module.exports.DeletePayment = DeletePayment;
module.exports.UpdatePayment = UpdatePayment;
module.exports.getOnePaymentById = getOnePaymentById;
module.exports.newPayment = newPayment;
module.exports.paymentResulCheck = paymentResulCheck;
