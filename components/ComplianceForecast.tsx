import { Line } from 'react-chartjs-2';

export function ComplianceForecast() {
  const chartData = {
    labels: ['Today', 'Tomorrow', 'Next Week'],
    datasets: [
      {
        label: 'Predicted Violations',
        data: [12, 18, 25],
        borderColor: 'rgba(255, 99, 132, 1)',
      },
    ],
  };

  return (
    <div>
      <h2>📊 Compliance Forecast</h2>
      <Line data={chartData} />
    </div>
  );
}