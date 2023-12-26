const express=require('express');
const router=express();
const PostController=require('../controllers/PostController');




router.get("/posts-rel",PostController.getRelPost)
router.get("/posts",PostController.getAllPosts)
router.get("/get-blog-page-posts",PostController.getBlogPagePosts)
router.post("/new-post",PostController.newPost)
router.delete("/delete-post/:id",PostController.DeletePost)
router.patch("/update-post/:id",PostController.UpdatePost)
router.get("/get-post/:slug",PostController.getOnePost)
router.get("/get-post-by-id/:id",PostController.getOnePostById)
router.get("/get-new-post",PostController.getNewPosts)
router.get("/get-most-view/:limit",PostController.getMostView)
router.post("/get-related-post",PostController.getRelatedPost)
module.exports=router;