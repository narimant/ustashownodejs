const Category = require("../models/Category");

const getAllCategory = async (req, res) => {
  try {
    if (req.query.pn) {
      const paginate = 10;
      const pageNumber = req.query.pn;
      const GoalCategories = await Category.find()
        .sort({ _id: -1 })
        .skip((pageNumber - 1) * paginate)
        .limit(paginate);
      const AllCategories = await Category.find();
      res.status(200).json({ GoalCategories, AllCategories });
    } else {
      const AllCategories = await Category.find();
      res.status(200).json(AllCategories);
    }
  } catch (error) {
    res.status(400).json({ msg: error});
  }
};

const newCategory = async (req, res) => {
  try {


    const newCat = new Category({
      image: req.body.image,
      imageAlt: req.body.imageAlt,
      situation: req.body.situation,
      title: req.body.title,
      shortDesc: req.body.shortDesc,
      slug: req.body.slug,
      date: new Date().toLocaleDateString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });
    newCat.save().then((d) => {
      res.status(200).json({ msg: "دسته بندی با موفقیت ایجاد شد" });
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "خطا در زخیره بنر" });
  }
};

const updateCategory = async (req, res) => {
  try {
 
    await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new:true}
      
    );

    res.status(200).json({ msg: "دسته بندی با موفقیت بروز رسانی شد" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "خطا در زخیره دسته بندی" });
  }
};

const DeleteCategory = async (req, res) => {
  try {
    await Category.deleteOne({ _id: req.body.goalId });

    res.status(200).json({ msg: "دسته بندی با موفقیت  حذف شد" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "خطا در حذف دسته بندی" });
  }
};

const getOneCategory = async (req, res) => {
  try {
    const findCategory = await Category.findById(req.params.id);

    res.status(200).json(findCategory);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

const getActiveCategory = async (req, res) => {
  try {
    const activeCategory = await Category.find({ situation: true })

    res.status(200).json(activeCategory);
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "خطا در دریافت دسته بندی" });
  }
};
module.exports.getOneCategory = getOneCategory;
module.exports.getAllCategory = getAllCategory;
module.exports.newCategory = newCategory;
module.exports.updateCategory = updateCategory;
module.exports.DeleteCategory = DeleteCategory;
module.exports.getActiveCategory = getActiveCategory;
