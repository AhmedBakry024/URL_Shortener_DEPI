import PropTypes from 'prop-types';

export default function Header({ lastUpdated }) {
  return (
    <header className="app-header">
      <div>
        <p className="kicker">Quote Generator Service</p>
        <h1>Inspirational quotes at your fingertips.</h1>
        <p className="subtitle">
          Browse random quotes, contribute your own words of wisdom, and keep an eye on service health.
        </p>
      </div>
      {/* <div className="header-meta">
        <span className="status-pill available">API Available</span>
        {lastUpdated && (
          <span className="timestamp">Last refreshed: {lastUpdated.toLocaleTimeString()}</span>
        )}
      </div> */}
    </header>
  );
}

Header.propTypes = {
  lastUpdated: PropTypes.instanceOf(Date),
};
