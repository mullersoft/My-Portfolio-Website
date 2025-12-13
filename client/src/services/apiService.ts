import axios from "axios";

// Get the API URL from environment variables
//production
const API_URL = "https://my-portfolio-website-z18d.onrender.com";
//development
// const API_URL = "http://localhost:5000";

//const API_URL = process.env.REACT_APP_API_URL;

// Users API
export const fetchUsers = async () => {
  return await axios.get(`${API_URL}/users`);
};

export const createUser = async (user: { name: string; email: string }) => {
  return await axios.post(`${API_URL}/users`, user);
};

// Projects API
export const fetchProjects = async () => {
  //production
  return await axios.get(`${API_URL}/projects`);
  //development
    // return await axios.get('/projects'); // no need for full URL

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
  // contact/frontend
  return await axios.post(`${API_URL}/contact/frontend`, contact);
};

export const askChatbot = (message: string) => {
  return axios.post(`${API_URL}/chatgpt/ask`, {
    prompt: message,
  });
};
