const express = require("express");
const config = require("./utils/config");
require("express-async-errors");
const application = express();
const blogRouter = require("./controllers/blogs");
const userRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const cors = require("cors");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

logger.info("connecting to", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });

application.use(cors());
application.use(express.json());
application.use(express.static("dist"));
application.use("/api/blog_list", middleware.userExtractor, blogRouter);
application.use("/api/users", userRouter);
application.use("/api/login", loginRouter);

if (process.env.NODE_ENV === "test") {
  const testingRouter = require("./controllers/testing");
  application.use("/api/testing", testingRouter);
}

application.use(middleware.requestLogger);
application.use(middleware.unknownEndpoint);
application.use(middleware.errorHandler);

module.exports = application;
