const express=require('express');
const {check }=require('express-validator')
const router=express();
const MiddleBannerController=require('../controllers/MiddleBannerController');

router.get("/middle-baners",MiddleBannerController.getAllMidBan)
router.post("/new-middle-baners",MiddleBannerController.newMidBan)
router.delete("/delete-middle-baners",MiddleBannerController.deleteMidBan)
router.patch("/update-middle-baners",MiddleBannerController.updateMidBan)
router.get("/get-middle-baners/:id",MiddleBannerController.getMidBan)
router.get("/get-active-banners",MiddleBannerController.getActiveBaners)
module.exports=router;