import { StaticMap } from 'react-map-gl';
import DeckGL from '@deck.gl/react';
import { ScatterplotLayer } from '@deck.gl/layers';

const meshNodes = [
  { coordinates: [-122.4, 37.8], region: 'us-west', tier: 'Tier-2' },
  { coordinates: [13.4, 52.5], region: 'eu-central', tier: 'Tier-3' },
];

export function GeoMeshMap() {
  const layers = [
    new ScatterplotLayer({
      id: 'mesh-nodes',
      data: meshNodes,
      getPosition: d => d.coordinates,
      getRadius: 10000,
      getFillColor: d => d.tier === 'Tier-3' ? [255, 99, 132] : [54, 162, 235],
      pickable: true,
    }),
  ];

  return (
    <DeckGL
      initialViewState={{
        longitude: 0,
        latitude: 20,
        zoom: 1.5,
        pitch: 0,
        bearing: 0,
      }}
      controller={true}
      layers={layers}
    >
      <StaticMap mapboxAccessToken="YOUR_MAPBOX_TOKEN" />
    </DeckGL>
  );
}