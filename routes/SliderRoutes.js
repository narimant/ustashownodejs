const express=require('express');
const {check }=require('express-validator')
const router=express();
const SliderController=require('../controllers/SliderController');

router.get("/sliders",SliderController.getAllSliders)
router.post("/new-slider",SliderController.newSlider)
router.delete("/delete-slider",SliderController.DeleteSlider)
router.patch("/update-slider",SliderController.updateSlider)
router.get("/get-one-slider/:id",SliderController.getOneSlider)
router.get("/get-active-slider",SliderController.getActiveSlider)
module.exports=router;