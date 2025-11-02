import PropTypes from 'prop-types';
import { endpoints } from '../config';

export default function ServiceStatus({ health, isLoading }) {
  const isHealthy = health?.success;
  const statusLabel = isLoading ? 'Checking...' : isHealthy ? 'Operational' : 'Unavailable';

  return (
    <section className="panel compact status">
      <div className="status-header">
        <div className={`status-indicator ${isHealthy ? 'online' : 'offline'}`} aria-hidden="true" />
        <div>
          <h3>API status</h3>
          <span className="status-label">{statusLabel}</span>
        </div>
      </div>
      <ul className="status-list">
        <li>
          <span>Health endpoint</span>
          <a href={endpoints.health} target="_blank" rel="noreferrer">
            View response
          </a>
        </li>
        <li>
          <span>Metrics endpoint</span>
          <a href={endpoints.metrics} target="_blank" rel="noreferrer">
            Prometheus format
          </a>
        </li>
      </ul>
      {health?.timestamp && (
        <p className="status-footer">Last checked: {new Date(health.timestamp).toLocaleString()}</p>
      )}
    </section>
  );
}

ServiceStatus.propTypes = {
  health: PropTypes.shape({
    success: PropTypes.bool,
    status: PropTypes.string,
    timestamp: PropTypes.string,
  }),
  isLoading: PropTypes.bool,
};
