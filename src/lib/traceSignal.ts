export function traceSignal(category: string, nodeId: string, status: string): void {
  console.log(`[SIGNAL TRACE] Category: ${category}, Node ID: ${nodeId}, Status: ${status}`);
}