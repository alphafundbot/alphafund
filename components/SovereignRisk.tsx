import { Bar } from 'react-chartjs-2';

export function SovereignRisk() {
  const chartData = {
    labels: ['us-west', 'eu-central', 'ap-southeast'],
    datasets: [
      {
        label: 'Risk Score',
        data: [42, 78, 55],
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
      },
    ],
  };

  return (
    <div>
      <h2>📉 Sovereign Risk Index</h2>
      <Bar data={chartData} />
    </div>
  );
}