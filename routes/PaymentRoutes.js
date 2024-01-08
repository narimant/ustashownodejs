const express = require("express");
const router = express();
const PaymentController = require("../controllers/PaymentController");
const userExist=require('../middlewares/userExist')
router.get("/payments", PaymentController.getAllPayments);

router.delete("/delete-payment/:id", PaymentController.DeletePayment);

router.patch(
  "/update-payment/:id",
  PaymentController.UpdatePayment
);

//for admin
router.get("/get-payment/:id", PaymentController.getOnePaymentById);


//main payment 
router.post('/new-payment',userExist,PaymentController.newPayment)
router.post('/payment-result-check',userExist,PaymentController.paymentResulCheck)


module.exports = router;
