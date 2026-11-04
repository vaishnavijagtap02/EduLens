const API_BASE = '/api';

export async function fetchHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    return await res.json();
  } catch (err) {
    console.error('Health check failed:', err);
    return { status: 'error', error: err.message };
  }
}

export async function fetchDatasetMetadata(dataset = 'mat') {
  const res = await fetch(`${API_BASE}/dataset/metadata?dataset=${dataset}`);
  if (!res.ok) throw new Error(`Failed to load dataset: ${res.statusText}`);
  return await res.json();
}

export async function runKMeans(params) {
  const res = await fetch(`${API_BASE}/kmeans/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error(`K-Means failed: ${res.statusText}`);
  return await res.json();
}

export async function fetchElbow(params) {
  const res = await fetch(`${API_BASE}/kmeans/elbow`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error(`Elbow calculation failed: ${res.statusText}`);
  return await res.json();
}

export async function runGMM(params) {
  const res = await fetch(`${API_BASE}/gmm/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error(`GMM failed: ${res.statusText}`);
  return await res.json();
}

export async function fetchBicAic(params) {
  const res = await fetch(`${API_BASE}/gmm/bic-aic`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error(`BIC/AIC calculation failed: ${res.statusText}`);
  return await res.json();
}

export async function compareModels(params) {
  const res = await fetch(`${API_BASE}/compare`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error(`Comparison failed: ${res.statusText}`);
  return await res.json();
}

export async function fetchInsights(params) {
  const res = await fetch(`${API_BASE}/insights`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error(`Insights generation failed: ${res.statusText}`);
  return await res.json();
}

