const expressAsyncHandler = require("express-async-handler");
const redis = require("../config/redis");

const attachRedis = expressAsyncHandler(async (req, res, next) => {
  req.redis = redis;
  next();
});

module.exports = attachRedis;
