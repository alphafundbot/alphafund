import { useEffect, useState } from 'react';
import { firestore } from '../lib/firebase';

export function StrategistDashboard() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore
      .collection('mesh/compliance-events')
      .orderBy('timestamp', 'desc')
      .limit(50)
      .onSnapshot(snapshot => {
        const data = snapshot.docs.map(doc => doc.data());
        setEvents(data);
      });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h2>🛡️ Compliance Events</h2>
      <ul>
        {events.map((event, idx) => (
          <li key={idx}>
            <strong>{event.status.toUpperCase()}</strong> — {event.reason}  
            <br />
            <small>{event.route.source.region} → {event.route.destination.region}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}