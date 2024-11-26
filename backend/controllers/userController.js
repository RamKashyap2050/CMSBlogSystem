const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const expressAsyncHandler = require("express-async-handler");
const passport = require("passport");
const Blogs = require("../models/Blogs");

const signup = expressAsyncHandler(async (req, res) => {
  try {
    const { email, password, profilePhoto, name } = req.body;
    console.log(
      "Name",
      name,
      "Email",
      email,
      "Password",
      password,
      "ProfilePhoto",
      profilePhoto
    );
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: "Email is already in use." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    console.log("Request Body:", req.body);

    const user = await User.create({
      email: email,
      user_name: name,
      password: hashedPassword,
      profilephoto: profilePhoto,
      username: email,
    });

    console.log("User creation result:", user);
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.status(201).json({
        message: "User registered and logged in successfully",
        user: {
          id: user.id,
          email: user.email,
          profilePhoto: user.ProfilePhoto,
        },
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

const login = expressAsyncHandler(async (req, res, next) => {
  console.log("Request Body:", req.body); // Log the request body
  passport.authenticate("local", (err, user) => {
    if (err) {
      return next(err);
    }
    console.log(user);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.status(200).json({
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email,
          profilePhoto: user.ProfilePhoto,
        },
      });
    });
  })(req, res, next);
});

const logout = expressAsyncHandler((req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.status(200).json({ message: "Logged out successfully" });
  });
});
// Middleware to protect routes
const isAuthenticated = expressAsyncHandler((req, res, next) => {
  console.log("Session data:", JSON.stringify(req.session, null, 2)); // Log the session data here
  if (req.isAuthenticated()) {
    return next();
  }
  console.log("Session ID:", req.sessionID); // For session-based auth
  console.log("Token:", req.headers.cookie); // For token-based auth
  res.status(401).json({ message: "Unauthorized" });
});

const makeComment = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { user_id, comment } = req.body;
  const newComment = { user_id, comment };

  try {
    const blog = await Blogs.findById(id);
    if (!blog) {
      res.status(404).json({ message: "Blog not found" });
      return;
    }

    // Add comment to blog
    blog.comments.push(newComment);
    await blog.save();

    // Populate the comment's user details before sending response
    const populatedComment = await Blogs.findById(id)
      .populate({
        path: "comments.user_id",
        select: "name profile_photo",
      })
      .select("comments");

    res.status(200).json(populatedComment.comments);
  } catch (error) {
    res.status(500).json({ message: "Failed to add comment", error: error.message });
  }
});


const toggleLike = expressAsyncHandler(async (req, res) => {
  const { id } = req.params; // Post ID from the request parameters
  const { userId } = req.body; // User ID from the request body

  const post = await Blogs.findById(id); // Find the post by ID

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  // Check if the user has already liked the post
  if (post.liked_by.includes(userId)) {
    // If liked, remove the user from the `liked_by` array
    await Blogs.updateOne({ _id: id }, { $pull: { liked_by: userId } });
    return res.status(200).json({ message: "Like removed" });
  }

  // If not liked, add the user to the `liked_by` array
  await Blogs.updateOne({ _id: id }, { $push: { liked_by: userId } });
  res.status(200).json({ message: "Like added" });
});



module.exports = { login, signup, isAuthenticated, logout, makeComment, toggleLike };
