import { useEffect, useState } from 'react';
import { firestore } from '../lib/firebase';
import { Bar } from 'react-chartjs-2';
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export function ComplianceHeatmap() {
  const [violationData, setViolationData] = useState<Record<string, number>>({});

  useEffect(() => {
    const unsubscribe = firestore
      .collection('mesh/compliance-events')
      .where('status', '==', 'non-compliant')
      .onSnapshot(snapshot => {
        const counts: Record<string, number> = {};
        snapshot.forEach(doc => {
          const reason = doc.data().reason || 'Unknown';
          counts[reason] = (counts[reason] || 0) + 1;
        });
        setViolationData(counts);
      });

    return () => unsubscribe();
  }, []);

  const chartData = {
    labels: Object.keys(violationData),
    datasets: [
      {
        label: 'Violation Count',
        data: Object.values(violationData),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  return (
    <div>
      <h2>🔥 Violation Heatmap</h2>
      <Bar data={chartData} />
    </div>
  );
}