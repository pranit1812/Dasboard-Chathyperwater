import React, { useMemo } from 'react';

const FilterControls = ({ filters, onFilterChange, feedbackData }) => {
  // Extract unique values for filter dropdowns
  const uniqueValues = useMemo(() => {
    const projectNames = new Set();
    const searchMethods = new Set();
    
    feedbackData.forEach(item => {
      if (item.projectName) projectNames.add(item.projectName);
      if (item.searchMethod) searchMethods.add(item.searchMethod);
    });
    
    return {
      projectNames: Array.from(projectNames).sort(),
      searchMethods: Array.from(searchMethods).sort(),
    };
  }, [feedbackData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFilterChange(name, value);
  };
  
  const handleSentimentChange = (sentiment) => {
    onFilterChange('sentiment', filters.sentiment === sentiment ? '' : sentiment);
  };
  
  const clearFilters = () => {
    onFilterChange('projectName', '');
    onFilterChange('sentiment', '');
    onFilterChange('searchMethod', '');
    onFilterChange('searchText', '');
  };
  
  return (
    <div className="bg-light-gray/5 p-6 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-light-gray">Filters</h2>
        <button 
          onClick={clearFilters}
          className="text-cyan hover:text-purple text-sm"
        >
          Clear all filters
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Project Name Filter */}
        <div>
          <label 
            htmlFor="projectName" 
            className="block text-sm font-medium text-light-gray/80 mb-1"
          >
            Project
          </label>
          <select
            id="projectName"
            name="projectName"
            value={filters.projectName}
            onChange={handleInputChange}
            className="w-full rounded-md border-light-gray/20 bg-deep-navy text-light-gray p-2 focus:border-cyan focus:ring-1 focus:ring-cyan"
          >
            <option value="">All Projects</option>
            {uniqueValues.projectNames.map(project => (
              <option key={project} value={project}>
                {project}
              </option>
            ))}
          </select>
        </div>
        
        {/* Sentiment Filter */}
        <div>
          <p className="block text-sm font-medium text-light-gray/80 mb-1">
            Sentiment
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => handleSentimentChange('up')}
              className={`px-3 py-1 rounded-md text-sm ${
                filters.sentiment === 'up'
                  ? 'bg-sentiment-up text-white'
                  : 'bg-sentiment-up/20 text-light-gray hover:bg-sentiment-up/30'
              }`}
            >
              👍 Up
            </button>
            <button
              onClick={() => handleSentimentChange('down')}
              className={`px-3 py-1 rounded-md text-sm ${
                filters.sentiment === 'down'
                  ? 'bg-sentiment-down text-white'
                  : 'bg-sentiment-down/20 text-light-gray hover:bg-sentiment-down/30'
              }`}
            >
              👎 Down
            </button>
            <button
              onClick={() => handleSentimentChange('comment')}
              className={`px-3 py-1 rounded-md text-sm ${
                filters.sentiment === 'comment'
                  ? 'bg-sentiment-comment text-deep-navy'
                  : 'bg-sentiment-comment/20 text-light-gray hover:bg-sentiment-comment/30'
              }`}
            >
              💬 Comment
            </button>
          </div>
        </div>
        
        {/* Search Method Filter */}
        <div>
          <label 
            htmlFor="searchMethod" 
            className="block text-sm font-medium text-light-gray/80 mb-1"
          >
            Search Method
          </label>
          <select
            id="searchMethod"
            name="searchMethod"
            value={filters.searchMethod}
            onChange={handleInputChange}
            className="w-full rounded-md border-light-gray/20 bg-deep-navy text-light-gray p-2 focus:border-cyan focus:ring-1 focus:ring-cyan"
          >
            <option value="">All Methods</option>
            {uniqueValues.searchMethods.map(method => (
              <option key={method} value={method}>
                {method.charAt(0).toUpperCase() + method.slice(1)}
              </option>
            ))}
          </select>
        </div>
        
        {/* Text Search */}
        <div>
          <label 
            htmlFor="searchText" 
            className="block text-sm font-medium text-light-gray/80 mb-1"
          >
            Text Search
          </label>
          <input
            type="text"
            id="searchText"
            name="searchText"
            value={filters.searchText}
            onChange={handleInputChange}
            placeholder="Search in queries and answers..."
            className="w-full rounded-md border-light-gray/20 bg-deep-navy text-light-gray p-2 focus:border-cyan focus:ring-1 focus:ring-cyan"
          />
        </div>
      </div>
    </div>
  );
};

export default FilterControls; 