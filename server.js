const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv/config");

//security
const helmet = require("helmet");
const xssCleaner = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");

//mid
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);
app.use(cookieParser());
app.use(cors());
app.use(helmet());
app.use(xssCleaner());
app.use(mongoSanitize());
app.use(hpp());





app.get("/", (req, res) => {
  res.status(200).json({
    msg: "this is nariman file shop course server...",
  });
});

//routes
const MiddleBannerRoutes=require('./routes/MiddleBannerRoutes');
const PostRoutes=require('./routes/PostRoutes');
const SliderRoutes=require('./routes/SliderRoutes');
const CategoryRoutes=require('./routes/CategoryRoutes');
const ProductRoutes=require('./routes/ProductRoutes');
const UserRoutes=require('./routes/UserRoutes');
const PaymentRoutes=require('./routes/PaymentRoutes');
const CommentRoutes=require('./routes/CommentRoutes');

app.use("/api",MiddleBannerRoutes);
app.use("/api",PostRoutes);
app.use("/api",SliderRoutes);
app.use("/api",CategoryRoutes);
app.use("/api",ProductRoutes);
app.use("/api",UserRoutes);
app.use("/api",PaymentRoutes);
app.use("/api",CommentRoutes);

const port = process.env.PORT;
const db_uri = process.env.DB_URI;
mongoose
  .connect(db_uri)
  .then((d) =>{
    console.log('ok');
    app.listen(port)
    })
  .catch((err) => console.log(err));
