// src/services/apiService.ts
import axios from "axios";

const API_URL = "http://localhost:5000";

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

// Additional functions for other endpoints (e.g., contact form) can be added here
