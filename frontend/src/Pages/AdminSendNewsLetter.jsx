import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import AdminNavbar from "../components/AdminNavbar";
import Footer from "../components/Footer";

const AdminSendNewsLetter = () => {
  const [sections, setSections] = useState([]); // Array of sections

  // Handle adding a new section
  const addSection = () => {
    setSections((prev) => [
      ...prev,
      { content: "", images: [] }, // Initialize a new section
    ]);
  };

  // Handle updating a section's content
  const updateSectionContent = (index, value) => {
    const updatedSections = [...sections];
    updatedSections[index].content = value;
    setSections(updatedSections);
  };

  // Handle image upload for a specific section
  const handleImageUpload = async (index) => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/admin/api/uploadImage", {
        method: "POST",
        body: formData,
      });

      const { url } = await response.json();

      // Update the images for the specific section
      const updatedSections = [...sections];
      updatedSections[index].images.push(url); // Add the image URL
      setSections(updatedSections);

      // Optionally insert the image into the editor
      const quill = document.querySelector(
        `.ql-editor[data-id="${index}"]`
      )?.__quill;
      const range = quill.getSelection();
      if (range) {
        quill.insertEmbed(range.index, "image", url);
      }
    };
  };

  // Combine content and images into the desired format
  const formatSections = () => {
    return sections
      .map(
        (section) =>
          `${section.content}${section.images
            .map((url) => `URL${url}`)
            .join("")}`
      )
      .join(""); // Combine all sections into one string
  };

  // Handle submission
  const handleSubmit = async () => {
    const formattedContent = formatSections(); // Get the formatted content
    const response = await fetch("admin/api/sendnewsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: formattedContent }),
    });

    if (response.ok) {
      alert("Newsletter sent successfully!");
    } else {
      alert("Failed to send newsletter");
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-gray-100 py-10">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-700 mb-4">
            Send Newsletter
          </h1>

          {/* Dynamic Sections */}
          {sections.map((section, index) => (
            <div key={index} className="mb-6">
              <ReactQuill
                value={section.content}
                onChange={(value) => updateSectionContent(index, value)}
                theme="snow"
                className="mb-4 rounded-lg border border-gray-300 shadow-sm ql-editor"
                data-id={index} // Custom attribute to target editor
              />

              <button
                onClick={() => handleImageUpload(index)}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow focus:outline-none"
              >
                Upload Image
              </button>

              {/* Display Uploaded Images */}
              {section.images.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {section.images.map((url, imgIndex) => (
                    <div
                      key={imgIndex}
                      className="w-full h-24 bg-gray-100 border rounded-lg overflow-hidden"
                    >
                      <img
                        src={url}
                        alt={`Uploaded ${imgIndex + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          <button
            onClick={addSection}
            className="px-6 py-2 mb-4 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-lg shadow focus:outline-none"
          >
            Add Section
          </button>

          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow focus:outline-none"
          >
            Send Newsletter
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminSendNewsLetter;
