import React from "react";

export default function NotificationPanel({ notifications }) {
  return (
    <div>
      <h2>Notifications</h2>
      <div className="notifications">
        {notifications.length === 0 && <p>No updates yet.</p>}
        {notifications.map((notification) => (
          <div key={notification.id} className={notification.read ? "notification read" : "notification"}>
            <span>{notification.message}</span>
            <time>{new Date(notification.createdAt).toLocaleString()}</time>
          </div>
        ))}
      </div>
    </div>
  );
}
