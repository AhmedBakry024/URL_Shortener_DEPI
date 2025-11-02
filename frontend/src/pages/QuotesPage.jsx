import { useCallback, useEffect, useState } from 'react';
import PageScaffold from '../components/PageScaffold.jsx';
import QuoteCard from '../components/QuoteCard.jsx';
import StatsGrid from '../components/StatsGrid.jsx';
import MetricsPreview from '../components/MetricsPreview.jsx';
import { fetchRandomQuote, fetchStats, fetchMetrics } from '../services/api.js';

const numberFormatter = new Intl.NumberFormat();

export default function QuotesPage() {
  const [quoteData, setQuoteData] = useState(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [metrics, setMetrics] = useState('');
  const [metricsLoading, setMetricsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const handleQuoteRefresh = useCallback(async () => {
    setQuoteLoading(true);
    try {
      const payload = await fetchRandomQuote();
      if (payload?.success) {
        setQuoteData(payload.data);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Failed to fetch quote', error);
    } finally {
      setQuoteLoading(false);
    }
  }, []);

  const handleStatsRefresh = useCallback(async () => {
    setStatsLoading(true);
    try {
      const payload = await fetchStats();
      if (payload?.success) {
        const data = { ...payload.data };
        const formatted = {
          ...data,
          totalQuotes: numberFormatter.format(data.totalQuotes ?? 0),
          totalRandomQuoteRequests: numberFormatter.format(data.totalRandomQuoteRequests ?? 0),
          quotesAdded: numberFormatter.format(data.quotesAdded ?? 0),
          profanityBlocked: numberFormatter.format(data.profanityBlocked ?? 0),
        };
        setStats(formatted);
      }
    } catch (error) {
      console.error('Failed to fetch stats', error);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const handleMetricsRefresh = useCallback(async () => {
    setMetricsLoading(true);
    try {
      const payload = await fetchMetrics();
      setMetrics(payload);
    } catch (error) {
      console.error('Failed to fetch metrics', error);
    } finally {
      setMetricsLoading(false);
    }
  }, []);

  useEffect(() => {
    handleQuoteRefresh();
    handleStatsRefresh();
    handleMetricsRefresh();
  }, [handleQuoteRefresh, handleStatsRefresh, handleMetricsRefresh]);

  return (
    <PageScaffold isBusy={quoteLoading} lastUpdated={lastUpdated}>
      <div className="primary-column">
        <QuoteCard isLoading={quoteLoading} quote={quoteData} onRefresh={handleQuoteRefresh} />
      </div>
      <aside className="secondary-column">
        <StatsGrid stats={stats} isLoading={statsLoading} onRefresh={handleStatsRefresh} />
        <MetricsPreview rawMetrics={metrics} onRefresh={handleMetricsRefresh} isLoading={metricsLoading} />
      </aside>
    </PageScaffold>
  );
}
