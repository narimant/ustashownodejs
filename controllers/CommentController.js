const { validationResult } = require("express-validator");
const PaymentController = require("../models/Payment");
const Payment = require("../models/Payment");
const axios = require("axios");
const User = require("../models/User");
const Comment = require("../models/Comment");
const Post = require("../models/Post");
const Product = require("../models/Product");

const getAllcomments = async (req, res) => {
  try {
    if (req.query.pn) {
      const paginate = 10;
      const pageNumber = req.query.pn;
      const GolComments = await Comment.find()
        .sort({ _id: -1 })
        .skip((pageNumber - 1) * paginate)
        .limit(paginate);
      const AllCommentsNum = await Comment.find();
      res.status(200).json({ GolComments, AllCommentsNum });
    } else {
      const AllComments = await Payment.find();
      res.status(200).json(AllComments);
    }
  } catch (error) {
    res.status(400).json({ msg: "error" });
  }
};

const UpdateComment = async (req, res) => {
  try {
    //express validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ msg: errors });
    } else {
      const data = req.body;
      const parentId=req.body.parentId;
      await Comment.findByIdAndUpdate(req.params.id, data, { new: true });
      if(parentId!==""){
        await Comment.updateOne({_id:parentId},{ $inc: { replayCount: 1 } })
      }
      res.status(200).json({ msg: "پیام با موفقیت بروز رسانی شد" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "خطا در زخیره پرداخت" });
  }
};

const DeleteComment = async (req, res) => {
  try {
    await Comment.findByIdAndRemove(req.params.id);

    res.status(200).json({ msg: "پیام با موفقیت  حذف شد" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "خطا در حذف پیام" });
  }
};



const getOneCommentById = async (req, res) => {
  try {
    console.log(req.params);
    let goalComment = await Comment.findById(req.params.id);
    //addding source post or product to the comment
let PostProduct={};
    if(goalComment.typeOfModel=="post"){
      PostProduct =await Post.findById(goalComment.src_id).select({title:1,slug:1})
     
    }else{
      PostProduct =await Product.findById(goalComment.src_id).select({title:1,slug:1})
     
    }

    //adding paren comment

 let parent={};
    if(goalComment.parentId!==""){
      parent =await Comment.findById(goalComment.parentId)

    }

const sendData={
  goalComment,
PostProduct,
parent
}
    res.status(200).json(sendData);
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: error });
  }
};





const newComment = async (req, res) => {
  try {
   //express validator
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
     res.status(422).json({ msg: errors.errors[0].msg });
     return ;
   }
    const theUser = await User.findById(req.user._id);

    if (!theUser) {
      res.status(401).json({ msg: "کاربر یافت نشد" });
      return;
    }


      let commentData = {
        message: req.body.message,
        email: theUser.email,
        displayName:theUser.displayName,
        src_id:req.body.src_id,
        parentId:req.body.parentId,
        typeOfModel:req.body.typeOfModel,
        published:false,
        viewed:false,
        createAt:new Date().toLocaleDateString("fa-IR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }
        await Comment.create(commentData);
       
        res.status(200).json({msg:"دیدگاه شما بعد از بررسی منتشر خواهد شد"})
 
  } catch (error) {
    console.log(error);
  }
};


const publishComment = async (req, res) => {
  try {
    const theUser = await User.findById(req.user._id);

    if (!theUser) {
      res.status(401).json({ msg: "کاربر یافت نشد" });
      return;
    }
   
    const theComment=await Comment.findById(req.body.goalId);

    const newCommentData={
      published:true,
    }
    await Comment.findByIdAndUpdate(req.body.goalId,newCommentData,{new:true})

 
  } catch (error) {
    console.log(error);
  }
};


const getCommentChildren=async (req,res)=>{
  try {

    const goalReplayComment=await Comment.find({parentId:req.params.id,published:true}).sort({_id:-1});
    console.log(goalReplayComment); 
    res.status(200).json(goalReplayComment)

  } catch (error) {
    
  }
}

const getModelComments=async (req,res)=>{

  try {

    const goalModelComments=await Comment.find({src_id:req.params.id,published:true,parentId:''}).sort({_id:-1});
  console.log(goalModelComments);

      res.status(200).json(goalModelComments)
  


  } catch (error) {
    
  }
}






module.exports.getAllcomments = getAllcomments;
module.exports.DeleteComment = DeleteComment;
module.exports.UpdateComment = UpdateComment;
module.exports.getOneCommentById = getOneCommentById;
module.exports.newComment = newComment;
module.exports.getModelComments = getModelComments;
module.exports.publishComment = publishComment;
module.exports.getCommentChildren = getCommentChildren;



