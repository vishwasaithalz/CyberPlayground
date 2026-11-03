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
