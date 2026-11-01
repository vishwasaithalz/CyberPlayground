<p align="center"><img src="assets/cyberplayground-hero.svg" alt="CyberPlayground custom project artwork" width="100%" /></p>

<p align="center">
  <a href="https://github.com/vishwasaithalz/CyberPlayground/actions/workflows/tests.yml"><img src="https://github.com/vishwasaithalz/CyberPlayground/actions/workflows/tests.yml/badge.svg" alt="CyberPlayground tests" /></a>
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white" alt="HTML5" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white" alt="CSS3" />
  <img src="https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?style=flat-square&logo=javascript&logoColor=111827" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Network%20access-None-0f766e?style=flat-square" alt="No network access" />
</p>

<p align="center"><strong>A hands-on browser playground for understanding defensive web security concepts.</strong></p>

<p align="center">[Labs](#-the-labs) · [Run locally](#-run-locally) · [Safety model](#-safety-model) · [Roadmap](#-roadmap)</p>

## 🧪 The labs

CyberPlayground is a small static site. Each exercise runs locally in your browser and uses example or user-supplied text only.

| Lab | What you learn | Boundary |
|---|---|---|
| HTTP security headers | Recognise common browser security headers | Analyses pasted text only |
| Password entropy concepts | Understand character pools and rough entropy estimates | Never enter a real password |
| Input handling | Compare safe text rendering with unsafe HTML handling | Demonstration does not execute supplied input |

## ⚡ Run locally

No framework, package installation, or build step is required.

```powershell
git clone https://github.com/vishwasaithalz/CyberPlayground.git
cd CyberPlayground
py -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000).

You can also open `index.html` directly in a modern browser.

## 🧰 Test

Requires Node.js 20 or newer:

```powershell
node --test
```

## 🔐 Safety model

- No target scanning, exploitation, credential collection, or external requests.
- No analytics, telemetry, external APIs, or third-party scripts.
- All calculations and demonstrations run in the browser.
- Do not paste real passwords, tokens, cookies, customer information, or confidential headers.

The exercises teach concepts. They do not certify that a website or application is secure.

## 🗂️ Project structure

```text
index.html          Main learning interface
assets/styles.css   Visual system and responsive layout
assets/app.js       Lab logic
tests/app.test.js   Automated tests
.github/            CI workflow
```

## 🗺️ Roadmap

- [ ] Add guided learning paths and clearer explanations for each finding.
- [ ] Add more defensive browser-security exercises.
- [ ] Improve accessibility and keyboard navigation.
- [ ] Add a hosted demo after a deployment review.

## 🤝 Contributing

Suggestions should include the learning objective, safe boundaries, and a reproducible example. See [CONTRIBUTING.md](CONTRIBUTING.md) and [SECURITY.md](SECURITY.md).

<p align="center"><sub>Learn the mechanics. Respect the boundaries. Build safer software.</sub></p>
