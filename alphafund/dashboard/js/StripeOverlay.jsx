import React, { useEffect, useState } from 'react';
import fetchStripeTotal from '../../utils/fetchStripeTotal.js';

/**
 * StripeOverlay
 * Props:
 *  - refreshMs (number) default 60000
 *  - className (string) optional CSS class
 *
 * Drop this component into any React cockpit/layout. It will call
 * the universal fetchStripeTotal utility on mount and every `refreshMs`.
 */
export default function StripeOverlay({ refreshMs = 60000, className = '' }) {
  const [total, setTotal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchStripeTotal();
        if (!mounted) return;
        if (!data) {
          setError('No data');
          setTotal(null);
        } else {
          setTotal(data);
        }
      } catch (err) {
        if (!mounted) return;
        setError(err?.message || String(err));
        setTotal(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    const id = setInterval(load, refreshMs);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, [refreshMs]);

  return (
    <div className={`stripe-overlay ${className}`} style={{padding: '8px', borderRadius: 6, background: '#0b5cff', color: '#fff', display: 'inline-block', minWidth: 160}}>
      <div style={{fontSize: 12, opacity: 0.9}}>Stripe</div>
      {loading ? (
        <div style={{fontSize: 18, fontWeight: 600, marginTop: 4}}>Loading…</div>
      ) : error ? (
        <div style={{fontSize: 13, color: '#ffdddd', marginTop: 4}}>Error: {error}</div>
      ) : total ? (
        <div style={{fontSize: 20, fontWeight: 700, marginTop: 4}}>${total.totalUSD} {total.currency}</div>
      ) : (
        <div style={{fontSize: 13, marginTop: 4}}>No data</div>
      )}
      <div style={{fontSize: 11, opacity: 0.85, marginTop: 6}}>
        <small>Updated every {Math.round(refreshMs/1000)}s</small>
      </div>
    </div>
  );
}
