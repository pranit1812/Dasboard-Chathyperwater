import { useState, useEffect } from 'react';
import FeedbackTable from './components/FeedbackTable';
import SentimentChart from './components/SentimentChart';
import FilterControls from './components/FilterControls';
import Layout from './components/Layout';
import { mockApi } from './api/mockApi';
import { realApi } from './api/realApi';

// Choose which API to use - mockApi for local storage or realApi for DynamoDB
const api = import.meta.env.PROD ? realApi : mockApi;

function App() {
  const [feedbackData, setFeedbackData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    projectName: '',
    sentiment: '',
    searchMethod: '',
    searchText: ''
  });

  // Clear any existing localStorage data on first load for clean deployment
  useEffect(() => {
    try {
      localStorage.removeItem('feedback-data');
    } catch (err) {
      console.warn('Could not clear localStorage:', err);
    }
  }, []);

  // Fetch feedback data
  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('Fetching data from API');
      
      // Get data from the API (mock or real)
      const data = await api.getFeedback();
      console.log('API response:', data);
      
      if (Array.isArray(data)) {
        setFeedbackData(data);
        setFilteredData(data);
        setError(null);
      } else {
        console.error('Invalid API response format, expected array:', data);
        setError('Invalid data format received from API');
      }
    } catch (err) {
      console.error('API error:', err);
      setError('Failed to fetch feedback data: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Apply filters to data
  useEffect(() => {
    const applyFilters = async () => {
      try {
        setLoading(true);
        // Use the API to filter data
        const filtered = await api.getFeedback(filters);
        setFilteredData(filtered);
      } catch (err) {
        console.error('Error applying filters:', err);
      } finally {
        setLoading(false);
      }
    };

    if (feedbackData.length > 0) {
      applyFilters();
    }
  }, [filters]);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-cyan mb-8">Feedback Dashboard</h1>
        
        {error && (
          <div className="bg-red/20 text-red p-4 rounded-md mb-6">
            {error}
          </div>
        )}
        
        <FilterControls 
          filters={filters} 
          onFilterChange={handleFilterChange} 
          feedbackData={feedbackData}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan"></div>
              </div>
            ) : (
              <FeedbackTable data={filteredData} />
            )}
          </div>
          <div className="bg-light-gray/10 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Sentiment Distribution</h2>
            <SentimentChart data={filteredData} />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default App;
