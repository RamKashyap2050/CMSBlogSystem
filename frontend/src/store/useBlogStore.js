import { create } from "zustand";

const blogData = [
  {
    id: 1,
    title: "Trekking the Majestic Kedarkantha",
    image: "https://s3.ap-south-1.amazonaws.com/townscript-production/images/198cd855-d5ea-402d-b19f-4e6923ed85d5.jpg", // Replace with a high-quality Kedarkantha image
    description:
      "Discover the thrill of trekking through the snow-laden trails of Kedarkantha in the Indian Himalayas.",
    content:
      "Kedarkantha was an adventure of a lifetime. The trek began in the small, picturesque village of Sankri, where the crisp mountain air and stunning pine forests set the tone for the journey ahead. As I ascended the trails, the dense forests opened up to vast meadows blanketed in snow. Every step felt like walking through a winter wonderland, with snowflakes catching the sunlight and creating a surreal, sparkling landscape. The summit climb was steep and challenging, but the view from the top was worth every ounce of effort. Standing at 12,500 feet, surrounded by a 360-degree panorama of snow-capped peaks, I felt an overwhelming sense of accomplishment and connection with nature. Kedarkantha isn’t just a trek; it’s a journey into the serenity of the mountains and a test of one’s spirit.",
  },
  {
    id: 2,
    title: "Exploring the Cape Breton Highlands",
    image:
      "https://www.cbisland.com/content/uploads/2019/10/7-natural-wonders-of-cape-breton-18-e1570639526102-1024x1024.jpg", // Replace with Cape Breton image
    description:
      "Experience the breathtaking beauty of Cape Breton's rugged coastlines and lush highlands.",
    content:
      "Cape Breton was a dreamscape of dramatic cliffs, winding roads, and endless ocean views. Driving along the iconic Cabot Trail, I was constantly stopping to take in the mesmerizing vistas of the Gulf of St. Lawrence. The trail led me to hidden beaches, where the waves whispered secrets of the Atlantic. Hiking in the Cape Breton Highlands National Park brought me face-to-face with moose and bald eagles, a true testament to the area’s rich biodiversity. The sunsets here were unforgettable—vibrant hues of orange and pink painting the sky as the ocean shimmered below. Cape Breton isn’t just a place to visit; it’s a journey into nature’s raw and untamed beauty.",
  },
  {
    id: 3,
    title: "Wandering Through Paris: The City of Lights",
    image:
      "https://wallpaperaccess.com/full/288027.jpg", // Replace with Paris image
    description:
      "Stroll through the romantic streets of Paris, where history, culture, and art come alive.",
    content:
      "Paris has a magic that’s impossible to describe but easy to feel. As I wandered along the Seine, passing iconic landmarks like Notre Dame and the Louvre, I couldn’t help but be swept away by the city’s charm. Every cobblestone street seemed to tell a story, every café inviting me to sit and savor a warm croissant. Standing beneath the Eiffel Tower, glittering against the night sky, was a moment I’ll never forget. The beauty of Montmartre, with its bohemian vibes and stunning views, took my breath away. Whether it was sipping coffee at a sidewalk café or marveling at the art in the Musée d’Orsay, Paris was an experience that left an indelible mark on my soul.",
  },
  {
    id: 4,
    title: "Adventures in Goa: Sun, Sand, and Serenity",
    image:
      "https://spicytourist.com/wp-content/uploads/2023/02/Cabo-De-Rama-Beach.jpg", // Replace with Goa image
    description:
      "Dive into the vibrant culture and stunning beaches of Goa, India’s tropical paradise.",
    content:
      "Goa is more than just a destination; it’s a vibe. My days here were filled with golden beaches, swaying palm trees, and the rhythmic sound of waves. From the bustling markets of Anjuna to the quiet, serene shores of Palolem, every corner of Goa had its own unique charm. I spent hours exploring the Portuguese-inspired architecture, visiting ancient churches, and enjoying the delicious fusion of Indian and Western cuisines. The nights came alive with vibrant music, bonfires, and starlit skies. Goa’s laid-back lifestyle, combined with its natural beauty and cultural richness, made it a place I never wanted to leave.",
  },
];

// Zustand store
const useBlogStore = create((set) => ({
  blogs: blogData, // Initial blog data
  getBlogById: (id) => blogData.find((blog) => blog.id === parseInt(id)), // Helper function to fetch blog by ID
}));

export default useBlogStore;
