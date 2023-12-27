const Slider = require("../models/Slider");

const getAllSliders = async (req, res) => {
  try {
    if (req.query.pn) {
      const paginate = 10;
      const pageNumber = req.query.pn;
      const GoalSliders = await Slider.find()
        .sort({ _id: -1 })
        .skip((pageNumber - 1) * paginate)
        .limit(paginate);
      const AllSliders = await Slider.find();
      res.status(200).json({ GoalSliders, AllSliders });
    } else {
      const AllSliders = await Slider.find();
      res.status(200).json(AllSliders);
    }
  } catch (error) {
    res.status(400).json({ msg: "error" });
  }
};

const newSlider = async (req, res) => {
  try {



    const newSlider = new Slider({
      image: req.body.image,
      imageAlt: req.body.imageAlt,
      situation: req.body.situation,
      link: req.body.link,
      date: new Date().toLocaleDateString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });
    newSlider.save().then((d) => {
      res.status(200).json({ msg: "بنر با موفقیت ایجاد شد" });
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "خطا در زخیره بنر" });
  }
};

const updateSlider = async (req, res) => {
  try {
    await Slider.updateOne(
      { _id: req.body.bannerId },
      {
        $set: {
          image: req.body.image,
          imageAlt: req.body.imageAlt,
          situation: req.body.situation,
          link: req.body.link,
          UpdateDate: new Date().toLocaleDateString("fa-IR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      }
    );

    res.status(200).json({ msg: "بنر با موفقیت بروز رسانی شد" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "خطا در زخیره بنر" });
  }
};

const DeleteSlider = async (req, res) => {
  try {
    await Slider.deleteOne({ _id: req.body.goalId });

    res.status(200).json({ msg: "بنر با موفقیت  حذف شد" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "خطا در حذف بنر" });
  }
};

const getOneSlider = async (req, res) => {
  try {
    const filndSlider = await Slider.findById(req.params.id);

    res.status(200).json(filndSlider);
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "خطا در زخیره بنر" });
  }
};

const getActiveSlider = async (req, res) => {
  try {
    const activeSlider = await Slider.find({ situation: true }).select({
      image: 1,
      imageAlt: 1,
      link: 1,
    });

    res.status(200).json(activeSlider);
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "خطا در دریافت بنر" });
  }
};
module.exports.getOneSlider = getOneSlider;
module.exports.getAllSliders = getAllSliders;
module.exports.newSlider = newSlider;
module.exports.updateSlider = updateSlider;
module.exports.DeleteSlider = DeleteSlider;
module.exports.getActiveSlider = getActiveSlider;
