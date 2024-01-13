const express=require('express');

const router=express();
const SliderController=require('../controllers/SliderController');

const isAdmin=require('../middlewares/isAdmin')


router.get("/sliders",SliderController.getAllSliders)
router.post("/new-slider",isAdmin,SliderController.newSlider)
router.delete("/delete-slider",isAdmin,SliderController.DeleteSlider)
router.patch("/update-slider",isAdmin,SliderController.updateSlider)
router.get("/get-one-slider/:id",isAdmin,SliderController.getOneSlider)
router.get("/get-active-slider",SliderController.getActiveSlider)
module.exports=router;