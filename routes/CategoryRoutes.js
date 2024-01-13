const express=require('express');

const router=express();
const CategoryController=require('../controllers/CategoryController');

const isAdmin=require('../middlewares/isAdmin')


router.get("/get-all-category",CategoryController.getAllCategory)
router.post("/new-category",isAdmin,CategoryController.newCategory)
router.delete("/delete-category",isAdmin,CategoryController.DeleteCategory)
router.patch("/update-category/:id",isAdmin,CategoryController.updateCategory)
router.get("/get-one-category/:id",CategoryController.getOneCategory)
router.get("/get-active-category",CategoryController.getActiveCategory)
module.exports=router;