import React, { useState } from 'react';

const FeedbackTable = ({ data, onDelete, onUpdateEngineerFeedback }) => {
  const [sortField, setSortField] = useState('projectName');
  const [sortDirection, setSortDirection] = useState('asc');
  const [expandedRow, setExpandedRow] = useState(null);
  const [engineerFeedback, setEngineerFeedback] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [selectionMode, setSelectionMode] = useState(false);

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

  const handleEngineerFeedbackChange = (id, value) => {
    const updatedFeedback = { ...engineerFeedback, [id]: value };
    setEngineerFeedback(updatedFeedback);
    if (onUpdateEngineerFeedback) {
      onUpdateEngineerFeedback(id, value);
    }
  };

  const startEditingFeedback = (id) => {
    setEditingFeedback(id);
  };

  const stopEditingFeedback = () => {
    setEditingFeedback(null);
  };

  const handleRowSelection = (id) => {
    setSelectedRows(prev => {
      if (prev.includes(id)) {
        return prev.filter(rowId => rowId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedRows.length === data.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(data.map(item => item.id));
    }
  };

  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode);
    if (selectionMode) {
      // Clear selections when exiting selection mode
      setSelectedRows([]);
    }
  };

  const exportSelectedToCSV = () => {
    if (selectedRows.length === 0) return;
    
    const selectedData = data.filter(item => selectedRows.includes(item.id));
    let csvContent = 'data:text/csv;charset=utf-8,';
    
    // Add Headers
    const headers = [
      'Project Name', 
      'Sentiment', 
      'Search Method', 
      'Query', 
      'Comment', 
      'Answer', 
      'User Email',
      'User Type',
      'Engineer Feedback'
    ].join(',');
    csvContent += headers + '\r\n';
    
    // Add Rows
    selectedData.forEach(item => {
      let row = [
        `"${item.projectName || ''}"`,
        `"${item.sentiment || ''}"`,
        `"${item.searchMethod || ''}"`,
        `"${(item.query || '').replace(/"/g, '""')}"`,
        `"${(item.commentText || '').replace(/"/g, '""')}"`,
        `"${(item.answer || '').replace(/"/g, '""')}"`,
        `"${item['user.email'] || ''}"`,
        `"${item['user.type'] || ''}"`,
        `"${(engineerFeedback[item.id] || item.engineerFeedback || '').replace(/"/g, '""')}"`
      ].join(',');
      csvContent += row + '\r\n';
    });
    
    // Create download link and click it
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `feedback_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper function to get sentiment color
  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'up':
        return 'bg-green-500/10 text-green-500';
      case 'down':
        return 'bg-red-500/10 text-red-500';
      case 'comment':
        return 'bg-yellow-500/10 text-yellow-500';
      default:
        return 'bg-light-gray/10 text-light-gray';
    }
  };

  // Helper function to get sentiment emoji
  const getSentimentEmoji = (sentiment) => {
    switch (sentiment) {
      case 'up':
        return '👍';
      case 'down':
        return '👎';
      case 'comment':
        return '💬';
      default:
        return '❓';
    }
  };

  // Helper function to get sentiment label (for screen readers and tooltips)
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

  // Helper function to get user type label
  const getUserTypeLabel = (type) => {
    switch (type) {
      case 'GC': return 'General Contractor';
      case 'SUB': return 'Subcontractor';
      case 'SUPP': return 'Supplier';
      case 'NONE': return 'None';
      default: return type || 'Unknown';
    }
  };

  // Helper function to get user type color
  const getUserTypeColor = (type) => {
    switch (type) {
      case 'GC': return 'bg-cyan/10 text-cyan';
      case 'SUB': return 'bg-purple/10 text-purple';
      case 'SUPP': return 'bg-green-500/10 text-green-500';
      case 'NONE': return 'bg-light-gray/10 text-light-gray';
      default: return 'bg-light-gray/10 text-light-gray';
    }
  };

  // Truncate text with ellipsis for preview
  const truncateText = (text, maxLength = 50) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="bg-deep-navy rounded-lg border border-light-gray/10">
      <div className="p-3 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          {selectionMode && (
            <input 
              type="checkbox" 
              checked={selectedRows.length === data.length && data.length > 0}
              onChange={handleSelectAll}
              className="mr-2 h-4 w-4 bg-deep-navy border border-light-gray/30 rounded text-cyan focus:ring-purple"
            />
          )}
          <button
            onClick={toggleSelectionMode}
            className={`px-3 py-1 rounded ${selectionMode ? 'bg-purple text-deep-navy' : 'bg-light-gray/20 text-light-gray hover:bg-light-gray/30'}`}
          >
            {selectionMode ? 'Cancel Selection' : 'Select Rows'}
          </button>
          {selectionMode && <span className="text-light-gray">{selectedRows.length} selected</span>}
        </div>
        {selectionMode && selectedRows.length > 0 && (
          <button 
            onClick={exportSelectedToCSV}
            className="px-3 py-1 rounded bg-cyan text-deep-navy hover:bg-cyan/80"
          >
            Export Selected to CSV
          </button>
        )}
      </div>
      <div className="overflow-x-auto">
        {data.length === 0 ? (
          <div className="p-8 text-center text-light-gray/50">
            No feedback data available. Try adjusting your filters.
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-deep-navy/80 border-b border-light-gray/10">
                {selectionMode && (
                  <th className="px-2 py-3 text-center">
                    <span className="sr-only">Select</span>
                  </th>
                )}
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
                <th 
                  className="px-4 py-3 text-left cursor-pointer hover:text-cyan"
                  onClick={() => handleSort('user.type')}
                >
                  User Type
                  {sortField === 'user.type' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th className="px-4 py-3 text-left">Query</th>
                <th className="px-4 py-3 text-left">Comment</th>
                <th className="px-4 py-3 text-left">Engineer Feedback</th>
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
                    {selectionMode && (
                      <td className="px-2 py-3 text-center">
                        <input 
                          type="checkbox" 
                          checked={selectedRows.includes(feedback.id)}
                          onChange={() => handleRowSelection(feedback.id)}
                          className="h-4 w-4 bg-deep-navy border border-light-gray/30 rounded text-cyan focus:ring-purple"
                        />
                      </td>
                    )}
                    <td className="px-4 py-3">{feedback.projectName}</td>
                    <td className="px-4 py-3">
                      <span 
                        className={`inline-flex items-center justify-center rounded-full w-8 h-8 ${getSentimentColor(feedback.sentiment)}`}
                        title={getSentimentLabel(feedback.sentiment)}
                      >
                        <span className="text-lg">{getSentimentEmoji(feedback.sentiment)}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 capitalize">{feedback.searchMethod}</td>
                    <td className="px-4 py-3">
                      {feedback['user.type'] && (
                        <span className={`inline-flex items-center px-2 py-1 rounded ${getUserTypeColor(feedback['user.type'])}`}>
                          {getUserTypeLabel(feedback['user.type'])}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 truncate max-w-xs">{feedback.query}</td>
                    <td className="px-4 py-3 truncate max-w-xs">{feedback.commentText || '-'}</td>
                    <td className="px-4 py-3">
                      {editingFeedback === feedback.id ? (
                        <div className="relative">
                          <textarea
                            value={engineerFeedback[feedback.id] || feedback.engineerFeedback || ''}
                            onChange={(e) => handleEngineerFeedbackChange(feedback.id, e.target.value)}
                            className="w-full h-24 bg-deep-navy border border-light-gray/30 rounded p-2 text-light-gray focus:border-cyan focus:ring-1 focus:ring-cyan"
                            placeholder="Add detailed feedback..."
                          />
                          <div className="flex justify-end mt-2">
                            <button 
                              onClick={stopEditingFeedback}
                              className="px-3 py-1 bg-cyan hover:bg-purple text-deep-navy font-medium rounded"
                            >
                              Done
                            </button>
                          </div>
                        </div>
                      ) : (
                        engineerFeedback[feedback.id] || feedback.engineerFeedback ? (
                          <div 
                            onClick={() => startEditingFeedback(feedback.id)}
                            className="min-h-[40px] p-2 border border-transparent hover:border-light-gray/30 rounded cursor-pointer"
                          >
                            <p className="whitespace-pre-wrap text-light-gray">
                              {truncateText(engineerFeedback[feedback.id] || feedback.engineerFeedback, 100)}
                            </p>
                          </div>
                        ) : (
                          <div 
                            onClick={() => startEditingFeedback(feedback.id)}
                            className="min-h-[40px] p-2 border border-light-gray/30 rounded bg-deep-navy hover:bg-light-gray/5 cursor-text"
                          >
                            <p className="text-light-gray/40">Click to add engineer feedback...</p>
                          </div>
                        )
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center space-x-2">
                        <button 
                          onClick={() => toggleRowExpansion(feedback.id)}
                          className="text-cyan hover:text-purple"
                          title={expandedRow === feedback.id ? "Hide details" : "Show details"}
                        >
                          {expandedRow === feedback.id ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                        </button>
                        <button 
                          onClick={() => onDelete(feedback.id)}
                          className="text-sentiment-down hover:text-red"
                          title="Delete"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m5-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedRow === feedback.id && (
                    <tr className="bg-light-gray/5">
                      <td colSpan={selectionMode ? 9 : 8} className="px-6 py-4">
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
                            <div className="flex flex-col space-y-2">
                              <p className="text-sm">Email: {feedback['user.email']}</p>
                              <p className="text-sm">Type: 
                                <span className={`ml-2 inline-flex items-center px-2 py-1 rounded text-sm ${getUserTypeColor(feedback['user.type'])}`}>
                                  {getUserTypeLabel(feedback['user.type'])}
                                </span>
                              </p>
                            </div>
                            
                            <h4 className="font-semibold mt-4 mb-2 text-cyan">Engineer Feedback</h4>
                            <div className="mt-2">
                              {editingFeedback === feedback.id ? (
                                <div className="relative">
                                  <textarea
                                    value={engineerFeedback[feedback.id] || feedback.engineerFeedback || ''}
                                    onChange={(e) => handleEngineerFeedbackChange(feedback.id, e.target.value)}
                                    className="w-full h-24 bg-deep-navy border border-light-gray/30 rounded p-2 text-light-gray focus:border-cyan focus:ring-1 focus:ring-cyan"
                                    placeholder="Add detailed feedback..."
                                  />
                                  <div className="flex justify-end mt-2">
                                    <button 
                                      onClick={stopEditingFeedback}
                                      className="px-3 py-1 bg-cyan hover:bg-purple text-deep-navy font-medium rounded"
                                    >
                                      Done
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex space-x-2">
                                  <p className="text-sm whitespace-pre-wrap flex-grow">
                                    {engineerFeedback[feedback.id] || feedback.engineerFeedback || 'No engineer feedback provided yet'}
                                  </p>
                                  <button 
                                    onClick={() => startEditingFeedback(feedback.id)}
                                    className="text-cyan hover:text-purple text-sm"
                                  >
                                    Edit
                                  </button>
                                </div>
                              )}
                            </div>
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
    </div>
  );
};

export default FeedbackTable; 