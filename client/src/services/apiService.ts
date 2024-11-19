// src/services/apiService.ts
import axios from "axios";

// Use the correct API URL based on your deployment.
const API_URL = "https://my-portfolio-website-3.onrender.com"; // Ensure the URL is correct

// Users API
export const fetchUsers = async () => {
  return await axios.get(`${API_URL}/users`);
};

export const createUser = async (user: { name: string; email: string }) => {
  return await axios.post(`${API_URL}/users`, user);
};

// Projects API
export const fetchProjects = async () => {
  return await axios.get(`${API_URL}/projects`);
};

export const createProject = async (project: {
  title: string;
  description: string;
  link: string;
}) => {
  return await axios.post(`${API_URL}/projects`, project);
};

// Contact API
export const sendMessage = async (contact: {
  name: string;
  email: string;
  message: string;
}) => {
  return await axios.post(`${API_URL}/contact`, contact);
};

// Additional functions for other endpoints can be added here
