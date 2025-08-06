import { useState, useEffect } from 'react';
import { updateJurisdiction, fetchJurisdictionMap } from '../lib/jurisdictionService';

export function JurisdictionEditor() {
  const [map, setMap] = useState<Record<string, any>>({});

  useEffect(() => {
    fetchJurisdictionMap().then(setMap);
  }, []);

  const updateRegion = async (region: string, allowed: string[], tier: string) => {
    const updated = {
      ...map,
      [region]: {
        allowedRegions: allowed,
        tierOverride: tier
      },
    };
    setMap(updated);
  return (
    <div>
      <h2>🗺️ Jurisdiction Map Editor</h2>
      {Object.entries(map).map(([region, config]) => (
        <div key={region}>
          <h4>{region}</h4>
          <label>Allowed Regions:</label>
          <input
            type="text"
            defaultValue={config.allowedRegions.join(',')}
            onBlur={e => updateRegion(region, e.target.value.split(','), config.tierOverride)}
          />
          <label>Tier Override:</label>
          <select
            defaultValue={config.tierOverride}
            onChange={e => updateRegion(region, config.allowedRegions, e.target.value)}
          >
            <option value="Tier-1">Tier-1</option>
            <option value="Tier-2">Tier-2</option>
            <option value="Tier-3">Tier-3</option>
          </select>
        </div>
      ))}
    </div>
  );
}