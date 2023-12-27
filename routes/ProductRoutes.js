const express=require('express');
const router=express();
const ProductController=require('../controllers/ProductController');




router.get("/posts-rel",ProductController.getRelProduct)
router.get("/products",ProductController.getAllProducts)
router.get("/get-page-products",ProductController.getPageProducts)
router.post("/new-product",ProductController.newProduct)
router.delete("/delete-product/:id",ProductController.DeleteProduct)
router.patch("/update-product/:id",ProductController.UpdateProduct)
router.get("/get-product/:slug",ProductController.getOneProduct)
router.get("/get-product-by-id/:id",ProductController.getOneProductById)
router.get("/get-new-product",ProductController.getNewProducts)
router.get("/get-most-view/:limit",ProductController.getMostView)
router.post("/get-related-product",ProductController.getRelatedProduct)
module.exports=router;