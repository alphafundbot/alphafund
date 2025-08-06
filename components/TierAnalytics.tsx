import { Line } from 'react-chartjs-2';

export function TierAnalytics() {
  const chartData = {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [
      {
        label: 'Tier-1',
        data: [120, 100, 80, 60],
        borderColor: 'rgba(255, 99, 132, 1)',
      },
      {
        label: 'Tier-2',
        data: [80, 90, 100, 110],
        borderColor: 'rgba(54, 162, 235, 1)',
      },
      {
        label: 'Tier-3',
        data: [40, 60, 80, 100],
        borderColor: 'rgba(75, 192, 192, 1)',
      },
    ],
  };

  return (
    <div>
      <h2>📈 Tier Prediction Analytics</h2>
      <Line data={chartData} />
    </div>
  );
}