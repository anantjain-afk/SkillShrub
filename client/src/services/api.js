const API_URL = 'http://localhost:3000/api';

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
};

export const generateRoadmap = async (topic) => {
    // Get userId from storage
    const user = JSON.parse(localStorage.getItem('user'));
    
  try {
    const response = await fetch(`${API_URL}/roadmaps/generate`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ 
          topic,
          userId: user ? user.id : null 
      }),
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.roadmap;
  } catch (error) {
    console.error("Failed to generate roadmap:", error);
    throw error;
  }
};

export const getUserRoadmaps = async (userId) => {
    const response = await fetch(`${API_URL}/roadmaps/user/${userId}`, {
        headers: getHeaders()
    });
    return await response.json();
};

export const getRoadmap = async (id) => {
    const response = await fetch(`${API_URL}/roadmaps/${id}`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error("Roadmap not found");
    return await response.json();
};

export const updateProgress = async (userId, nodeId, status) => {
    const response = await fetch(`${API_URL}/progress/update`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ userId, nodeId, status })
    });
    return await response.json();
};

export const getUserProgress = async (userId) => {
    const response = await fetch(`${API_URL}/progress/${userId}`, {
        headers: getHeaders()
    });
    return await response.json();
};
