const Products = require("../models/Product");
const Category=require('../models/Category')
const getPageProducts = async (req, res) => {
  try {
    if (req.query.pn) {
      const paginate = 10;
      const pageNumber = req.query.pn;
      const GolProducts = await Product.find({ published: true })
        .sort({ _id: -1 })
        .select({
          title: 1,
          updatedAt: 1,
          slug: 1,
          image: 1,
          imageAlt: 1,
          shortDesc: 1,
          type: 1,
          pageView: 1,
        })
        .skip((pageNumber - 1) * paginate)
        .limit(paginate);
      const AllProductsNum = await Product.find({ published: true });
      res.status(200).json({ GolProducts, AllProductsNum });
    } else {
      const AllProducts = await Product.find();
      res.status(200).json(AllProducts);
    }
  } catch (error) {
    res.status(400).json({ msg: "error" });
  }
};

const getMostView = async (req, res) => {
  try {

    const GolProducts = await Product.find({ published: true })
      .sort({ pageView: -1 })
      .select({
        title: 1,
        updatedAt: 1,
        slug: 1,
        image: 1,
        imageAlt: 1,
        shortDesc: 1,
        type: 1,
        pageView: 1,
      })

      .limit(5);

    res.status(200).json( GolProducts );
  } catch (error) {
    res.status(400).json({ msg: "error" });
  }
};

const getAllProducts = async (req, res) => {
  try {
    if (req.query.pn) {
      const paginate = 10;
      const pageNumber = req.query.pn;
      const GolProducts = await Products.find()
        .sort({ _id: -1 })
        .skip((pageNumber - 1) * paginate)
        .limit(paginate);
      const AllProductsNum = await Products.find();
      res.status(200).json({ GolProducts, AllProductsNum });
    } else {
      const AllProducts = await Products.find().sort({_id:-1}).select({mainFile:false});
      res.status(200).json(AllProducts);
    }
  } catch (error) {
    res.status(400).json({ msg: "error" });
  }
};

const newProduct = async (req, res) => {
  try {
    const data = req.body;
    data.slug = req.body.slug.replace(/\s+/g, "-").toLowerCase();
    await Products.create(data);

    res.status(200).json({ msg: "پست با موفقیت ایجاد شد" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "خطا در زخیره بنر" });
  }
};

const UpdateProduct = async (req, res) => {
  try {
    const data = req.body;
    data.slug = req.body.slug.replace(/\s+/g, "-").toLowerCase();
    await Products.findByIdAndUpdate(req.params.id, data, { new: true });

    res.status(200).json({ msg: "پست با موفقیت بروز رسانی شد" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "خطا در زخیره پست" });
  }
};

const DeleteProduct = async (req, res) => {
  try {
    await Products.findByIdAndRemove(req.params.id);

    res.status(200).json({ msg: "پست با موفقیت  حذف شد" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "خطا در حذف پست" });
  }
};

const getOneProductById = async (req, res) => {
  try {
    req.params.id
    const goalProduct = await Products.findById(req.params.id);
    res.status(200).json(goalProduct);
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: error });
  }
};

const getOneProduct = async (req, res) => {
  try {
    const goalProduct = await Products.findOne({ slug: req.params.slug });
    //update page view
    const newProduct = {
      pageView: goalProduct.pageView + 1,
    };
    await Products.findByIdAndUpdate(goalProduct._id, newProduct, { new: true });
    res.status(200).json(goalProduct);
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: error });
  }
};

const getNewProducts = async (req, res) => {
  try {
    const newProducts = await Products.find({ published: true })
      .sort({ _id: -1 })
      .limit(4)
      .select({
        title: 1,
        updatedAt: 1,
        slug: 1,
        image: 1,
        imageAlt: 1,
        shortDesc: 1,
        type: 1,
        pageView: 1,
      });

    res.status(200).json(newProducts);
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "خطا در دریافت بنر" });
  }
};


const getRelatedProduct  = async (req, res) => {
  try {
    const goalIds=req.body.goalIds;
    const relatedProducts = await Products.find({_id:goalIds,published: true})
      .limit(4)
      .select({
        title: 1,
        updatedAt: 1,
        slug: 1,
        image: 1,
        imageAlt: 1,
        shortDesc: 1,
        type: 1,
        pageView: 1,
      });

    res.status(200).json(relatedProducts);
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "خطا در دریافت بنر" });
  }
};


const getRelProduct = async (req, res) => {
  try {
    const allProducts = await Products.find({published: true}).select({ title: 1 });
    res.status(200).json(allProducts);
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "خطا در دریافت پست ها" });
  }
};


const getRelCategory = async (req, res) => {
  try {
    const allCategory = await Category.find({situation: true}).select({ title: 1 });
    res.status(200).json(allCategory);
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "خطا در دریافت پست ها" });
  }
};

const getMosetView = async () => {};
module.exports.getPageProducts = getPageProducts;
module.exports.getAllProducts = getAllProducts;
module.exports.newProduct = newProduct;
module.exports.DeleteProduct = DeleteProduct;
module.exports.UpdateProduct = UpdateProduct;
module.exports.getOneProduct = getOneProduct;
module.exports.getOneProductById = getOneProductById;
module.exports.getNewProducts = getNewProducts;
module.exports.getRelProduct = getRelProduct;
module.exports.getMostView = getMostView;
module.exports.getRelatedProduct = getRelatedProduct;
