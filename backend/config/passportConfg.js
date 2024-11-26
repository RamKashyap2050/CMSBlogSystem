const bcrypt = require("bcryptjs");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User"); // Mongoose User model

passport.use(
  new LocalStrategy(
    { usernameField: "email" }, // Expecting email as the username
    async (email, password, done) => {
      try {
        // Fetch user by email
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, { message: "Incorrect email." });
        }

        // Compare provided password with hashed password in DB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: "Incorrect password." });
        }

        return done(null, user); // User authenticated successfully
      } catch (err) {
        return done(err); // Handle any errors
      }
    }
  )
);

passport.serializeUser((user, done) => {
  // Store the user ID in the session
  console.log("Serializing user with ID:", user.id);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  console.log("Deserializing user with ID:", id);
  try {
    // Fetch the user by ID using Mongoose
    const user = await User.findById(id); // Mongoose method to find by ID
    console.log("Deserialized user:", user); // Log to verify user retrieval
    if (user) {
      done(null, user); // Attach user to req.user
    } else {
      done(null, false); // User not found
    }
  } catch (err) {
    done(err); // Handle errors
  }
});

module.exports = passport;
