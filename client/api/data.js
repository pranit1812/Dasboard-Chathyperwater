// In-memory data store
export let feedbackStore = [
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