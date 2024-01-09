const express = require("express");
const router = express();
const Product=require('../models/Product')
const Post=require('../models/Post')
const Comment=require('../models/Comment')
const User=require('../models/User')
const CommentController = require("../controllers/CommentController");
const userExist=require('../middlewares/userExist')
const nodemailer=require("nodemailer");
const { check } = require("express-validator");

router.get("/comments", CommentController.getAllcomments);

router.delete("/delete-comment/:id", CommentController.DeleteComment);

router.patch(
  "/update-comment/:id",[
    check('message',"تعداد کاراکترها باید بیشتر از 10 تا باشد").isLength({min:10}),
    
  ],
  CommentController.UpdateComment
);

//for admin
router.get("/get-comment/:id", CommentController.getOneCommentById);

router.get("/get-model-comments/:id", CommentController.getModelComments);
router.get("/get-comment-children/:id", CommentController.getCommentChildren);
router.post("/publish-comments", CommentController.publishComment);
//main Comment 
router.post('/new-comment',userExist,[
  check("message","تعداد کاراکترها باید بیشتر از 10 تا باشد").isLength({min:10}),

],CommentController.newComment)



module.exports = router;
