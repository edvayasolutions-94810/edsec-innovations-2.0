const getApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl || envUrl.includes('your-edsec-backend') || (envUrl.includes('localhost') && window.location.hostname !== 'localhost')) {
    return '';
  }
  return envUrl;
};
const API_URL = getApiUrl();

export const getAuthHeaders = () => {
  const token = localStorage.getItem('adminToken');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

export const api = {
  get: async (path: string) => {
    const res = await fetch(`${API_URL}${path}`, {
      headers: getAuthHeaders(),
    });
    return res;
  },
  post: async (path: string, body: object, auth = true) => {
    const res = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: auth
        ? getAuthHeaders()
        : { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return res;
  },
  put: async (path: string, body: object = {}) => {
    const res = await fetch(`${API_URL}${path}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    });
    return res;
  },
  patch: async (path: string, body: object = {}) => {
    const res = await fetch(`${API_URL}${path}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    });
    return res;
  },
  delete: async (path: string) => {
    const res = await fetch(`${API_URL}${path}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return res;
  },
};

export default API_URL;

// ─── Contact helper ──────────────────────────────────────────────────────────
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export const sendContactEmail = async (data: ContactFormData): Promise<void> => {
  const res = await fetch(`${API_URL}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to send contact message');
  }
};
