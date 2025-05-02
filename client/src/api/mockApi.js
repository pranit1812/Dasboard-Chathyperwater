// Mock API implementation for local development and Vercel deployment

// Initial sample feedback data
const initialData = [
  {
    id: 'resp-001',
    projectName: 'Project Alpha',
    query: 'How do I implement feature X?',
    answer: 'You can use the following approach...',
    sentiment: 'up',
    'user.id': 'user-001',
    'user.email': 'user1@example.com',
    searchMethod: 'local',
    commentText: 'Great response!'
  },
  {
    id: 'resp-002',
    projectName: 'Project Beta',
    query: 'Why isn\'t feature Y working?',
    answer: 'There seems to be an issue with...',
    sentiment: 'down',
    'user.id': 'user-002',
    'user.email': 'user2@example.com',
    searchMethod: 'api',
    commentText: 'This didn\'t solve my problem'
  },
  {
    id: 'resp-003',
    projectName: 'Project Alpha',
    query: 'Can you explain how Z works?',
    answer: 'Z is a functionality that...',
    sentiment: 'comment',
    'user.id': 'user-003',
    'user.email': 'user3@example.com',
    searchMethod: 'local',
    commentText: 'I need more details'
  }
];

// Use localStorage to persist data between page reloads if available
let feedbackStore = [...initialData];

try {
  const storedData = localStorage.getItem('feedback-data');
  if (storedData) {
    const parsedData = JSON.parse(storedData);
    if (Array.isArray(parsedData)) {
      feedbackStore = parsedData;
    }
  }
} catch (e) {
  console.warn('Failed to load data from localStorage:', e);
}

// Save to localStorage when data changes
const saveData = () => {
  try {
    localStorage.setItem('feedback-data', JSON.stringify(feedbackStore));
  } catch (e) {
    console.warn('Failed to save data to localStorage:', e);
  }
};

// API methods
export const mockApi = {
  // Get feedback with optional filters
  async getFeedback(filters = {}) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    let filteredData = [...feedbackStore];
    
    // Apply filters
    const { projectName, sentiment, searchMethod, searchText } = filters;
    
    if (projectName) {
      filteredData = filteredData.filter(item => item.projectName === projectName);
    }
    
    if (sentiment) {
      filteredData = filteredData.filter(item => item.sentiment === sentiment);
    }
    
    if (searchMethod) {
      filteredData = filteredData.filter(item => item.searchMethod === searchMethod);
    }
    
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      filteredData = filteredData.filter(item => 
        item.query?.toLowerCase().includes(searchLower) || 
        item.answer?.toLowerCase().includes(searchLower) ||
        item.commentText?.toLowerCase().includes(searchLower)
      );
    }
    
    return filteredData;
  },
  
  // Add new feedback
  async addFeedback(feedback) {
    // Validate required fields
    if (!feedback.id || !feedback.projectName || !feedback.sentiment) {
      throw new Error('Missing required fields: id, projectName, sentiment');
    }
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Add to store
    feedbackStore.push(feedback);
    saveData();
    
    return { success: true };
  }
}; 