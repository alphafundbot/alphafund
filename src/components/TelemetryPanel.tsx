import React from 'react';

interface Props {
  signalLevel: 'online' | 'offline' | 'degraded';
  accessLevel: 'online' | 'offline' | 'degraded';
}

export const TelemetryPanel: React.FC<Props> = ({ signalLevel, accessLevel }) => {
  return (
    <div className="bg-black text-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Telemetry Overview</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-400">Mesh Entropy</p>
          <p className={`text-lg font-semibold ${getColor(signalLevel)}`}>{signalLevel}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Access Integrity</p>
          <p className={`text-lg font-semibold ${getColor(accessLevel)}`}>{accessLevel}</p>
        </div>
      </div>
    </div>
  );
};

function getColor(level: string) {
  switch (level) {
    case 'online':
      return 'text-green-400';
    case 'degraded':
      return 'text-yellow-400';
    case 'offline':
      return 'text-red-400';
    default:
      return 'text-gray-400';
  }
}