import PropTypes from 'prop-types';

export default function QuoteCard({ isLoading, quote, onRefresh }) {
  return (
    <section className="panel highlight">
      <div className="panel-header">
        <h2>Quote of the moment</h2>
        <button type="button" className="btn-secondary" onClick={onRefresh} disabled={isLoading}>
          {isLoading ? 'Refreshing...' : 'New Quote'}
        </button>
      </div>
      {isLoading && !quote ? (
        <p className="placeholder">Loading something inspiring...</p>
      ) : quote ? (
        <blockquote>
          <p>{quote.text}</p>
          <footer>
            <span>— {quote.author}</span>
            <span className="views">Served {quote.views} times</span>
          </footer>
        </blockquote>
      ) : (
        <p className="placeholder">No quotes available yet. Be the first to add one!</p>
      )}
    </section>
  );
}

QuoteCard.propTypes = {
  isLoading: PropTypes.bool,
  quote: PropTypes.shape({
    id: PropTypes.number,
    text: PropTypes.string,
    author: PropTypes.string,
    views: PropTypes.number,
  }),
  onRefresh: PropTypes.func.isRequired,
};
