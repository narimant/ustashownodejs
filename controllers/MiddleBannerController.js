const MiddleBanner = require("../models/MiddleBanner");

const getAllMidBan = async (req, res) => {
  try {
    if (req.query.pn) {
      const paginate = 10;
      const pageNumber = req.query.pn;
      const GoalMidBans = await MiddleBanner.find()
        .sort({ _id: -1 })
        .skip((pageNumber - 1) * paginate)
        .limit(paginate);
      const AllMidBans = await MiddleBanner.find();
      res.status(200).json({ GoalMidBans, AllMidBans });
    } else {
      const AllMidBans = await MiddleBanner.find();
      res.status(200).json(AllMidBans);
    }
  } catch (error) {
    res.status(400).json({ msg: error });
  }
};

const newMidBan = async (req, res) => {
  try {

    const errors=validationResult(req);

    const newMidBan = new MiddleBanner({
      image: req.body.image,
      imageAlt: req.body.imageAlt,
      situation: req.body.situation,
      link: req.body.link,
      date: new Date().toLocaleDateString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });
    newMidBan.save().then((d) => {
      res.status(200).json({ msg: "بنر با موفقیت ایجاد شد" });
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "خطا در زخیره بنر" });
  }
};

const UpdateMidBan = async (req, res) => {
  try {
    await MiddleBanner.updateOne(
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

const DeleteMidBan = async (req, res) => {
  try {
    await MiddleBanner.deleteOne({ _id: req.body.goalId });

    res.status(200).json({ msg: "بنر با موفقیت  حذف شد" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "خطا در حذف بنر" });
  }
};

const getMidBan = async (req, res) => {
  try {
    const findBaanner = await MiddleBanner.findById(req.params.id);

    res.status(200).json(findBaanner);
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "خطا در زخیره بنر" });
  }
};

const getActiveBaners = async (req, res) => {
  try {
    const activeBanner = await MiddleBanner.find({ situation: true }).select({
      image: 1,
      imageAlt: 1,
      link: 1,
    });

    res.status(200).json(activeBanner);
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "خطا در دریافت بنر" });
  }
};
module.exports.getMidBan = getMidBan;
module.exports.getAllMidBan = getAllMidBan;
module.exports.newMidBan = newMidBan;
module.exports.updateMidBan = UpdateMidBan;
module.exports.deleteMidBan = DeleteMidBan;
module.exports.getActiveBaners = getActiveBaners;
