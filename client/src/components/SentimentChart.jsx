import React, { useRef } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const SentimentChart = ({ data }) => {
  const chartRef = useRef(null);

  // Count sentiments
  const sentimentCounts = data.reduce((counts, item) => {
    const sentiment = item.sentiment || 'unknown';
    counts[sentiment] = (counts[sentiment] || 0) + 1;
    return counts;
  }, {});

  // Prepare chart data
  const chartData = {
    labels: [
      'Thumbs Up', 
      'Thumbs Down', 
      'Comment'
    ],
    datasets: [
      {
        data: [
          sentimentCounts.up || 0,
          sentimentCounts.down || 0,
          sentimentCounts.comment || 0
        ],
        backgroundColor: [
          '#22C55E', // Green for up
          '#EF4444', // Red for down
          '#FACC15', // Yellow for comment
        ],
        borderColor: [
          '#0F172A',
          '#0F172A',
          '#0F172A',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#E2E8F0',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
  };

  // If no data, show a message
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-light-gray/50 text-center">No data available for chart</p>
      </div>
    );
  }

  // If all values are 0, show a message
  const totalSentiments = chartData.datasets[0].data.reduce((a, b) => a + b, 0);
  if (totalSentiments === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-light-gray/50 text-center">No sentiment data available</p>
      </div>
    );
  }

  return (
    <div className="h-64 flex items-center justify-center">
      <Pie data={chartData} options={options} ref={chartRef} />
    </div>
  );
};

export default SentimentChart; 