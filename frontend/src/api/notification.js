import { request } from "./client";

export async function fetchNotifications() {
  const data = await request("/api/notifications");
  return data.notifications;
}
