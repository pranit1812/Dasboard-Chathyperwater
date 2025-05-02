import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
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
  
  // Format chart data for Chart.js
  const barChartData = {
    labels: chartData.map(item => getUserTypeLabel(item.userType)),
    datasets: [
      {
        label: 'Thumbs Up',
        data: chartData.map(item => item.up),
        backgroundColor: 'rgba(16, 185, 129, 0.6)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1,
      },
      {
        label: 'Thumbs Down',
        data: chartData.map(item => item.down),
        backgroundColor: 'rgba(239, 68, 68, 0.6)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1,
      },
      {
        label: 'Comments',
        data: chartData.map(item => item.comment),
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#a8b3cf', // Light gray text
          font: {
            family: "'Inter', sans-serif",
          }
        }
      },
      title: {
        display: false
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
        displayColors: true,
        borderColor: 'rgba(59, 130, 246, 0.3)',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#a8b3cf',
          font: {
            family: "'Inter', sans-serif",
          },
        },
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0, // Only show whole numbers
          color: '#a8b3cf',
          font: {
            family: "'Inter', sans-serif",
          },
        },
        grid: {
          color: 'rgba(168, 179, 207, 0.1)', // Very faint grid lines
        }
      },
    },
  };
  
  return (
    <div className="w-full h-full">
      <Bar data={barChartData} options={options} />
    </div>
  );
};

export default UserTypeSentimentChart; 