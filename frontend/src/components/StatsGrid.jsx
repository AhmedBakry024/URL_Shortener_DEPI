import PropTypes from 'prop-types';

function StatTile({ label, value, accent }) {
  return (
    <div className="stat-tile">
      <span className="stat-label">{label}</span>
      <span className={`stat-value ${accent}`}>{value}</span>
    </div>
  );
}

StatTile.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  accent: PropTypes.oneOf(['primary', 'success', 'warning']),
};

export default function StatsGrid({ stats, isLoading, onRefresh }) {
  return (
    <section className="panel compact">
      <div className="panel-header">
        <h2>Service insights</h2>
        <button type="button" className="btn-tertiary" onClick={onRefresh} disabled={isLoading}>
          {isLoading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      {isLoading ? (
        <p className="placeholder">Crunching the latest numbers...</p>
      ) : stats ? (
        <div className="stats-grid">
          <StatTile label="Quotes in library" value={stats.totalQuotes ?? 0} accent="primary" />
          <StatTile label="Random quote requests" value={stats.totalRandomQuoteRequests ?? 0} accent="success" />
          <StatTile label="Quotes added" value={stats.quotesAdded ?? 0} accent="primary" />
          <StatTile label="Profanity blocked" value={stats.profanityBlocked ?? 0} accent="warning" />
        </div>
      ) : (
        <p className="placeholder">Statistics will appear once the service records activity.</p>
      )}
    </section>
  );
}

StatsGrid.propTypes = {
  stats: PropTypes.shape({
    totalQuotes: PropTypes.number,
    totalRandomQuoteRequests: PropTypes.number,
    quotesAdded: PropTypes.number,
    profanityBlocked: PropTypes.number,
  }),
  isLoading: PropTypes.bool,
  onRefresh: PropTypes.func.isRequired,
};
