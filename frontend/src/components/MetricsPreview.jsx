import { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

const displayedMetrics = [
  'quotes_served_total',
  'quotes_added_total',
  'profanity_blocked_total',
];

export default function MetricsPreview({ rawMetrics, onRefresh, isLoading }) {
  const filteredMetrics = useMemo(() => {
    if (!rawMetrics) return [];
    const lines = rawMetrics.split('\n');
    return lines.filter((line) => displayedMetrics.some((metric) => line.startsWith(metric)));
  }, [rawMetrics]);

  useEffect(() => {
    const timer = setInterval(() => {
      onRefresh();
    }, 30000);
    return () => clearInterval(timer);
  }, [onRefresh]);

  return (
    <section className="panel compact">
      <div className="panel-header">
        <h2>Observability</h2>
        <button type="button" className="btn-tertiary" onClick={onRefresh} disabled={isLoading}>
          {isLoading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      {filteredMetrics.length ? (
        <pre className="metrics-preview">
          {filteredMetrics.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </pre>
      ) : (
        <p className="placeholder">
          Metrics will appear once Prometheus counters are generated. The panel refreshes every 30 seconds.
        </p>
      )}
    </section>
  );
}

MetricsPreview.propTypes = {
  rawMetrics: PropTypes.string,
  onRefresh: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};
