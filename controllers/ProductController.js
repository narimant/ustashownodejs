const Products = require("../models/Product");
const Category = require("../models/Category");
const { all } = require("../routes/CategoryRoutes");
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

    res.status(200).json(GolProducts);
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
        .limit(paginate)
        .populate("categories");
      const AllProductsNum = await Products.find();
      res.status(200).json({ GolProducts, AllProductsNum });
    } else {
      const AllProducts = await Products.find()
        .sort({ _id: -1 })
        .select({ mainFile: false })
        .populate("categories");
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
    req.params.id;
    const goalProduct = await Products.findById(req.params.id);
    res.status(200).json(goalProduct);
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: error });
  }
};

const getOneProduct = async (req, res) => {
  try {
    const goalProduct = await Products.findOne({
      slug: req.params.slug,
      published: true,
    });
    //update page view
    const newProduct = {
      pageView: goalProduct.pageView + 1,
    };
    await Products.findByIdAndUpdate(goalProduct._id, newProduct, {
      new: true,
    });
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
        categories: 1,
        features: 1,
        buyNumber: 1,
        typeOfProduct: 1,
        price: 1,
      });

    res.status(200).json(newProducts);
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "خطا در دریافت بنر" });
  }
};

const getRelatedProduct = async (req, res) => {
  try {
    const goalIds = req.body.goalIds;
    console.log(req.body);
    const relatedProducts = await Products.find({
      _id: goalIds,
      published: true,
    })
      .limit(4)
      .select({
        mainFile: false,
      });

    res.status(200).json(relatedProducts);
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "خطا در دریافت بنر" });
  }
};

const getRelProduct = async (req, res) => {
  try {
    const allProducts = await Products.find({ published: true }).select({
      title: 1,
    });
    res.status(200).json(allProducts);
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "خطا در دریافت پست ها" });
  }
};

const getRelCategory = async (req, res) => {
  try {
    const allCategory = await Category.find({ situation: true }).select({
      title: 1,
    });
    res.status(200).json(allCategory);
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "خطا در دریافت پست ها" });
  }
};
const getHomeProducts = async (req, res) => {
  try {
    const appProducts = await Products.find({
      published: true,
      typeOfProduct: "app",
    })
      .limit(4)
      .select({ mainFile: false })
      .populate("categories");
    const bookProducts = await Products.find({
      published: true,
      typeOfProduct: "book",
    })
      .limit(4)
      .select({ mainFile: false })
      .populate("categories");
    const grProducts = await Products.find({
      published: true,
      typeOfProduct: "gr",
    })
      .limit(4)
      .select({ mainFile: false })
      .populate("categories");
    res.status(200).json({ appProducts, bookProducts, grProducts });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "خطا در دریافت پست ها" });
  }
};
const getMosetView = async () => {};

const searchProducts = async (req, res) => {
  try {
    let allProducts = await Products.find()
      .select({ mainFile: false })
      .sort({ _id: -1 })
      .populate("categories");

    ///keyword search

    if (req.query.keyword) {
      const a = allProducts.filter((item) =>{
        console.log(req.query.keyword);
        return item.title.includes(req.query.keyword)}
      );
      allProducts = a;
    }

    //order by

    if (req.query.orderBy) {
      let a = [];
      if (req.query.orderBy === "price") {
        a = allProducts.sort((a, b) => (Number(a) > Number(b) ? 1 : -1));
      } else if (req.query.orderBy == "byNumber") {
        a = allProducts.sort((a, b) => (a.buyNumber > b.buyNumber ? 1 : -1));
      } else if (req.query.type == "pageView") {
        a = allProducts.sort((a, b) => (a.pageView > b.pageView ? 1 : -1));
      } else {
        a = allProducts;
      }
      allProducts = a;
    }

    //type of product

    if (req.query.type) {
      let a = allProducts.filter((pro) => pro.typeOfProduct == req.query.type);
     
      allProducts = a;
    }


    //price
    if (req.query.min && req.query.max) {
      const a = allProducts.filter(
        (pro) =>
          Number(pro.price) <= req.query.max &&
          Number(pro.price) >= req.query.min
      );
      console.log("nariman");
      allProducts = a;
    }

    // categories select
    if (req.query.categories) {
      const a = [];

      const categoriesSlugs = req.query.categories.split(",");
      for (let i = 0; i < allProducts.length; i++) {
        for (let j = 0; j < allProducts[i].categories.length; j++) {
          console.log("array2");
          for (let t = 0; t < categoriesSlugs.length; t++) {
            console.log("tatari");
            if (allProducts[i].categories[j].slug == categoriesSlugs[t]) {
              a.push(allProducts[i]);
            }
          }
        }
      }
      // let uniqe =item=>[...new set(item)];

      allProducts = a;
    }


//pageinate

  const productsNumber = allProducts.length;
  const pageNumber =req.query.pn?req.query.pn : 1;
  paginate = 12;
  const startNumber = (pageNumber - 1) * paginate;
  const endNumber = paginate * pageNumber;
  const a = [];
  if (pageNumber >= 0) {
    for (let i = startNumber; i < endNumber; i++) {
      if (allProducts[i] != null) {
        a.push(allProducts[i]);
      }
    }
  }
  allProducts = a;

   

   
    const N = Math.ceil(productsNumber / paginate);
    const btns = Array.from(Array(N).keys());

    res.status(200).json({ allProducts, btns });


  } catch (error) {
    res.status(400).json(error);
  }
};
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
module.exports.getHomeProducts = getHomeProducts;
module.exports.searchProducts = searchProducts;
