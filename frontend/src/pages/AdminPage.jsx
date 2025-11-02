import { useCallback, useMemo, useState } from 'react';
import PageScaffold from '../components/PageScaffold.jsx';
import { deleteQuote, fetchAllQuotes } from '../services/api.js';

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin';

export default function AdminPage() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [authError, setAuthError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [quotes, setQuotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);

  const hasQuotes = useMemo(() => quotes.length > 0, [quotes]);

  const handleCredentialsChange = (event) => {
    const { name, value } = event.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const loadQuotes = useCallback(async () => {
    setIsLoading(true);
    setStatusMessage(null);
    try {
      const payload = await fetchAllQuotes();
      if (payload?.success) {
        setQuotes(payload.data ?? []);
      }
    } catch (error) {
      console.error('Failed to load quotes', error);
      setStatusMessage({ variant: 'error', message: error.message ?? 'Unable to load quotes.' });
    } finally {
      setIsLoading(false);
    }
  }, []);
  const handleLogin = (event) => {
    event.preventDefault();
    if (credentials.username === ADMIN_USERNAME && credentials.password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setAuthError(null);
      loadQuotes();
    } else {
      setAuthError('Invalid username or password. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    setStatusMessage(null);
    try {
      await deleteQuote(id);
      setQuotes((prev) => prev.filter((quote) => quote.id !== id));
      setStatusMessage({ variant: 'success', message: 'Quote deleted successfully.' });
    } catch (error) {
      console.error('Failed to delete quote', error);
      setStatusMessage({ variant: 'error', message: error.message ?? 'Failed to delete quote.' });
    } finally {
      setDeletingId(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <PageScaffold mainClassName="single-column">
        <section className="panel">
          <div className="panel-header">
            <h2>Admin sign in</h2>
          </div>
          <form className="form" onSubmit={handleLogin}>
            <label htmlFor="username">
              Username
              <input
                id="username"
                name="username"
                autoComplete="username"
                value={credentials.username}
                onChange={handleCredentialsChange}
                style={{ color: 'black' }}
                
                required
              />
            </label>
            <label htmlFor="password">
              Password
              <input
                id="password"
                type="password"
                name="password"
                autoComplete="current-password"
                value={credentials.password}
                onChange={handleCredentialsChange}
                
                required
                // black text
                style={{ color: 'black' }}
              />
            </label>
            <div className="form-footer">
              <button type="submit" className="btn-primary">
                Sign in
              </button>
              <small>Use the default credentials admin / admin to manage the quote library.</small>
            </div>
            {authError && <p className="status-message error">{authError}</p>}
          </form>
        </section>
      </PageScaffold>
    );
  }

  return (
    <PageScaffold mainClassName="single-column">
      <section className="panel">
        <div className="panel-header">
          <h2>Quote library</h2>
          <div className="panel-actions">
            <button type="button" className="btn-tertiary" onClick={loadQuotes} disabled={isLoading}>
              {isLoading ? 'Refreshing...' : 'Refresh list'}
            </button>
          </div>
        </div>
        {statusMessage && (
          <p className={`status-message ${statusMessage.variant}`}>{statusMessage.message}</p>
        )}
        {isLoading ? (
          <p className="placeholder">Loading quotes...</p>
        ) : hasQuotes ? (
          <ul className="quote-admin-list">
            {quotes.map((quote) => (
              <li key={quote.id}>
                <div className="quote-admin-details">
                  <p className="quote-text">{quote.text}</p>
                  <p className="quote-meta">
                    <span>— {quote.author}</span>
                    <span className="views">{quote.views} views</span>
                    <span className="timestamp">Added {new Date(quote.created_at).toLocaleString()}</span>
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-danger"
                  onClick={() => handleDelete(quote.id)}
                  disabled={deletingId === quote.id}
                >
                  {deletingId === quote.id ? 'Deleting...' : 'Delete'}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="placeholder">No quotes available. Add some quotes to populate the catalogue.</p>
        )}
      </section>
    </PageScaffold>
  );
}
