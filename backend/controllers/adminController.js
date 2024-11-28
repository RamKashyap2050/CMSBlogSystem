const asyncHandler = require("express-async-handler");
const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Blogs = require("../models/Blogs");
const { uploadImageToS3 } = require("../s3/s3");
const Itinerary = require("../models/Iternary");
const IternaryDay = require("../models/IternaryDay");
const OpenAI = require("openai");


const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please enter all the fields");
  }

  const admin = await Admin.findOne({ email });
  if (admin && (await bcrypt.compare(password, admin.password))) {
    res.status(200).json({
      _id: admin.id,
      user_name: admin.admin_name,
      phone: admin.phone,
      email: admin.email,
      token: await generateToken(admin.id),
    });
  } else {
    res.status(400);
    throw new Error("Incorrect Admin credentails");
  }
});

const CreateBlog = asyncHandler(async (req, res) => {
  const { title, description, content, adminId } = req.body;
  const file = req.files.image;

  if (!title || !content || !file) {
    return res.status(403).send({ message: "Please enter all fields" });
  }

  let fileUrl = "";
  let isImage = false;
  let isVideo = false;

  if (file.mimetype.startsWith("image/")) {
    fileUrl = await uploadImageToS3(file);
    isImage = true;
  } else if (file.mimetype.startsWith("video/")) {
    fileUrl = await uploadImageToS3(file);
    isVideo = true;
  } else {
    return res.status(400).send({ message: "Unsupported file type" });
  }

  const blogs = await Blogs.create({
    title,
    content,
    description,
    post_image: isImage ? fileUrl : "",
    VideoUrl: isVideo ? fileUrl : "",
    adminId: adminId, // Set the "user" field to the authenticated user's ID
  });

  res.status(200).json(blogs);
});

// Get all blogs with selected fields
const getBlogs = asyncHandler(async (req, res) => {
  try {
    const getallposts = await Blogs.find().select("title description post_image");
    res.status(200).json(getallposts);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch blogs", error: error.message });
  }
});

const getSingleBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const singleBlog = await Blogs.findById(id)
    .populate("adminId", "name email") // Populate adminId with name and email
    .populate("liked_by", "user_name email image") // Populate liked_by with user details
    .populate({
      path: "comments",
      populate: [
        {
          path: "user_id", // Assuming comments have a user_id field
          select: "user_name email image", // Include only name, email, and image from User model
        },
        {
          path: "admin_id", // Assuming comments have an admin_id field for admin replies
          select: "admin_name email image", // Include only name and email from Admin model
        },
      ],
    });
  

    if (!singleBlog) {
      res.status(404).json({ message: "Blog not found" });
      return;
    }

    res.status(200).json(singleBlog);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch the blog", error: error.message });
  }
});


const createIternary = asyncHandler(async (req, res) => {
  const { destination, totalDays, totalNights, adminId } = req.body;
  const file = req.files.photos;

  try {
    if (!file) {
      res.status(400);
      throw new Error("Photos are required.");
    }

    // Upload image to S3 and get the file URL
    const fileUrl = await uploadImageToS3(file);

    // Create the itinerary document in the database
    const itinerary = await Itinerary.create({
      destination: destination,
      totalDays: totalDays,
      totalNights: totalNights,
      adminId: adminId,
      photos: fileUrl,
    });

    res.status(201).json({
      message: "Itinerary created successfully",
      itineraryId: itinerary._id, // Return the new itinerary's ID
    });
  } catch (error) {
    console.error("Error creating itinerary:", error.message);
    res.status(500);
    throw new Error("Failed to create itinerary");
  }
});

const addItineraryDay = asyncHandler(async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    console.log("Request Files:", req.files);

    const { storedItineraryId } = req.body;

    // Validate required fields
    if (!storedItineraryId) {
      res.status(400);
      throw new Error("Itinerary ID is required.");
    }

    // Validate the itinerary existence
    const itinerary = await Itinerary.findById(storedItineraryId);
    if (!itinerary) {
      res.status(404);
      throw new Error("Itinerary not found.");
    }

    // Reconstruct `days` from `req.body`
    const days = [];
    const dayKeys = Object.keys(req.body).filter((key) =>
      key.startsWith("days[")
    );

    dayKeys.forEach((key) => {
      const match = key.match(
        /days\[(\d+)\]\[([^\]]+)\](?:\[(\d+)\]\[([^\]]+)\])?/
      );

      if (match) {
        const [, dayIndex, dayField, activityIndex, activityField] = match;

        // Ensure day exists
        days[dayIndex] = days[dayIndex] || { dayNumber: "", activities: [] };

        if (activityIndex !== undefined) {
          // Ensure activity exists
          days[dayIndex].activities[activityIndex] = days[dayIndex].activities[
            activityIndex
          ] || {
            name: "",
            description: "",
            image: null,
          };

          // Assign activity field
          if (activityField) {
            days[dayIndex].activities[activityIndex][activityField] =
              req.body[key];
          }
        } else {
          // Assign day field
          days[dayIndex][dayField] = req.body[key];
        }
      }
    });

    // Attach file URLs to activities
    for (const fileKey in req.files) {
      const match = fileKey.match(
        /days\[(\d+)\]\[activities\]\[(\d+)\]\[image\]/
      );

      if (match) {
        const [, dayIndex, activityIndex] = match;
        const file = req.files[fileKey];

        // Upload file and assign URL
        const imageUrl = await uploadImageToS3(file);
        days[dayIndex].activities[activityIndex].image = imageUrl;
      }
    }

    console.log("Reconstructed Days:", JSON.stringify(days, null, 2));

    // Save days to the database
    const savedDays = await Promise.all(
      days.map(async (day) => {
        const itineraryDay = new IternaryDay({
          itinerary: storedItineraryId,
          dayNumber: day.dayNumber,
          activities: day.activities,
        });

        return await itineraryDay.save();
      })
    );

    res.status(201).json({
      message: "Itinerary days added successfully",
      days: savedDays,
    });
  } catch (error) {
    console.error("Error in addItineraryDay:", error.message);
    res.status(500).json({ message: error.message });
  }
});

