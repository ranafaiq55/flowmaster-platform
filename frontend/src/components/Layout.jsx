import React from "react";

export default function Layout({ user, onLogout, children }) {
  return (
    <div className="layout">
      <header>
        <div>
          <h1>Flowmaster</h1>
          <span>Welcome, {user.name}</span>
        </div>
        <button onClick={onLogout}>Sign out</button>
      </header>
      <main>{children}</main>
    </div>
  );
}
