import { create } from "zustand";
import axios from "axios";

const useItineraryStore = create((set) => ({
  itineraries: [], // Initially empty
  loading: false,
  error: null,

  // Function to fetch all itineraries
  fetchItineraries: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get("admin/api/getitineraries"); // Replace with your API endpoint
      set({ itineraries: response.data, loading: false });
    } catch (err) {
      set({ error: "Failed to fetch itineraries", loading: false });
    }
  },

  // Function to fetch and add a single itinerary
  fetchItineraryById: async (id) => {
    try {
      console.log("Fetching itinerary with ID:", id);
      const url = `admin/api/itinerary/${id}`;
      console.log("Request URL:", url);

      const response = await axios.get(url);
      console.log("Fetched Itinerary Data:", response.data);

      set((state) => ({
        itineraries: [
          ...state.itineraries.filter((it) => it._id !== id),
          response.data,
        ],
      }));
    } catch (err) {
      console.error(
        "Failed to fetch itinerary by ID",
        err.response?.data || err.message
      );
    }
  },
}));

export default useItineraryStore;
