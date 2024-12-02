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
  generateActivityDescription,
  ManageActivityDynamically,
  ManageDayDynamically,
  DeleteDay,
  DeleteActivity,
  updateItinerary,
  DeleteIternary,
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
router.route("/generateActivityDescription").post(generateActivityDescription);
router.route("/addday/:id").post(ManageDayDynamically);
router
  .route("/addactivity/:itineraryId/:dayId")
  .post(ManageActivityDynamically);
router.route("/deleteDay/:dayId").delete(DeleteDay);
router.route("/deleteActivity/:dayId/:activityId").delete(DeleteActivity);
router.route("/updateitinerary/:id").put(updateItinerary);
router.route("/deleteiternary/:id").delete(DeleteIternary);
module.exports = router;
