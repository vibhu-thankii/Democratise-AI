// File: src/lib/api.js
import useStore from '../store/store.js'; // Adjust path if store.js is elsewhere

// Read the base URL from Vite environment variables, with a fallback
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

// Function to get the auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Core fetch function to handle requests, responses, and errors
const apiFetch = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;  const token = getAuthToken();
    console.log('Constructed API URL:', url); // <<< Add this line for debugging
    const headers = {
    // Default to JSON content type, can be overridden
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  // Add Authorization header if a token exists and it's not an explicit auth request
  // (like signup, where we don't have a token yet)
  if (token && !options.isAuthRequest) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options, // Includes method, body, etc.
      headers,
    });

    // Handle empty response body (e.g., 204 No Content)
    if (response.status === 204) {
        return { success: true, data: null };
    }

    // Try to parse JSON, handle potential errors if body isn't JSON
    let data;
    try {
         data = await response.json();
    } catch (jsonError) {
        // Handle cases where the response wasn't JSON (e.g., plain text error)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}, Body not JSON.`);
        }
        // If response was ok but not JSON, maybe return raw response? Or handle differently.
        // For now, assume JSON or empty is expected for success.
        console.warn("API response was not JSON:", jsonError);
        data = { detail: "Received non-JSON response" }; // Provide generic detail
    }


    if (!response.ok) {
        // If response status indicates an error (e.g., 4xx, 5xx)
        // Handle specific auth errors (e.g., 401 Unauthorized triggers logout)
        if (response.status === 401 && !options.isAuthRequest) {
            console.error('Authentication error (401), logging out.');
            useStore.getState().logout(); // Call logout action from Zustand store
            useStore.getState().addNotification({
                message: 'Session expired or invalid. Please log in again.',
                type: 'error'
            });
        }
        // Throw an error using the detail message from the backend JSON if possible
        throw new Error(data.detail || `HTTP error! status: ${response.status}`);
    }

    // If response is ok, return success and data
    return { success: true, data };

} catch (error) {
    console.error(`API fetch error for endpoint "${endpoint}":`, error);
    // Try to stringify detail if it's an object (like Pydantic errors)
    let errorMessage = error.message || 'An unknown network or API error occurred.';
    if (error.message?.includes('HTTP error') && typeof error.detail === 'object' && error.detail !== null) {
        try {
            errorMessage = `${error.message} - Details: ${JSON.stringify(error.detail)}`;
        } catch (_) { /* Ignore stringify errors */ }
    } else if (typeof error.detail === 'string') {
         errorMessage = error.detail; // Use detail directly if it's a string
    }
    return { success: false, error: errorMessage };
  }
};

// Export helper methods for common HTTP verbs
export const api = {
  get: (endpoint, options) => apiFetch(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options) => apiFetch(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body, options) => apiFetch(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint, options) => apiFetch(endpoint, { ...options, method: 'DELETE' }),

  // Special method for login using form data, as required by OAuth2PasswordRequestForm
  login: async (email, password) => {
    const formData = new URLSearchParams();
    formData.append('username', email); // FastAPI expects 'username' for OAuth2 form
    formData.append('password', password);

    try {
        // Directly use fetch for this specific form data request
        const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, { // Use V1 prefix
            method: 'POST',
            headers: {
                // Required header for form data
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString(), // Send as string
        });

        const data = await response.json(); // Expect JSON response (token or error)

        if (!response.ok) {
            throw new Error(data.detail || `HTTP error! status: ${response.status}`);
        }
        // Expect data like { access_token: "...", token_type: "bearer" }
        return { success: true, data };
    } catch (error) {
        console.error(`API login error:`, error);
        return { success: false, error: error.message || 'Login failed.' };
    }
  }
};