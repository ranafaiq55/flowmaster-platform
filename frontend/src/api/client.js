const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

function getAccessToken() {
  return localStorage.getItem("accessToken");
}

function setAccessToken(token) {
  if (token) {
    localStorage.setItem("accessToken", token);
  } else {
    localStorage.removeItem("accessToken");
  }
}

async function request(path, options = {}) {
  const token = getAccessToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: "include"
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const message = errorBody.error || "Request failed";
    throw new Error(message);
  }

  if (response.status === 204) return null;
  return response.json();
}

export { API_URL, request, getAccessToken, setAccessToken };
