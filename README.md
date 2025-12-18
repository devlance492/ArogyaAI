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

## ✨ Features

### Dashboard Sections
1. **Overview** - KPI cards, line/pie charts, activity feed
2. **Live Conversations** - Searchable table with filters, conversation modals
3. **TB Detection Cases** - Risk-categorized cases with severity indicators
4. **Disease Analytics** - Regional, symptom, and language charts
5. **Geo Heatmap** - Interactive India map with TB case density
6. **Alerts & Flags** - AI-generated alerts with severity badges
7. **Reports** - Downloadable reports section (mock)
8. **System Health** - AI/API status with progress indicators
9. **Settings** - Notification and display preferences

### Key Interactions
- Collapsible sidebar navigation
- Click conversations to view WhatsApp-style chat modal
- Filter conversations by TB Risk / Normal
- Search across all data
- Toggle heatmap/markers on map
- Weekly/Monthly stats toggle

## 🛠 Technologies

- **HTML5** - Semantic structure
- **CSS3** - Dark theme, glassmorphism, animations
- **JavaScript** - Vanilla ES6+
- **Chart.js** - Line, bar, doughnut charts
- **Leaflet.js** - Interactive heatmap
- **Lucide Icons** - Modern icon set
- **Google Fonts** - Inter, DM Sans

## 📸 Screenshot Tips

For best presentation screenshots:
1. Use full-screen (F11) mode
2. Capture Overview section for KPI impact
3. Capture Geo Heatmap for visual wow
4. Capture TB Cases section for medical credibility
5. Use browser dev tools to simulate different screen sizes

## 📝 Demo Data Notice

All data in this dashboard is mock/synthetic for demonstration purposes only. No real patient data is used.

## 🎨 Design Philosophy

- **Dark medical-tech theme** - Professional and modern
- **Glassmorphism cards** - Trendy depth effects
- **Calm blue/green palette** - Trustworthy healthcare feel
- **Large spacing & rounded corners** - Premium look
- **Smooth transitions** - Polished interactions

---

Built for Smart India Hackathon demonstration.
