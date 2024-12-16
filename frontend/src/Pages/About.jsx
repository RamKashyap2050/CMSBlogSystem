import React from "react";
import Footer from "../components/Footer";
import profile from "../varsha.jpg";
import Navbar from "../components/Navbar";
import view1 from "../view1.mp4"; // Adjust the path as needed

const About = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Hero Section */}
        <div className="relative w-full h-96 flex items-center justify-center">
          {/* Video Background */}
          <video
            className="absolute inset-0 w-full h-full object-cover z-0"
            src={view1}
            autoPlay
            loop
            muted
            playsInline // Prevent fullscreen on mobile
            disablePictureInPicture // Optional: Prevent PiP mode
          ></video>

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70"></div>

          {/* Content */}
          <div className="relative z-10 text-center px-4">
            <h1
              className="text-white text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent p-6 rounded-lg"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Hi, I'm Varsha Reddy
            </h1>
            <p className="text-gray-300 text-base sm:text-lg mt-4 max-w-xl mx-auto">
              Welcome to my world of travel and exploration. Join me as I share
              stories, tips, and adventures from around the globe.
            </p>
          </div>
        </div>

        {/* About Section */}
        <div className="max-w-6xl mx-auto mt-10 p-6">
          <div className="flex flex-col lg:flex-row items-center bg-white rounded-lg shadow-lg">
            {/* Image Section */}
            <div className="w-full lg:w-1/3 p-6">
              <img
                src={profile} // Replace with your actual image
                alt="Varsha Reddy"
                className="rounded-lg shadow-md object-cover w-full h-96"
              />
            </div>

            {/* Text Section */}
            <div className="w-full lg:w-2/3 p-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                About Me
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                My name is Varsha Reddy, and I am an adventurer at heart. By
                day, I work as a software engineer in Canada, and by night (or
                weekend, to be precise), I explore new destinations, climb
                mountains, and immerse myself in different cultures. Born and
                raised in India, my roots have instilled in me a profound love
                for nature, travel, and discovery. These passions have guided my
                life and are the inspiration behind my website,{" "}
                <strong>As I Travel</strong>.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed mt-4">
                Through <strong>As I Travel</strong>, I share stories of my
                adventures, from the serene beaches of Goa and the snowy peaks
                of Kedarkantha in India to the picturesque streets of Paris and
                the breathtaking Cape Breton in Canada. For me, travel is not
                just about seeing new places; it's about embracing new
                experiences, meeting amazing people, and creating moments that
                take my breath away.{" "}
                <strong>
                  <a
                    href="https://asitravel.in"
                    className="text-blue-500 hover:underline"
                  >
                    asitravel.in
                  </a>
                </strong>{" "}
                is a place where I connect with fellow wanderers and inspire
                others to explore the world.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-10 p-6">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              My Travel Highlights
            </h2>

            {/* Timeline Container */}
            <div className="relative">
              {/* Vertical Line for Large Screens */}
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full border-l-4 border-blue-300"></div>

              {/* Section 1 */}
              <div className="mb-12 flex flex-col md:flex-row items-center">
                <div className="w-full md:w-1/2 md:pr-8 text-left md:text-right">
                  <h3 className="text-2xl font-semibold text-blue-600 mb-2">
                    India
                  </h3>
                  <p className="text-gray-700">
                    As an Indian by birth, my love for India runs deep. Whether
                    it's the beaches of Goa, the lush greenery of Coorg, or the
                    spiritual aura of Amritsar, every place holds a special
                    place in my heart. Completing the Kedarkantha Trek was an
                    unforgettable experience, and it's one of the many reasons
                    why I feel most at home in the mountains.
                  </p>
                </div>
                <div className="relative flex-shrink-0 hidden md:flex">
                  <div className="w-8 h-8 bg-blue-300 rounded-full flex items-center justify-center text-white font-bold">
                    ✈️
                  </div>
                </div>
                <div className="w-full md:w-1/2"></div>
              </div>

              {/* Section 2 */}
              <div className="mb-12 flex flex-col md:flex-row-reverse items-center">
                <div className="w-full md:w-1/2 md:pl-8 text-left">
                  <h3 className="text-2xl font-semibold text-blue-600 mb-2">
                    Canada
                  </h3>
                  <p className="text-gray-700">
                    Living in Canada has given me the chance to explore stunning
                    landscapes and vibrant cities. From the bustling streets of
                    Toronto to the serene beauty of Nova Scotia and Cape Breton,
                    I’ve fallen in love with the breathtaking nature and the
                    hospitality of the people here.
                  </p>
                </div>
                <div className="relative flex-shrink-0 hidden md:flex">
                  <div className="w-8 h-8 bg-blue-300 rounded-full flex items-center justify-center text-white font-bold">
                    ✈️
                  </div>
                </div>
                <div className="w-full md:w-1/2"></div>
              </div>

              {/* Section 3 */}
              <div className="mb-12 flex flex-col md:flex-row items-center">
                <div className="w-full md:w-1/2 md:pr-8 text-left md:text-right">
                  <h3 className="text-2xl font-semibold text-blue-600 mb-2">
                    Europe
                  </h3>
                  <p className="text-gray-700">
                    My European adventures have taken me from the majestic Alps
                    in Austria to the romantic streets of Paris in France.
                    Germany, with its historic charm, and the Czech Republic,
                    with its cobblestone streets, have left lasting impressions
                    on me.
                  </p>
                </div>
                <div className="relative flex-shrink-0 hidden md:flex">
                  <div className="w-8 h-8 bg-blue-300 rounded-full flex items-center justify-center text-white font-bold">
                    ✈️
                  </div>
                </div>
                <div className="w-full md:w-1/2"></div>
              </div>

              {/* Section 4 */}
              <div className="mb-12 flex flex-col md:flex-row-reverse items-center">
                <div className="w-full md:w-1/2 md:pl-8 text-left">
                  <h3 className="text-2xl font-semibold text-blue-600 mb-2">
                    Trekking and Mountaineering
                  </h3>
                  <p className="text-gray-700">
                    Trekking and mountaineering have always been my favorite
                    ways to challenge myself. The Kedarkantha Trek in the Indian
                    Himalayas stands out as one of the toughest yet most
                    rewarding journeys I've undertaken. There's something
                    magical about standing at the summit, surrounded by
                    snow-capped peaks and a sense of accomplishment.
                  </p>
                </div>
                <div className="relative flex-shrink-0 hidden md:flex">
                  <div className="w-8 h-8 bg-blue-300 rounded-full flex items-center justify-center text-white font-bold">
                    ✈️
                  </div>
                </div>
                <div className="w-full md:w-1/2"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Closing Section */}
        <div className="max-w-6xl mx-auto mt-10 p-6">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Let's Explore Together!
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              Whether it’s trekking up a snowy mountain, strolling through the
              vibrant streets of a new city, or discovering hidden gems, I
              believe there’s a world of adventures waiting to be explored.
              Through <strong>As I Travel</strong>, I invite you to join me on
              this exciting journey of exploration. Together, let’s uncover
              breathtaking destinations and create unforgettable memories!
            </p>
            <p className="text-gray-700 text-lg leading-relaxed mt-4">
              I’d love to hear from you! Feel free to share your favorite travel
              stories, ask for tips, or simply say hi. Connect with me through{" "}
              <strong>As I Travel</strong> and let’s inspire each other to keep
              discovering the beauty of this incredible world. Visit{" "}
              <strong>
                <a
                  href="https://asitravel.in"
                  className="text-blue-500 hover:underline"
                >
                  asitravel.in
                </a>
              </strong>{" "}
              to explore more travel tales, guides, and tips for your next
              adventure.
            </p>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
};

export default About;
