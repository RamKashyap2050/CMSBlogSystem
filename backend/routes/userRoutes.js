const express = require("express");
const {
  login,
  signup,
  isAuthenticated,
  logout,
  makeComment,
  toggleLike,
  sendEmail,
} = require("../controllers/userController");

const router = express.Router();

router.route("/login").post(login);
router.route("/signup").post(signup);
router.route("/verify").get(isAuthenticated, (req, res) => {
  console.log("Session ID:", req.sessionID);
  console.log("Session data:", req.session);
  console.log("Authenticated user:", req.user);
  res.status(200).json({
    message: "User is authenticated",
    user: req.user,
  });
});
router.route("/logout").post(logout);
router.route("/blogs/comment/:id").post(makeComment);
router.route("/blogs/like/:id").post(toggleLike);
router.route("/contact").post(sendEmail);

module.exports = router;
