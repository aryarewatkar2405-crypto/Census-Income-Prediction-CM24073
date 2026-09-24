/**
 * API Service for communicating with the FastAPI Backend
 */

// Dynamically determine the backend host based on the current browser URL
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname || '127.0.0.1';
    return `http://${host}:8000`;
  }
  return import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
};

const API_BASE_URL = getBaseUrl();

/**
 * Health check endpoint
 */
export async function getHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Health check failed with status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('getHealth error:', error);
    return { status: 'offline', model_loaded: false, error: error.message };
  }
}

/**
 * Get model metrics (accuracy, confusion matrix, per-class stats)
 */
export async function getMetrics() {
  try {
    const response = await fetch(`${API_BASE_URL}/metrics`, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Failed to load metrics with status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('getMetrics error:', error);
    throw new Error('Unable to connect to the backend server. Please verify FastAPI is running at ' + API_BASE_URL);
  }
}

/**
 * Get dataset schema and feature descriptions
 */
export async function getDatasetInfo() {
  try {
    const response = await fetch(`${API_BASE_URL}/dataset-info`, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Failed to load dataset info with status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('getDatasetInfo error:', error);
    throw new Error('Unable to fetch dataset info.');
  }
}

/**
 * Send 14 features for income prediction
 * @param {Object} inputData - 14 raw census features
 */
export async function predictIncome(inputData) {
  try {
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const detail = errorData.detail || `Server returned error ${response.status}`;
      throw new Error(typeof detail === 'string' ? detail : JSON.stringify(detail));
    }

    return await response.json();
  } catch (error) {
    console.error('predictIncome error:', error);
    throw error;
  }
}
