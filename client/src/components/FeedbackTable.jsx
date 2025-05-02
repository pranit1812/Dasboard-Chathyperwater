import React, { useState } from 'react';

const FeedbackTable = ({ data }) => {
  const [sortField, setSortField] = useState('projectName');
  const [sortDirection, setSortDirection] = useState('asc');
  const [expandedRow, setExpandedRow] = useState(null);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    const aValue = a[sortField] || '';
    const bValue = b[sortField] || '';
    
    if (sortDirection === 'asc') {
      return aValue.toString().localeCompare(bValue.toString());
    } else {
      return bValue.toString().localeCompare(aValue.toString());
    }
  });

  const toggleRowExpansion = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  // Helper function to get sentiment color
  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'up':
        return 'bg-sentiment-up/10 text-sentiment-up';
      case 'down':
        return 'bg-sentiment-down/10 text-sentiment-down';
      case 'comment':
        return 'bg-sentiment-comment/10 text-sentiment-comment';
      default:
        return 'bg-light-gray/10 text-light-gray';
    }
  };

  // Helper function to get sentiment label
  const getSentimentLabel = (sentiment) => {
    switch (sentiment) {
      case 'up':
        return 'Thumbs Up';
      case 'down':
        return 'Thumbs Down';
      case 'comment':
        return 'Comment';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="overflow-x-auto bg-deep-navy rounded-lg border border-light-gray/10">
      {data.length === 0 ? (
        <div className="p-8 text-center text-light-gray/50">
          No feedback data available. Try adjusting your filters.
        </div>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="bg-deep-navy/80 border-b border-light-gray/10">
              <th 
                className="px-4 py-3 text-left cursor-pointer hover:text-cyan"
                onClick={() => handleSort('projectName')}
              >
                Project
                {sortField === 'projectName' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                className="px-4 py-3 text-left cursor-pointer hover:text-cyan"
                onClick={() => handleSort('sentiment')}
              >
                Sentiment
                {sortField === 'sentiment' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                className="px-4 py-3 text-left cursor-pointer hover:text-cyan"
                onClick={() => handleSort('searchMethod')}
              >
                Method
                {sortField === 'searchMethod' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th className="px-4 py-3 text-left">Query</th>
              <th className="px-4 py-3 text-left">Comment</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((feedback) => (
              <React.Fragment key={feedback.id}>
                <tr 
                  className={`border-b border-light-gray/10 hover:bg-light-gray/5 ${
                    expandedRow === feedback.id ? 'bg-light-gray/5' : ''
                  }`}
                >
                  <td className="px-4 py-3">{feedback.projectName}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-1 rounded ${getSentimentColor(feedback.sentiment)}`}>
                      {getSentimentLabel(feedback.sentiment)}
                    </span>
                  </td>
                  <td className="px-4 py-3 capitalize">{feedback.searchMethod}</td>
                  <td className="px-4 py-3 truncate max-w-xs">{feedback.query}</td>
                  <td className="px-4 py-3 truncate max-w-xs">{feedback.commentText || '-'}</td>
                  <td className="px-4 py-3 text-center">
                    <button 
                      onClick={() => toggleRowExpansion(feedback.id)}
                      className="text-cyan hover:text-purple"
                    >
                      {expandedRow === feedback.id ? 'Hide' : 'Details'}
                    </button>
                  </td>
                </tr>
                {expandedRow === feedback.id && (
                  <tr className="bg-light-gray/5">
                    <td colSpan={6} className="px-6 py-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2 text-cyan">Query</h4>
                          <p className="text-sm whitespace-pre-wrap">{feedback.query}</p>
                          
                          <h4 className="font-semibold mt-4 mb-2 text-cyan">Answer</h4>
                          <p className="text-sm whitespace-pre-wrap">{feedback.answer}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2 text-cyan">Comment</h4>
                          <p className="text-sm whitespace-pre-wrap">{feedback.commentText || 'No comment provided'}</p>
                          
                          <h4 className="font-semibold mt-4 mb-2 text-cyan">User</h4>
                          <p className="text-sm">{feedback['user.email']}</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FeedbackTable; 