const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const nodemailer = require("nodemailer");
const expressAsyncHandler = require("express-async-handler");
const passport = require("passport");
const Blogs = require("../models/Blogs");
const Email = require("../models/Emails")
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
    res
      .status(500)
      .json({ message: "Failed to add comment", error: error.message });
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

const sendEmail = expressAsyncHandler(async (req, res) => {
  const { user_name, email, message } = req.body; // Extract user details from request body

  try {

        // Save email details to the database
        const savedEmail = await Email.create({
          user_name,
          email,
          message,
        });
    // Setup transporter for nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODE_MAILER_USER,
        pass: process.env.NODE_MAILER_PASS,
      },
    });

    // Mail options
    const mailOptions = {
      from: process.env.NODE_MAILER_USER,
      to: email, // User's email
      subject: "Thank You for Reaching Out - AsITravel",
      html: `
    <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f9f9f9;
              color: #333333;
              margin: 0;
              padding: 0;
            }
            .email-container {
              max-width: 600px;
              margin: 20px auto;
              background-color: #ffffff;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              padding: 20px;
            }
        .email-header {
  text-align: center;
  margin-bottom: 20px;
  background-color: #e6f7ff; /* Light blue hue */
  padding: 20px;
  border-radius: 8px;
}

            .email-header img {
              max-width: 100px;
              margin-bottom: 10px;
              border-radius: 50%;
            }
            .email-body {
              text-align: left;
            }
            .email-body h1 {
              font-size: 20px;
              color: #222222;
              margin-bottom: 10px;
            }
            .email-body p {
              font-size: 16px;
              line-height: 1.6;
              margin-bottom: 10px;
            }
            .email-footer {
              text-align: center;
              margin-top: 20px;
              font-size: 14px;
              color: #666666;
            }
            .email-footer a {
              color: #333333;
              text-decoration: none;
            }
           .button {
  display: inline-block;
  margin-top: 20px;
  background-color: #e6f7ff; /* Light blue hue */
  color: black;
  padding: 10px 20px;
  text-decoration: none;
  border-radius: 5px;
  font-size: 16px;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.button:hover {
  background-color: #b3e0ff; /* Slightly deeper blue */
  color: #000000; /* Keep text color consistent */
}

          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="email-header">
              <img 
                src="https://example-aws-bucket-trial-for-farmerplace.s3.us-east-2.amazonaws.com/AsITravel/asitravel.jpg" 
                alt="AsITravel Logo"
              />
              <h2>AsITravel</h2>
            </div>
            <div class="email-body">
              <h1>Hello, ${user_name}!</h1>
              <p>Thank you for reaching out to me at <b>AsITravel</b>. It means a lot that you have taken the time to connect with me on this journey!</p>
              <p>I have received your message:</p>
              <blockquote style="font-style: italic; border-left: 3px solid #e6f7ff; padding-left: 10px; margin: 10px 0;">
                  ${message}
              </blockquote>
              <p>As a solo traveler, I personally handle all communications. I will get back to you as soon as I can. In the meantime, feel free to explore more travel stories and tips on the blog.</p>
                            <a href="https://cms-blog-system.vercel.app/" class="button">Explore My Blog</a>

              <p>Happy reading,</p>
              <p>- Varsha Reddy</p>
            </div>
            <div class="email-footer">
              <p>©  ${new Date().getFullYear()} AsITravel. All rights reserved.</p>
              <p>
                Follow my adventures on 
                <a href="https://www.instagram.com/asitravel.in/" target="_blank">Instagram</a>.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);

    res
      .status(200)
      .json({ message: "Acknowledgment email sent successfully.", email: savedEmail });
  } catch (error) {
    console.error("Error sending email:", error);
    res
      .status(500)
      .json({ message: "Failed to send email.", error: error.message });
  }
});

module.exports = {
  login,
  signup,
  isAuthenticated,
  logout,
  makeComment,
  toggleLike,
  sendEmail,
};
