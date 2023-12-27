const express=require('express');

const router=express();
const CategoryController=require('../controllers/CategoryController');

router.get("/get-all-category",CategoryController.getAllCategory)
router.post("/new-category",CategoryController.newCategory)
router.delete("/delete-category",CategoryController.DeleteCategory)
router.patch("/update-category/:id",CategoryController.updateCategory)
router.get("/get-one-category/:id",CategoryController.getOneCategory)
router.get("/get-active-category",CategoryController.getActiveCategory)
module.exports=router;