# CyberPlayground

A browser-based cybersecurity learning playground built around safe, isolated demonstrations. No target scanning, exploitation, credential collection, or external requests.

## Included labs

1. **HTTP security headers:** paste a sample header block and review common defensive headers locally in the browser.
2. **Password strength concepts:** explore estimated character-set entropy locally. This is an educational estimate, not a password-cracking tool.
3. **Input validation:** compare safe and unsafe handling of sample text using a visible, non-executing demonstration.

## Run locally

No build tools or dependencies are required.

    py -m http.server 8000

Open http://localhost:8000.

Alternatively, open index.html directly in a modern browser.

## Privacy and safety

- All lab calculations run in your browser.
- No analytics, telemetry, external API calls, or third-party scripts.
- Do not paste real passwords, tokens, customer information, or confidential headers.
- Labs use examples and supplied text only; they do not interact with external targets.

## Project structure

    index.html
    assets/
      styles.css
      app.js
    tests/
      app.test.js

## Test

Node.js 20+:

    node --test

## Learning goals

Understand security concepts, practise defensive reasoning, and learn how input handling and browser security controls work. This playground is educational and does not certify that an application is secure.
