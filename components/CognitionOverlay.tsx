import { Line } from 'react-chartjs-2';

export function CognitionOverlay() {
  const chartData = {
    labels: ['14:00', '14:01', '14:02', '14:03'],
    datasets: [
      {
        label: 'Heuristic Confidence',
        data: [0.6, 0.4, 0.8, 0.9],
        borderColor: 'rgba(75, 192, 192, 1)',
      },
    ],
  };

  return (
    <div>
      <h2>🧠 Cognition Overlay</h2>
      <Line data={chartData} />
    </div>
  );
}