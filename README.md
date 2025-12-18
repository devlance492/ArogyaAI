# ArogyaAI Admin Dashboard

A visually stunning, feature-rich admin dashboard for AI-powered public health monitoring, specifically designed for TB detection and disease surveillance.

## 🚀 Quick Start

### Option 1: Open Directly
Simply open `index.html` in a modern web browser (Chrome, Firefox, Edge recommended).

### Option 2: Local Server (Recommended)
For full functionality, run a local server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## 📁 Project Structure

```
arogya-ai-dashboard/
├── index.html          # Main HTML file
├── style.css           # Premium dark theme styles
├── script.js           # Charts, maps, and interactivity
├── data/
│   └── mock-data.json  # Demo data (conversations, TB cases, alerts)
└── README.md           # This file
```

ArogyaAI is an AI-powered public health monitoring system conceptualized for Smart India Hackathon (SIH) 2025, aimed at improving early disease awareness and tuberculosis (TB) screening using conversational AI and medical imaging.


This repository contains the Admin Dashboard (frontend-only) used by health officials to visualize system insights, AI detections, and regional trends.


📌 What This Repository Contains

✅ Admin Dashboard (Frontend)

  High-fidelity, production-style UI for health officials

  Visualizes AI-driven insights from citizen health interactions

  Designed for monitoring TB-suspected cases, trends, and alerts

  Included features:

  KPI overview (users, TB cases, alerts, regions)

  Live conversation monitoring (WhatsApp-style chat view)

  TB detection case management (risk-based categorization)

  Interactive India geo heatmap (state-wise trends)

  Disease analytics & charts

  Alerts & flags for abnormal patterns

  System health monitoring UI


❌ What This Repository Does NOT Contain (By Design)

  This repository does not include backend services or WhatsApp integration, and this is intentional.

  Excluded Components:

  WhatsApp Business API integration

  Backend services (Flask/FastAPI)

  AI inference APIs

  Database and message queues

  Authentication and role management

Reason (Important):

  The backend services involve private API keys, sensitive health workflows, and restricted WhatsApp integrations.

  For security, privacy, and compliance reasons, those components are not open-sourced.

  This repository focuses on the admin-facing visualization layer, which is sufficient to demonstrate:

  System architecture

  Decision-support capabilities

  Real-world deployment readiness

  This separation also follows industry best practices, where dashboards and core health-processing services are maintained independently.

🧠 System Architecture (High-Level)

User Side

  Citizens interact via WhatsApp chatbot

  Multilingual symptom-based conversation

  Optional chest X-ray upload for TB screening

  AI Layer

  NLP-based symptom flow analysis

  CNN-based TB detection model trained on chest X-ray datasets

  Risk classification (Normal / Medium / High / Critical)
  
  Admin Side (This Repo)

  Aggregates AI outputs

  Visualizes regional disease patterns

  Supports decision-making for health officials
  

🛠 Tech Stack (Complete Project)

Frontend (This Repository)

  HTML5

  CSS3 (Glassmorphism, dark/light themes)

  Vanilla JavaScript (ES6+)

  Chart.js (analytics & trends)

  Leaflet.js + Heatmaps (geospatial insights)

  Lucide Icons

  Google Fonts (Inter, DM Sans)

Backend & AI (System-Level)

  Python (Flask / FastAPI)

  WhatsApp Business API (Twilio / Meta)

  CNN-based Deep Learning model for TB detection

  NLP-driven conversational flows

  REST APIs for data aggregation

📸 Demo & Screenshots

  This project is demonstrated using:

  Deployed admin dashboard (static hosting)

  Real WhatsApp chat screenshots showing:

  Normal health conversations

  TB risk detection flows

  Simulated system data for visualization

⚠️ No real patient data is used in this demo.

🎯 Why This Matters

  TB is one of India’s most critical public health challenges

  Early symptom awareness can significantly reduce late diagnosis

  Familiar platforms like WhatsApp lower adoption barriers

  Admin dashboards enable data-driven public health interventions

🧪 Disclaimer

This project is a prototype developed for Smart India Hackathon 2025.
It is not a medical diagnostic system and should not be used as a substitute for professional medical advice.
Built for Smart India Hackathon demonstration.


