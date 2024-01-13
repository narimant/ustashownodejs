const express = require("express");
const router = express();
const userExist=require('../middlewares/userExist')
const isAdmin=require('../middlewares/isAdmin')

const CommentController = require("../controllers/CommentController");

const { check } = require("express-validator");

router.get("/comments", CommentController.getAllcomments);

router.delete("/delete-comment/:id",isAdmin, CommentController.DeleteComment);

router.patch(
  "/update-comment/:id",[
    check('message',"تعداد کاراکترها باید بیشتر از 10 تا باشد").isLength({min:10}),
    
  ],isAdmin,
  CommentController.UpdateComment
);

//for admin
router.get("/get-comment/:id",isAdmin, CommentController.getOneCommentById);
router.get("/comment-count/:id",CommentController.getCommentCount)
router.get("/get-model-comments/:id", CommentController.getModelComments);
router.get("/get-comment-children/:id", CommentController.getCommentChildren);
router.post("/publish-comments",isAdmin, CommentController.publishComment);
//main Comment 
router.post('/new-comment',userExist,[
  check("message","تعداد کاراکترها باید بیشتر از 10 تا باشد").isLength({min:10}),

],CommentController.newComment)



module.exports = router;
