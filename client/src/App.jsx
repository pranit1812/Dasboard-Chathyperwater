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

  const handleDeleteFeedback = async (id) => {
    try {
      setLoading(true);
      await api.deleteFeedback(id);
      await fetchData(); // Refresh data after deletion
      setError(null);
    } catch (err) {
      console.error('Error deleting feedback:', err);
      setError('Failed to delete feedback: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEngineerFeedback = async (id, feedback) => {
    try {
      await api.updateEngineerFeedback(id, feedback);
      // No need to refresh data since we're updating the feedback in the UI directly
    } catch (err) {
      console.error('Error updating engineer feedback:', err);
      setError('Failed to update engineer feedback: ' + (err.message || 'Unknown error'));
    }
  };

  // Calculate counts for each sentiment
  const upCount = filteredData.filter(item => item.sentiment === 'up').length;
  const downCount = filteredData.filter(item => item.sentiment === 'down').length;
  const commentCount = filteredData.filter(item => item.sentiment === 'comment').length;
  const totalCount = filteredData.length;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-cyan mb-6">Feedback Dashboard</h1>
        
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
        
        <div className="mt-8">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan"></div>
            </div>
          ) : (
            <div className="mb-6">
              <div className="mb-2">
                <h2 className="text-xl font-semibold text-light-gray">
                  Feedback Data <span className="ml-2 text-cyan">({totalCount})</span>
                </h2>
              </div>
              
              {/* Full-width table with scroll functionality */}
              <div className="max-h-[600px] overflow-y-auto mb-6 border border-light-gray/10 rounded-lg">
                <FeedbackTable 
                  data={filteredData} 
                  onDelete={handleDeleteFeedback}
                  onUpdateEngineerFeedback={handleUpdateEngineerFeedback}
                />
              </div>
              
              {/* Sentiment distribution chart below the table - only show if we have data */}
              {filteredData.length > 0 && (
                <div className="bg-deep-navy/30 p-6 rounded-lg border border-light-gray/10">
                  {/* Main layout - chart on left, cards on right */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Chart on the left with centered heading */}
                    <div className="flex flex-col">
                      <h2 className="text-xl font-semibold text-cyan text-center mb-4">Sentiment Distribution</h2>
                      <div className="flex justify-center items-center flex-grow">
                        <div className="w-72 h-72">
                          <SentimentChart data={filteredData} />
                        </div>
                      </div>
                    </div>
                    
                    {/* Sentiment breakdown on the right with centered heading */}
                    <div className="flex flex-col justify-center">
                      <h2 className="text-xl font-semibold text-cyan text-center mb-4">Sentiment Breakdown</h2>
                      <div className="flex flex-col space-y-4">
                        <div className="flex items-center p-3 rounded bg-sentiment-up/10">
                          <span className="text-2xl mr-3">😊</span>
                          <div>
                            <div className="text-sentiment-up font-semibold">{upCount} Thumbs Up</div>
                            <div className="text-sm text-light-gray/70">{totalCount > 0 ? Math.round((upCount / totalCount) * 100) : 0}% of total</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center p-3 rounded bg-sentiment-down/10">
                          <span className="text-2xl mr-3">😞</span>
                          <div>
                            <div className="text-sentiment-down font-semibold">{downCount} Thumbs Down</div>
                            <div className="text-sm text-light-gray/70">{totalCount > 0 ? Math.round((downCount / totalCount) * 100) : 0}% of total</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center p-3 rounded bg-sentiment-comment/10">
                          <span className="text-2xl mr-3">🤔</span>
                          <div>
                            <div className="text-sentiment-comment font-semibold">{commentCount} Comment</div>
                            <div className="text-sm text-light-gray/70">{totalCount > 0 ? Math.round((commentCount / totalCount) * 100) : 0}% of total</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default App;
