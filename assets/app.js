export function calculateLearningProgress(completed, total) {
  const count = Math.max(0, Math.min(Number(total) || 0, Array.isArray(completed) ? completed.length : 0));
  const maximum = Math.max(0, Number(total) || 0);
  return { completed: count, total: maximum, percent: maximum ? Math.round(count / maximum * 100) : 0 };
}

export function analyzeHeaders(text) {
  const headers = {};
  for (const line of String(text).split(/\r?\n/)) {
    if (!line.trim() || /^HTTP\//i.test(line.trim())) continue;
    const colon = line.indexOf(":");
    if (colon < 1) continue;
    const key = line.slice(0, colon).trim().toLowerCase();
    headers[key] = line.slice(colon + 1).trim();
  }
  const checks = [
    ["content-security-policy", "Content Security Policy", "Helps control which resources a page may load."],
    ["strict-transport-security", "Strict Transport Security", "Tells browsers to prefer HTTPS for the host."],
    ["x-content-type-options", "X-Content-Type-Options", "nosniff helps prevent MIME type guessing."],
    ["referrer-policy", "Referrer Policy", "Controls how much referrer information is sent."],
    ["permissions-policy", "Permissions Policy", "Controls access to selected browser features."]
  ];
  return checks.map(([key, label, description]) => ({
    header: label,
    present: Boolean(headers[key]),
    value: headers[key] || "",
    description
  }));
}

export function estimateEntropy(sample) {
  const value = String(sample);
  if (!value.length) return { bits: 0, pool: 0, length: 0 };
  let pool = 0;
  if (/[a-z]/.test(value)) pool += 26;
  if (/[A-Z]/.test(value)) pool += 26;
  if (/\d/.test(value)) pool += 10;
  if (/[^a-zA-Z0-9]/.test(value)) pool += 33;
  return { bits: Math.round(value.length * Math.log2(Math.max(pool, 1)) * 10) / 10, pool, length: value.length };
}

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function init() {
  const themeToggle = document.querySelector("#theme-toggle");
  const applyTheme = (theme) => {
    document.documentElement.dataset.theme = theme;
    if (themeToggle) {
      const dark = theme === "dark";
      themeToggle.textContent = dark ? "☀ Light mode" : "☾ Dark mode";
      themeToggle.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
      themeToggle.setAttribute("aria-pressed", String(dark));
    }
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) themeMeta.content = theme === "dark" ? "#141c27" : "#f3f4f6";
  };
  let preferredTheme = "dark";
  try { preferredTheme = localStorage.getItem("cyberplayground-theme") === "light" ? "light" : "dark"; } catch (_) { /* Private mode may restrict storage. */ }
  applyTheme(preferredTheme);
  if (themeToggle) themeToggle.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem("cyberplayground-theme", next); } catch (_) { /* Theme still works in memory. */ }
  });
  const pathChecks = [...document.querySelectorAll("[data-path-step]")];
  const pathCount = document.querySelector("#path-count");
  const pathMeter = document.querySelector("#path-meter-fill");
  const refreshPath = () => {
    const progress = calculateLearningProgress(pathChecks.filter(check => check.checked), pathChecks.length);
    if (pathCount) pathCount.textContent = progress.completed + " / " + progress.total;
    if (pathMeter) pathMeter.style.width = progress.percent + "%";
  };
  try {
    const saved = JSON.parse(localStorage.getItem("cyberplayground-learning-path") || "[]");
    pathChecks.forEach(check => { check.checked = Array.isArray(saved) && saved.includes(check.dataset.pathStep); });
  } catch (_) { /* Progress remains usable for this session if storage is blocked. */ }
  pathChecks.forEach(check => check.addEventListener("change", () => {
    refreshPath();
    try {
      localStorage.setItem("cyberplayground-learning-path", JSON.stringify(pathChecks.filter(item => item.checked).map(item => item.dataset.pathStep)));
    } catch (_) { /* Keep the current session state even when persistence is unavailable. */ }
  }));
  refreshPath();

  const tabs = [...document.querySelectorAll(".module-tab")];
  const selectTab = (selected, moveFocus = false) => {
    for (const tab of tabs) {
      const active = tab === selected;
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
      const panel = document.getElementById(tab.dataset.panel);
      if (panel) panel.hidden = !active;
    }
    if (moveFocus) selected.focus();
  };
  document.querySelectorAll("[data-open-panel]").forEach(link => link.addEventListener("click", () => {
    const target = document.querySelector('[data-panel="' + link.dataset.openPanel + '"]');
    if (target) selectTab(target);
  }));
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectTab(tab));
    tab.addEventListener("keydown", event => {
      if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
      selectTab(tabs[next], true);
    });
  });
  const headerInput = document.querySelector("#headers-input");
  const headerRun = document.querySelector("#headers-run");
  const headerOutput = document.querySelector("#headers-output");
  const passwordInput = document.querySelector("#password-input");
  const entropyValue = document.querySelector("#entropy-value");
  const entropyMeter = document.querySelector("#entropy-meter");
  const entropyGuidance = document.querySelector("#entropy-guidance");
  const inputDemo = document.querySelector("#input-demo");
  const inputRun = document.querySelector("#input-run");
  const safeOutput = document.querySelector("#safe-output");

  if (headerRun) headerRun.addEventListener("click", () => {
    headerOutput.replaceChildren();
    for (const result of analyzeHeaders(headerInput.value)) {
      const row = element("div", "finding");
      row.append(element("strong", "", result.present ? "Present" : "Missing"));
      row.append(element("p", "", result.header + ": " + result.description + (result.present ? " Supplied value: " + result.value : "")));
      headerOutput.append(row);
    }
  });

  if (passwordInput) passwordInput.addEventListener("input", () => {
    const result = estimateEntropy(passwordInput.value);
    entropyValue.textContent = result.bits + " bits";
    entropyMeter.style.width = Math.min(100, result.bits / 128 * 100) + "%";
    entropyGuidance.replaceChildren();
    let message = "Add length and variety to increase the theoretical search space.";
    if (result.bits >= 60) message = "The theoretical estimate is higher. Uniqueness and safe storage still matter.";
    if (result.bits >= 90) message = "A larger theoretical search space. Prefer a unique, randomly generated password stored in a password manager.";
    if (!result.length) message = "Enter a synthetic example to explore the estimate.";
    entropyGuidance.append(element("p", "muted", message));
  });

  if (inputRun) inputRun.addEventListener("click", () => {
    // textContent deliberately treats the supplied string as text, never HTML.
    safeOutput.textContent = inputDemo.value;
  });
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
}
