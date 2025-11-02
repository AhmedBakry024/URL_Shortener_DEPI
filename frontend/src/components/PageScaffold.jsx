import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import Header from './Header.jsx';

export default function PageScaffold({ isBusy = false, lastUpdated, mainClassName = 'grid', children }) {
  const layoutClassName = isBusy ? 'app busy' : 'app';
  const navLinkClassName = ({ isActive }) => (isActive ? 'active' : undefined);

  return (
    <div className={layoutClassName}>
      <Header lastUpdated={lastUpdated} />
      <nav className="app-nav">
        <NavLink to="/" end className={navLinkClassName}>Quotes</NavLink>
        <NavLink to="/add" className={navLinkClassName}>Add Quote</NavLink>
        <NavLink to="/admin" className={navLinkClassName}>Admin</NavLink>
      </nav>
      <main className={mainClassName}>{children}</main>
      <footer className="app-footer">
        <p>
          Designed for operational excellence. Explore the{' '}
          <a href="https://prometheus.io" target="_blank" rel="noreferrer">Prometheus</a> metrics or extend the UI to fit your needs.
        </p>
      </footer>
    </div>
  );
}

PageScaffold.propTypes = {
  isBusy: PropTypes.bool,
  lastUpdated: PropTypes.instanceOf(Date),
  mainClassName: PropTypes.string,
  children: PropTypes.node.isRequired,
};
