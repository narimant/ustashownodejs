const express=require('express');

const router=express();
const MiddleBannerController=require('../controllers/MiddleBannerController');

const isAdmin=require('../middlewares/isAdmin')


router.get("/middle-baners",isAdmin,MiddleBannerController.getAllMidBan)
router.post("/new-middle-baners",isAdmin,MiddleBannerController.newMidBan)
router.delete("/delete-middle-baners",isAdmin,MiddleBannerController.deleteMidBan)
router.patch("/update-middle-baners",isAdmin,MiddleBannerController.updateMidBan)
router.get("/get-middle-baners/:id",isAdmin,MiddleBannerController.getMidBan)
router.get("/get-active-banners",MiddleBannerController.getActiveBaners)
module.exports=router;