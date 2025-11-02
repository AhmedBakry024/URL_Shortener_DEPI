import { endpoints } from '../config';

async function handleResponse(response) {
  const contentType = response.headers.get('content-type') ?? '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message = isJson ? payload?.message ?? 'Unexpected API error' : 'Unexpected API error';
    const error = new Error(message);
    error.status = response.status;
    error.details = payload;
    throw error;
  }

  return payload;
}

export async function fetchRandomQuote(signal) {
  const response = await fetch(endpoints.quote, { signal });
  return handleResponse(response);
}

export async function fetchAllQuotes(signal) {
  const response = await fetch(endpoints.quotes, { signal });
  return handleResponse(response);
}

export async function createQuote(data) {
  const response = await fetch(endpoints.quote, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

export async function deleteQuote(id) {
  const response = await fetch(`${endpoints.quote}/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
}

export async function fetchStats(signal) {
  const response = await fetch(endpoints.stats, { signal });
  return handleResponse(response);
}

export async function fetchMetrics(signal) {
  const response = await fetch(endpoints.metrics, { signal });
  if (!response.ok) {
    throw new Error('Unable to load metrics');
  }
  return response.text();
}
