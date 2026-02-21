import { request, setAccessToken } from "./client";

export async function register(payload) {
  const data = await request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload)
  });
  setAccessToken(data.accessToken);
  return data.user;
}

export async function login(payload) {
  const data = await request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload)
  });
  setAccessToken(data.accessToken);
  return data.user;
}

export async function refresh() {
  const data = await request("/api/auth/refresh", {
    method: "POST"
  });
  setAccessToken(data.accessToken);
  return data.user;
}

export async function logout() {
  await request("/api/auth/logout", { method: "POST" });
  setAccessToken(null);
}

export async function me() {
  const data = await request("/api/auth/me");
  return data.user;
}
