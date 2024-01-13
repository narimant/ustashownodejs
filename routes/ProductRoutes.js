const express=require('express');
const router=express();
const ProductController=require('../controllers/ProductController');

const isAdmin=require('../middlewares/isAdmin')



router.get("/posts-rel",ProductController.getRelProduct)
router.get("/products",ProductController.getAllProducts)
router.get("/get-page-products",ProductController.getPageProducts)
router.post("/new-product",isAdmin,ProductController.newProduct)
router.delete("/delete-product/:id",isAdmin,ProductController.DeleteProduct)
router.patch("/update-product/:id",isAdmin,ProductController.UpdateProduct)
router.get("/get-product/:slug",ProductController.getOneProduct)
router.get("/get-product-by-id/:id",isAdmin,ProductController.getOneProductById)
router.get("/get-new-product",ProductController.getNewProducts)
router.get("/get-most-view/:limit",ProductController.getMostView)
router.post("/get-related-product",ProductController.getRelatedProduct)
router.get("/get-home-products",ProductController.getHomeProducts)
router.get("/search-products",ProductController.searchProducts)
module.exports=router;