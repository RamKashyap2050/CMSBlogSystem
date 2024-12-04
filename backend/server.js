const express = require("express");
const path = require("path");
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const fileupload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const passport = require("./config/passportConfg");
const userroutes = require("./routes/userRoutes");
const adminroutes = require("./routes/adminRoutes");
const PORT = process.env.PORT;
connectDB();
const app = express();
// Middleware
app.use(cors());
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://cms-blog-system.vercel.app/"
        : "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieParser("RamKashyap"));
app.use(fileupload());
app.use(express.json());

// Session Configuration
app.use(
  session({
    secret: process.env.SECRET_KEY || "RamKashyap", // Secret for signing cookies
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI, // MongoDB connection string
      collectionName: "sessions", // Collection name for session data
      ttl: 30 * 24 * 60 * 60, // Session expiration in seconds (30 days)
    }),
    proxy: true, // Required for Heroku & Digital Ocean (regarding X-Forwarded-For)
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // Cookie expiration (30 days)
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  })
);

app.use((req, res, next) => {
  console.log(
    "Session data after login:",
    JSON.stringify(req.session, null, 2)
  );
  next();
});

app.use(passport.initialize());
app.use(passport.session());

app.use("/users", userroutes);
app.use("/admin/api", adminroutes);

// Serve static files
app.use(express.static(path.join(__dirname, "../frontend/dist")));
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) =>
    res.sendFile(
      path.resolve(__dirname, "../", "frontend", "dist", "index.html")
    )
  );
} else {
  app.get("/", (req, res) => res.send("Please Activate Production"));
}
app.listen(PORT, () => console.log(`Server is running at ${PORT}`));

module.exports = app;
