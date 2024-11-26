import { create } from "zustand";
import axios from "axios";

const useUserStore = create((set) => ({
  user: null, // To store user data
  token: null, // To store auth token

  // Signup function
  signup: async (name, email, password) => {
    try {
      const response = await axios.post(`/users/signup`, {
        name,
        email,
        password,
      });
      set({ user: response.data.user, token: response.data.token });
      return response.data;
    } catch (error) {
      console.error(
        "Signup failed:",
        error.response?.data?.message || error.message
      );
      throw error.response?.data?.message || error.message;
    }
  },

  // Login function
  login: async (email, password) => {
    try {
      const response = await axios.post(`/users/login`, { email, password });
      set({ user: response.data.user, token: response.data.token });
      return response.data;
    } catch (error) {
      console.error(
        "Login failed:",
        error.response?.data?.message || error.message
      );
      throw error.response?.data?.message || error.message;
    }
  },

  // Logout function
  logout: () => set({ user: null, token: null }),
}));

export default useUserStore;
