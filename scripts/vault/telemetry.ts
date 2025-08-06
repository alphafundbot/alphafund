export async function getStatusSnapshot() {
  // Replace with real vault sync logic
  return {
    nodesOnline: Math.floor(Math.random() * 1000),
    revenueTotal: `$${(Math.random() * 1000000).toFixed(2)}`,
  };
}