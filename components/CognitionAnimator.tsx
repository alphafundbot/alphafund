import { useEffect, useState } from 'react';

export function CognitionAnimator() {
  const [frame, setFrame] = useState(0);
  const frames = [
    'Signal Ingress',
    'Violation Detected',
    'Heuristic Rewrite',
    'Route Adjusted',
    'Tier Prediction Updated',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(f => (f + 1) % frames.length);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>🧠 Animated Cognition Overlay</h2>
      <p>{frames[frame]}</p>
    </div>
  );
}