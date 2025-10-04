import axios from 'axios';

const API_URL = 'http://localhost:4000/api/projects/';

// Create a new project
const createProject = async (projectData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL, projectData, config);
  return response.data;
};

// Get a single project by ID
const getProject = async (projectId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL + projectId, config);
  return response.data;
};

// Update an existing project
const updateProject = async (projectId, projectData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.put(API_URL + projectId, projectData, config);
    return response.data;
};


const projectService = {
  createProject,
  getProject,
  updateProject,
};

export default projectService;