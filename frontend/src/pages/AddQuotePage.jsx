import { useCallback, useState } from 'react';
import PageScaffold from '../components/PageScaffold.jsx';
import AddQuoteForm from '../components/AddQuoteForm.jsx';
import { createQuote } from '../services/api.js';

export default function AddQuotePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleQuoteSubmit = useCallback(async ({ text, author }) => {
    setIsSubmitting(true);
    try {
      await createQuote({ text, author });
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return (
    <PageScaffold mainClassName="single-column">
      <AddQuoteForm onSubmit={handleQuoteSubmit} isSubmitting={isSubmitting} />
    </PageScaffold>
  );
}
