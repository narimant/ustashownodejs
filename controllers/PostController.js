const Post = require("../models/Post");

const getBlogPagePosts = async (req, res) => {
  try {
    if (req.query.pn) {
      const paginate = 10;
      const pageNumber = req.query.pn;
      const GolPosts = await Post.find({ published: true })
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
      const AllPostsNum = await Post.find({ published: true });
      res.status(200).json({ GolPosts, AllPostsNum });
    } else {
      const AllPosts = await Post.find();
      res.status(200).json(AllPosts);
    }
  } catch (error) {
    res.status(400).json({ msg: "error" });
  }
};

const getMostView = async (req, res) => {
  try {

    const GolPosts = await Post.find({ published: true })
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

    res.status(200).json( GolPosts );
  } catch (error) {
    res.status(400).json({ msg: "error" });
  }
};

const getAllPosts = async (req, res) => {
  try {
    if (req.query.pn) {
      const paginate = 10;
      const pageNumber = req.query.pn;
      const GolPosts = await Post.find()
        .sort({ _id: -1 })
        .skip((pageNumber - 1) * paginate)
        .limit(paginate);
      const AllPostsNum = await Post.find();
      res.status(200).json({ GolPosts, AllPostsNum });
    } else {
      const AllPosts = await Post.find();
      res.status(200).json(AllPosts);
    }
  } catch (error) {
    res.status(400).json({ msg: "error" });
  }
};

const newPost = async (req, res) => {
  try {
    const data = req.body;
    data.slug = req.body.slug.replace(/\s+/g, "-").toLowerCase();
    await Post.create(data);

    res.status(200).json({ msg: "پست با موفقیت ایجاد شد" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "خطا در زخیره بنر" });
  }
};

const UpdatePost = async (req, res) => {
  try {
    const data = req.body;
    data.slug = req.body.slug.replace(/\s+/g, "-").toLowerCase();
    await Post.findByIdAndUpdate(req.params.id, data, { new: true });

    res.status(200).json({ msg: "پست با موفقیت بروز رسانی شد" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "خطا در زخیره پست" });
  }
};

const DeletePost = async (req, res) => {
  try {
    await Post.findByIdAndRemove(req.params.id);

    res.status(200).json({ msg: "پست با موفقیت  حذف شد" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "خطا در حذف پست" });
  }
};

const getOnePostById = async (req, res) => {
  try {
    const goalPost = await Post.findById(req.params.id);
    res.status(200).json(goalPost);
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: error });
  }
};

const getOnePost = async (req, res) => {
  try {
    const goalPost = await Post.findOne({ slug: req.params.slug });
    //update page view
    const newPost = {
      pageView: goalPost.pageView + 1,
    };
    await Post.findByIdAndUpdate(goalPost._id, newPost, { new: true });
    res.status(200).json(goalPost);
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: error });
  }
};

const getNewPosts = async (req, res) => {
  try {
    const newPosts = await Post.find({ published: true })
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

    res.status(200).json(newPosts);
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "خطا در دریافت بنر" });
  }
};


const getRelatedPost  = async (req, res) => {
  try {
    const goalIds=req.body.goalIds;
    const relatedPosts = await Post.find({_id:goalIds,published: true})
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

    res.status(200).json(relatedPosts);
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "خطا در دریافت بنر" });
  }
};


const getRelPost = async (req, res) => {
  try {
    const allPosts = await Post.find({published: true}).select({ title: 1 });
    res.status(200).json(allPosts);
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "خطا در دریافت پست ها" });
  }
};

const getMosetView = async () => {};
module.exports.getBlogPagePosts = getBlogPagePosts;
module.exports.getAllPosts = getAllPosts;
module.exports.newPost = newPost;
module.exports.DeletePost = DeletePost;
module.exports.UpdatePost = UpdatePost;
module.exports.getOnePost = getOnePost;
module.exports.getOnePostById = getOnePostById;
module.exports.getNewPosts = getNewPosts;
module.exports.getRelPost = getRelPost;
module.exports.getMostView = getMostView;
module.exports.getRelatedPost = getRelatedPost;
