import { useState } from 'react';
import PropTypes from 'prop-types';

const initialState = {
  text: '',
  author: '',
};

export default function AddQuoteForm({ onSubmit, isSubmitting }) {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus(null);

    try {
      await onSubmit(form);
      setStatus({ variant: 'success', message: 'Quote submitted successfully.' });
      setForm(initialState);
    } catch (error) {
      setStatus({ variant: 'error', message: error.message ?? 'Failed to submit quote.' });
    }
  };

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Share a quote</h2>
        <p className="helper-text">Submit uplifting words. Profanity and empty submissions are gently declined.</p>
      </div>
      <form className="form" onSubmit={handleSubmit}>
        <label htmlFor="text">
          Quote
          <textarea
            id="text"
            name="text"
            placeholder="What words would you like to share?"
            value={form.text}
            onChange={handleChange}
            maxLength={1000}
            rows={4}
            required
          />
          <span className="char-count">{form.text.length}/1000</span>
        </label>
        <label htmlFor="author">
          Author
          <input
            id="author"
            name="author"
            placeholder="Who said it?"
            value={form.author}
            onChange={handleChange}
            maxLength={100}
            required
          />
        </label>
        <div className="form-footer">
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Quote'}
          </button>
          <small>All submissions are validated for language before being added to the collection.</small>
        </div>
        {status && (
          <p className={`status-message ${status.variant}`}>{status.message}</p>
        )}
      </form>
    </section>
  );
}

AddQuoteForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
};