const ViewIternaries = asyncHandler(async (req, res) => {
  try {
    const itineraries = await Itinerary.find(); // Use `await` to resolve the promise
    res.status(200).json(itineraries); // Set the status before sending the response
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch itineraries", error: error.message });
  }
});

const ViewSingleIternary = asyncHandler(async (req, res) => {
  const { itineraryId } = req.params; // Extract itineraryId from the request parameters
  console.log("I came here", itineraryId);
  try {
    // Validate the itinerary ID
    if (!itineraryId) {
      res.status(400);
      throw new Error("Itinerary ID is required.");
    }

    // Fetch the itinerary
    const itinerary = await Itinerary.findById(itineraryId);
    if (!itinerary) {
      res.status(404);
      throw new Error("Itinerary not found.");
    }

    // Fetch the days and activities related to the itinerary
    const days = await IternaryDay.find({ itinerary: itineraryId });

    // Combine the itinerary and its related days
    const itineraryWithDays = {
      ...itinerary.toObject(), // Convert Mongoose document to plain object
      days,
    };
    console.log(itineraryWithDays);

    res.status(200).json(itineraryWithDays);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch the itinerary.",
      error: error.message,
    });
  }
});

const addAdminReply = asyncHandler(async (req, res) => {
  const { id } = req.params; // Blog ID
  const { commentId, admin_id, reply } = req.body;
  console.log(commentId, admin_id, reply)
  try {
    // Find the specific blog and update the relevant comment
    const updatedBlog = await Blogs.findOneAndUpdate(
      {
        _id: id,
        "comments._id": commentId, // Locate the specific comment within the blog
      },
      {
        $set: {
          "comments.$.admin_reply": reply, // Update the admin_reply field
          "comments.$.admin_id": admin_id, // Add the admin_id field
        },
      },
      { new: true } // Return the updated document
    ).populate("comments.user_id", "user_name email image") // Populate user details in comments
      .populate("comments.admin_id", "admin_name email image"); // Populate admin details

    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog or comment not found." });
    }

    res.status(200).json({ message: "Reply added successfully.", updatedBlog });
  } catch (error) {
    console.error("Error adding reply:", error);
    res.status(500).json({ message: "Error adding reply.", error: error.message });
  }
});

//Toggle the like for Comment
const togglecommentlike = asyncHandler(async(req,res) => {
  try {
    const { blogId, commentId } = req.params;
    const { admin_liked_comment } = req.body;
    console.log( blogId, commentId, admin_liked_comment )

    // Find the blog and update the specific comment
    const updatedBlog = await Blogs.findOneAndUpdate(
      { _id: blogId, "comments._id": commentId },
      {
        $set: {
          "comments.$.admin_liked_comment": admin_liked_comment,
        },
      },
      { new: true } // Return the updated document
    );

    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog or comment not found" });
    }

    res.status(200).json({ message: "Admin like toggled", updatedBlog });
  } catch (error) {
    console.error("Error toggling admin like:", error);
    res.status(500).json({ message: "Internal server error" });
  }
})
const generateTravelContent = asyncHandler(async (req, res) => {
  const { title } = req.body;
  console.log(title)
  if (!title) {
    return res.status(400).json({
      success: false,
      message: "Title is required.",
    });
  }

  try {
    const prompt = `
      You are a vivid traveler and creative content writer. Your task is to generate
      a short description and detailed content for a travel destination based on the title provided below.

      Title: ${title}

      Guidelines:
      1. Create a captivating short description (2-3 sentences) summarizing the essence of the place.
      2. Write detailed content (150-200 words) elaborating on its history, attractions, and why it is worth visiting.
      3. Use an engaging and vivid storytelling style as if you are writing for a travel blog.

      Return the output in the following JSON format:
      {
        "shortdescription": "<short description>",
        "content": "<detailed content>"
      }
    `;

    const openai = new OpenAI();
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-2024-08-06", // Replace with your preferred model
      messages: [{ role: "user", content: prompt }],
    });

    // Get response text
    let generatedOutput = completion.choices[0].message.content;

    // Clean up response by removing Markdown formatting
    generatedOutput = generatedOutput.replace(/```json|```/g, "").trim();

    // Parse JSON
    const structuredOutput = JSON.parse(generatedOutput);
    console.log(structuredOutput)
    res.status(200).json({
      success: true,
      data: structuredOutput,
    });
  } catch (error) {
    console.error("Error generating travel content:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while generating travel content.",
      error: error.message,
    });
  }
});


//Function to generate tokens
const generateToken = async (id) => {
  return await jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = {
  loginAdmin,
  CreateBlog,
  getBlogs,
  getSingleBlog,
  createIternary,
  addItineraryDay,
  ViewIternaries,
  ViewSingleIternary,
  addAdminReply,
  togglecommentlike,
  generateTravelContent
};
