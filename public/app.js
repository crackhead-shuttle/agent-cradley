* {
  box-sizing: border-box;
}

:root {
  --bg: #06131d;
  --panel: rgba(10, 24, 36, 0.94);
  --panel-strong: #0f1f2a;
  --panel-soft: #132b3a;
  --border: rgba(151, 177, 200, 0.16);
  --text: #eff7ff;
  --muted: #a9bed1;
  --accent: #7ad9ff;
  --accent-strong: #3fc3ff;
  --assistant: #132b3a;
  --user: linear-gradient(135deg, #18b8ff 0%, #7e7cf9 100%);
  --shadow: 0 24px 72px rgba(5, 13, 20, 0.52);
}

html, body {
  margin: 0;
  min-height: 100%;
  font-family: Inter, "Segoe UI", sans-serif;
  background:
    radial-gradient(circle at top, rgba(54, 111, 156, 0.3), transparent 30%),
    linear-gradient(180deg, #06131d 0%, #091b2a 100%);
  color: var(--text);
}

body {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 32px;
}

button, textarea {
  font: inherit;
}

.page-shell {
  width: min(1240px, 100%);
  min-height: 820px;
  display: grid;
  grid-template-columns: 300px 1fr;
  background: rgba(7, 17, 25, 0.7);
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
  border-radius: 28px;
  overflow: hidden;
  backdrop-filter: blur(18px);
}

.sidebar {
  background: rgba(9, 22, 32, 0.9);
  border-right: 1px solid var(--border);
  padding: 28px 20px;
}

.brand-block {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 8px 10px 24px;
}

.brand-mark {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: linear-gradient(135deg, var(--accent) 0%, #8a7dff 100%);
  color: #021018;
  font-size: 1.6rem;
  font-weight: 800;
}

.eyebrow {
  margin: 0;
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
}

h1, h2, p {
  margin: 0;
}

h1 {
  font-size: 1.8rem;
}

.nav-links {
  display: grid;
  gap: 10px;
  margin-top: 18px;
}

.nav-button, .prompt-chip, .ghost-button, .primary-button {
  border: 1px solid transparent;
  border-radius: 12px;
  transition: 180ms ease;
  cursor: pointer;
}

.nav-button {
  width: 100%;
  background: rgba(255, 255, 255, 0.02);
  color: var(--text);
  padding: 12px 14px;
  text-align: left;
  border-color: var(--border);
}

.nav-button.active {
  background: rgba(122, 217, 255, 0.09);
  border-color: rgba(122, 217, 255, 0.25);
}

.quick-panel {
  margin-top: 28px;
}

.panel-label {
  color: var(--muted);
  margin-bottom: 14px;
  font-size: 0.82rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.prompt-list {
  display: grid;
  gap: 10px;
}

.prompt-chip {
  width: 100%;
  background: rgba(255, 255, 255, 0.02);
  color: var(--text);
  text-align: left;
  padding: 11px 12px;
  border-color: var(--border);
}

.chat-panel {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 26px 26px 18px;
  border-bottom: 1px solid var(--border);
}

.chat-header h2 {
  font-size: clamp(1.5rem, 2vw, 2rem);
}

.ghost-button {
  background: rgba(255, 255, 255, 0.02);
  color: var(--text);
  border-color: var(--border);
  padding: 0.8rem 1rem;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 24px 22px 14px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message-row {
  display: flex;
}

.message-row.user {
  justify-content: flex-end;
}

.message-bubble {
  max-width: min(72%, 760px);
  padding: 14px 16px;
  border-radius: 18px;
  line-height: 1.6;
  white-space: pre-wrap;
}

.message-row.assistant .message-bubble {
  background: var(--assistant);
  border: 1px solid var(--border);
  color: var(--text);
  border-bottom-left-radius: 6px;
}

.message-row.user .message-bubble {
  background: var(--user);
  color: white;
  border-bottom-right-radius: 6px;
}

.typing {
  display: inline-flex;
  gap: 7px;
  align-items: center;
  padding: 0 22px 12px;
  min-height: 24px;
}

.typing span {
  width: 8px;
  height: 8px;
  background: var(--muted);
  border-radius: 50%;
  animation: bounce 1.1s infinite ease-in-out;
}

.typing span:nth-child(2) { animation-delay: 0.2s; }
.typing span:nth-child(3) { animation-delay: 0.4s; }

@keyframes bounce {
  0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
  40% { transform: translateY(-5px); opacity: 1; }
}

.hidden {
  display: none !important;
}

.composer {
  display: flex;
  align-items: flex-end;
  gap: 14px;
  padding: 18px 22px 22px;
  border-top: 1px solid var(--border);
}

#message-input {
  flex: 1;
  min-height: 52px;
  max-height: 160px;
  resize: vertical;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border);
  border-radius: 16px;
  color: var(--text);
  padding: 14px 16px;
}

#message-input:focus {
  outline: 2px solid rgba(122, 217, 255, 0.35);
  border-color: rgba(122, 217, 255, 0.5);
}

.primary-button {
  background: linear-gradient(135deg, var(--accent-strong) 0%, #7b7bff 100%);
  color: #05161d;
  font-weight: 700;
  padding: 0.95rem 1.25rem;
  min-width: 110px;
}

@media (max-width: 900px) {
  .page-shell {
    grid-template-columns: 1fr;
    min-height: 100vh;
  }

  .sidebar {
    border-right: none;
    border-bottom: 1px solid var(--border);
  }

  .message-bubble {
    max-width: 90%;
  }
}
