import React, { useMemo } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const UserTypeSentimentChart = ({ data }) => {
  // Calculate sentiment counts for each user type
  const chartData = useMemo(() => {
    // Get all unique user types
    const userTypes = [...new Set(data.map(item => item['user.type'] || 'Unknown'))];
    
    // Count sentiments for each user type
    const sentimentCounts = userTypes.map(userType => {
      const userTypeData = data.filter(item => (item['user.type'] || 'Unknown') === userType);
      
      return {
        userType,
        up: userTypeData.filter(item => item.sentiment === 'up').length,
        down: userTypeData.filter(item => item.sentiment === 'down').length,
        comment: userTypeData.filter(item => item.sentiment === 'comment').length
      };
    });
    
    // Sort by user type alphabetically
    return sentimentCounts.sort((a, b) => a.userType.localeCompare(b.userType));
  }, [data]);
  
  // Map user types to more readable labels
  const getUserTypeLabel = (type) => {
    switch(type) {
      case 'GC': return 'General Contractor';
      case 'SUB': return 'Subcontractor'; 
      case 'SUPP': return 'Supplier';
      case 'NONE': return 'None';
      default: return type;
    }
  };
  
  // Create pie chart data for each user type
  const createPieData = (userTypeData) => {
    const total = userTypeData.up + userTypeData.down + userTypeData.comment;
    
    // If there's no data, return empty data with a message
    if (total === 0) {
      return {
        labels: ['No Data'],
        datasets: [
          {
            data: [1],
            backgroundColor: ['rgba(156, 163, 175, 0.6)'],
            borderColor: ['rgba(156, 163, 175, 1)'],
            borderWidth: 1,
          }
        ]
      };
    }

    return {
      labels: ['Thumbs Up', 'Thumbs Down', 'Comments'],
      datasets: [
        {
          data: [userTypeData.up, userTypeData.down, userTypeData.comment],
          backgroundColor: [
            'rgba(16, 185, 129, 0.6)', // Green for thumbs up
            'rgba(239, 68, 68, 0.6)',  // Red for thumbs down
            'rgba(59, 130, 246, 0.6)'  // Blue for comments
          ],
          borderColor: [
            'rgba(16, 185, 129, 1)',
            'rgba(239, 68, 68, 1)',
            'rgba(59, 130, 246, 1)'
          ],
          borderWidth: 1,
        }
      ]
    };
  };
  
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#a8b3cf', // Light gray text
          font: {
            family: "'Inter', sans-serif",
            size: 12
          },
          padding: 15
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)', // Deep navy with transparency
        titleColor: '#a8b3cf',
        bodyColor: '#a8b3cf',
        titleFont: {
          family: "'Inter', sans-serif",
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          family: "'Inter', sans-serif",
          size: 13
        },
        padding: 12,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const dataset = context.dataset.data;
            const total = dataset.reduce((acc, data) => acc + data, 0);
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
            return `${label}: ${value} (${percentage}%)`;
          }
        },
        displayColors: true,
        borderColor: 'rgba(59, 130, 246, 0.3)',
        borderWidth: 1
      }
    }
  };
  
  return (
    <div className="w-full h-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {chartData.map((userTypeData) => (
          <div key={userTypeData.userType} className="flex flex-col items-center">
            <h3 className="text-lg font-medium text-cyan mb-2">{getUserTypeLabel(userTypeData.userType)}</h3>
            <div className="h-52 w-full">
              <Pie 
                data={createPieData(userTypeData)} 
                options={pieOptions} 
              />
            </div>
            <div className="mt-2 text-light-gray text-sm text-center">
              Total Feedback: {userTypeData.up + userTypeData.down + userTypeData.comment}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserTypeSentimentChart; 