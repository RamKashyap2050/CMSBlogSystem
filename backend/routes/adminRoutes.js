const express = require("express");
const {
  loginAdmin,
  CreateBlog,
  getBlogs,
  createIternary,
  addItineraryDay,
  ViewIternaries,
  ViewSingleIternary,
  getSingleBlog,
  addAdminReply,
  togglecommentlike,
  generateTravelContent,
} = require("../controllers/adminController");

const router = express.Router();

router.route("/loginadmin").post(loginAdmin);
router.route("/createblog").post(CreateBlog);
router.route("/getblogs").get(getBlogs);
router.route("/getSingleBlog/:id").get(getSingleBlog);
router.route("/createnewiternary").post(createIternary);
router.route("/additernaryday").post(addItineraryDay);
router.route("/getitineraries").get(ViewIternaries);
router.route("/itinerary/:itineraryId").get(ViewSingleIternary);
router.route("/addadminreply/:id").post(addAdminReply);
router.route("/togglecommentlike/:blogId/:commentId").put(togglecommentlike);
router.route("/generateContent").post(generateTravelContent);

module.exports = router;
