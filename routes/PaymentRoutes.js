const express = require("express");
const router = express();
const PaymentController = require("../controllers/PaymentController");
const userExist=require('../middlewares/userExist')
const isAdmin=require('../middlewares/isAdmin')
router.get("/payments",isAdmin, PaymentController.getAllPayments);

router.delete("/delete-payment/:id",isAdmin, PaymentController.DeletePayment);

router.patch(
  "/update-payment/:id",isAdmin,
  PaymentController.UpdatePayment
);

//for admin
router.get("/get-payment/:id",isAdmin, PaymentController.getOnePaymentById);


//main payment 
router.post('/new-payment',userExist,PaymentController.newPayment)
router.post('/payment-result-check',userExist,PaymentController.paymentResulCheck)


module.exports = router;
