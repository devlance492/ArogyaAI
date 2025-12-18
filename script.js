/* =====================================================
   ArogyaAI Admin Dashboard - JavaScript
   ===================================================== */

// Global variables
let mockData = null;
let casesChart = null;
let distributionChart = null;
let regionalChart = null;
let symptomsChart = null;
let weeklyChart = null;
let languageChart = null;
let reportPreviewChart = null;
let map = null;
let heatLayer = null;
let markersLayer = null;

// Initialize application - multiple fallbacks for file:// compatibility
function initDashboard() {
    loadMockData();
    initializeLucideIcons();
    initializeSidebar();
    initializeNavigation();
    initializeCharts();
    initializeMap();
    populateUI();
    initializeEventListeners();
    updateLastUpdated();
    console.log('Dashboard initialized successfully');
}

// Use multiple event listeners for maximum compatibility
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDashboard);
} else {
    // DOM already loaded, call immediately
    initDashboard();
}

// Fallback: also try window.onload
window.addEventListener('load', function () {
    // Only re-init if tables are empty (belt and suspenders approach)
    const tbody = document.getElementById('conversationsBody');
    if (tbody && tbody.children.length === 0) {
        console.log('Fallback initialization triggered');
        populateUI();
        lucide.createIcons();
    }
});

// Load mock data - embedded directly to avoid CORS issues
function loadMockData() {
    mockData = {
        "kpis": {
            "totalUsers": 24847,
            "tbSuspectedCases": 1247,
            "normalConversations": 23600,
            "alertsGenerated": 89,
            "activeRegions": 28
        },
        "casesOverTime": {
            "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            "tbCases": [45, 62, 78, 95, 112, 134, 156, 178, 189, 201, 215, 247],
            "normalCases": [1200, 1450, 1680, 1920, 2100, 2340, 2580, 2750, 2890, 3100, 3280, 3600]
        },
        "tbDistribution": {
            "labels": ["TB Suspected", "Normal", "Under Review"],
            "data": [1247, 23600, 342]
        },
        "conversations": [
            {
                "id": "CONV-2024-001247",
                "language": "Hindi",
                "symptoms": ["Persistent cough", "Weight loss", "Night sweats"],
                "outcome": "TB Risk",
                "riskLevel": "High",
                "timestamp": "2024-12-18 14:32:18",
                "status": "Flagged",
                "region": "Bihar",
                "district": "Patna",
                "messages": [
                    { "sender": "user", "text": "नमस्ते, मुझे पिछले 3 हफ्ते से खांसी है", "time": "14:30" },
                    { "sender": "ai", "text": "नमस्ते! मैं आपकी मदद करने के लिए यहाँ हूँ। क्या आपको बुखार भी है?", "time": "14:30" },
                    { "sender": "user", "text": "हाँ, रात को बुखार आता है और पसीना भी", "time": "14:31" },
                    { "sender": "ai", "text": "क्या आपका वजन कम हुआ है पिछले कुछ समय में?", "time": "14:31" },
                    { "sender": "user", "text": "हाँ, करीब 5 किलो कम हुआ है", "time": "14:32" },
                    { "sender": "ai", "text": "⚠️ आपके लक्षण TB (क्षय रोग) के संकेत हो सकते हैं। कृपया जल्द से जल्द नजदीकी स्वास्थ्य केंद्र जाएं।", "time": "14:32", "highlight": true }
                ]
            },
            {
                "id": "CONV-2024-001246",
                "language": "English",
                "symptoms": ["Mild fever", "Headache"],
                "outcome": "Normal",
                "riskLevel": "Low",
                "timestamp": "2024-12-18 14:28:45",
                "status": "Resolved",
                "region": "Maharashtra",
                "district": "Mumbai",
                "messages": [
                    { "sender": "user", "text": "Hi, I have a mild fever since yesterday", "time": "14:26" },
                    { "sender": "ai", "text": "Hello! I'm here to help. What's your temperature?", "time": "14:26" },
                    { "sender": "user", "text": "Around 99F and slight headache", "time": "14:27" },
                    { "sender": "ai", "text": "These symptoms suggest a common viral infection. Please rest and stay hydrated.", "time": "14:28" }
                ]
            },
            {
                "id": "CONV-2024-001245",
                "language": "Tamil",
                "symptoms": ["Cough with blood", "Chest pain", "Fatigue"],
                "outcome": "TB Risk",
                "riskLevel": "Critical",
                "timestamp": "2024-12-18 14:15:22",
                "status": "Urgent",
                "region": "Tamil Nadu",
                "district": "Chennai",
                "messages": [
                    { "sender": "user", "text": "எனக்கு இருமலில் ரத்தம் வருகிறது", "time": "14:12" },
                    { "sender": "ai", "text": "இது மிக முக்கியமான அறிகுறி. எவ்வளவு நாட்களாக இருக்கிறது?", "time": "14:13" },
                    { "sender": "user", "text": "ஒரு வாரமாக, மார்பு வலியும் இருக்கிறது", "time": "14:14" },
                    { "sender": "ai", "text": "🚨 உடனடியாக மருத்துவமனைக்கு செல்லுங்கள். இது TB அல்லது தீவிர நுரையீரல் பிரச்சனையாக இருக்கலாம்.", "time": "14:15", "highlight": true }
                ]
            },
            {
                "id": "CONV-2024-001244",
                "language": "Bengali",
                "symptoms": ["Cough", "Low appetite"],
                "outcome": "TB Risk",
                "riskLevel": "Medium",
                "timestamp": "2024-12-18 13:58:10",
                "status": "Pending Review",
                "region": "West Bengal",
                "district": "Kolkata",
                "messages": [
                    { "sender": "user", "text": "আমার দীর্ঘদিন ধরে কাশি হচ্ছে", "time": "13:55" },
                    { "sender": "ai", "text": "কতদিন ধরে কাশি হচ্ছে?", "time": "13:56" },
                    { "sender": "user", "text": "প্রায় ২ সপ্তাহ, খিদে কমে গেছে", "time": "13:57" },
                    { "sender": "ai", "text": "⚠️ আপনার উপসর্গগুলি TB এর লক্ষণ হতে পারে। দয়া করে নিকটতম স্বাস্থ্য কেন্দ্রে যান।", "time": "13:58", "highlight": true }
                ]
            },
            {
                "id": "CONV-2024-001243",
                "language": "Hindi",
                "symptoms": ["Cold", "Runny nose"],
                "outcome": "Normal",
                "riskLevel": "Low",
                "timestamp": "2024-12-18 13:45:30",
                "status": "Resolved",
                "region": "Uttar Pradesh",
                "district": "Lucknow",
                "messages": [
                    { "sender": "user", "text": "मुझे सर्दी जुकाम हो गया है", "time": "13:43" },
                    { "sender": "ai", "text": "कब से है? और क्या बुखार भी है?", "time": "13:44" },
                    { "sender": "user", "text": "कल से है, बुखार नहीं है", "time": "13:45" },
                    { "sender": "ai", "text": "यह सामान्य सर्दी लगती है। गर्म पानी पिएं, आराम करें।", "time": "13:45" }
                ]
            },
            {
                "id": "CONV-2024-001242",
                "language": "Marathi",
                "symptoms": ["Prolonged cough", "Weakness", "Loss of appetite"],
                "outcome": "TB Risk",
                "riskLevel": "High",
                "timestamp": "2024-12-18 13:30:15",
                "status": "Flagged",
                "region": "Maharashtra",
                "district": "Pune",
                "messages": [
                    { "sender": "user", "text": "मला खूप दिवसांपासून खोकला येतोय", "time": "13:27" },
                    { "sender": "ai", "text": "किती दिवसांपासून? इतर काही त्रास आहे का?", "time": "13:28" },
                    { "sender": "user", "text": "महिन्याभरापासून, अशक्तपणा वाटतो, भूक नाही", "time": "13:29" },
                    { "sender": "ai", "text": "⚠️ तुमची लक्षणे क्षयरोगाची (TB) असू शकतात। कृपया लवकरात लवकर जवळच्या आरोग्य केंद्रात जा।", "time": "13:30", "highlight": true }
                ]
            },
            {
                "id": "CONV-2024-001241",
                "language": "English",
                "symptoms": ["Stomach ache", "Nausea"],
                "outcome": "Normal",
                "riskLevel": "Low",
                "timestamp": "2024-12-18 13:15:45",
                "status": "Resolved",
                "region": "Karnataka",
                "district": "Bangalore",
                "messages": [
                    { "sender": "user", "text": "I have stomach pain and feeling nauseous", "time": "13:12" },
                    { "sender": "ai", "text": "When did it start? Did you eat anything unusual?", "time": "13:13" },
                    { "sender": "user", "text": "Started this morning, had street food yesterday", "time": "13:14" },
                    { "sender": "ai", "text": "This sounds like food poisoning. Stay hydrated with ORS and rest.", "time": "13:15" }
                ]
            },
            {
                "id": "CONV-2024-001240",
                "language": "Telugu",
                "symptoms": ["Chronic cough", "Evening fever", "Weight loss"],
                "outcome": "TB Risk",
                "riskLevel": "High",
                "timestamp": "2024-12-18 12:58:20",
                "status": "Flagged",
                "region": "Andhra Pradesh",
                "district": "Hyderabad",
                "messages": [
                    { "sender": "user", "text": "నాకు చాలా రోజులుగా దగ్గు వస్తోంది", "time": "12:55" },
                    { "sender": "ai", "text": "ఎంత రోజులుగా? ఇతర సమస్యలు ఉన్నాయా?", "time": "12:56" },
                    { "sender": "user", "text": "3 వారాలుగా, సాయంత్రం జ్వరం, బరువు తగ్గింది", "time": "12:57" },
                    { "sender": "ai", "text": "⚠️ మీ లక్షణాలు TB సంకేతాలు కావచ్చు. దయచేసి వెంటనే సమీపంలోని ఆరోగ్య కేంద్రానికి వెళ్ళండి.", "time": "12:58", "highlight": true }
                ]
            }
        ],
        "tbCases": [
            { "id": "TB-2024-0847", "riskLevel": "Critical", "symptoms": ["Blood in cough", "Chest pain", "Severe fatigue", "Night sweats"], "action": "Immediate Hospital Referral", "region": "Tamil Nadu", "district": "Chennai", "timestamp": "2024-12-18 14:15:22" },
            { "id": "TB-2024-0846", "riskLevel": "High", "symptoms": ["Persistent cough", "Weight loss", "Night sweats"], "action": "Refer to TB Center", "region": "Bihar", "district": "Patna", "timestamp": "2024-12-18 14:32:18" },
            { "id": "TB-2024-0845", "riskLevel": "High", "symptoms": ["Prolonged cough", "Weakness", "Loss of appetite"], "action": "Refer to TB Center", "region": "Maharashtra", "district": "Pune", "timestamp": "2024-12-18 13:30:15" },
            { "id": "TB-2024-0844", "riskLevel": "High", "symptoms": ["Chronic cough", "Evening fever", "Weight loss"], "action": "Refer to TB Center", "region": "Andhra Pradesh", "district": "Hyderabad", "timestamp": "2024-12-18 12:58:20" },
            { "id": "TB-2024-0843", "riskLevel": "Medium", "symptoms": ["Cough", "Low appetite"], "action": "Schedule TB Test", "region": "West Bengal", "district": "Kolkata", "timestamp": "2024-12-18 13:58:10" },
            { "id": "TB-2024-0842", "riskLevel": "Medium", "symptoms": ["Cough > 2 weeks", "Mild fever"], "action": "Schedule TB Test", "region": "Rajasthan", "district": "Jaipur", "timestamp": "2024-12-18 11:45:30" },
            { "id": "TB-2024-0841", "riskLevel": "Low", "symptoms": ["Mild persistent cough"], "action": "Monitor & Follow-up", "region": "Gujarat", "district": "Ahmedabad", "timestamp": "2024-12-18 10:30:15" }
        ],
        "regionData": [
            { "state": "Maharashtra", "lat": 19.7515, "lng": 75.7139, "totalCases": 3420, "tbSuspected": 187, "trend": "up" },
            { "state": "Bihar", "lat": 25.0961, "lng": 85.3131, "totalCases": 2890, "tbSuspected": 234, "trend": "up" },
            { "state": "Uttar Pradesh", "lat": 26.8467, "lng": 80.9462, "totalCases": 4120, "tbSuspected": 312, "trend": "up" },
            { "state": "Tamil Nadu", "lat": 11.1271, "lng": 78.6569, "totalCases": 2340, "tbSuspected": 156, "trend": "down" },
            { "state": "West Bengal", "lat": 22.9868, "lng": 87.855, "totalCases": 2780, "tbSuspected": 178, "trend": "stable" },
            { "state": "Karnataka", "lat": 15.3173, "lng": 75.7139, "totalCases": 1890, "tbSuspected": 98, "trend": "down" },
            { "state": "Rajasthan", "lat": 27.0238, "lng": 74.2179, "totalCases": 2450, "tbSuspected": 145, "trend": "stable" },
            { "state": "Andhra Pradesh", "lat": 15.9129, "lng": 79.74, "totalCases": 1980, "tbSuspected": 123, "trend": "up" },
            { "state": "Gujarat", "lat": 22.2587, "lng": 71.1924, "totalCases": 1650, "tbSuspected": 89, "trend": "down" },
            { "state": "Madhya Pradesh", "lat": 22.9734, "lng": 78.6569, "totalCases": 2120, "tbSuspected": 167, "trend": "up" },
            { "state": "Kerala", "lat": 10.8505, "lng": 76.2711, "totalCases": 890, "tbSuspected": 34, "trend": "down" },
            { "state": "Punjab", "lat": 31.1471, "lng": 75.3412, "totalCases": 1230, "tbSuspected": 67, "trend": "stable" },
            { "state": "Odisha", "lat": 20.9517, "lng": 85.0985, "totalCases": 1560, "tbSuspected": 112, "trend": "up" },
            { "state": "Jharkhand", "lat": 23.6102, "lng": 85.2799, "totalCases": 1890, "tbSuspected": 145, "trend": "up" },
            { "state": "Assam", "lat": 26.2006, "lng": 92.9376, "totalCases": 980, "tbSuspected": 56, "trend": "stable" }
        ],
        "alerts": [
            { "id": "ALT-001", "type": "Spike Detected", "severity": "Critical", "message": "Unusual 40% increase in TB symptoms reported from Patna district", "region": "Bihar", "district": "Patna", "timestamp": "2024-12-18 14:45:00", "status": "Unreviewed" },
            { "id": "ALT-002", "type": "Cluster Alert", "severity": "High", "message": "Multiple TB cases detected within 5km radius in Chennai", "region": "Tamil Nadu", "district": "Chennai", "timestamp": "2024-12-18 13:30:00", "status": "Under Review" },
            { "id": "ALT-003", "type": "High Risk Pattern", "severity": "High", "message": "3 critical TB cases with blood in cough reported today", "region": "Multiple", "district": "Various", "timestamp": "2024-12-18 12:15:00", "status": "Under Review" },
            { "id": "ALT-004", "type": "Regional Trend", "severity": "Medium", "message": "Consistent upward trend in UP for past 2 weeks", "region": "Uttar Pradesh", "district": "State-wide", "timestamp": "2024-12-18 10:00:00", "status": "Acknowledged" },
            { "id": "ALT-005", "type": "System Alert", "severity": "Low", "message": "WhatsApp message queue processing delayed by 5 minutes", "region": "System", "district": "N/A", "timestamp": "2024-12-18 09:30:00", "status": "Resolved" }
        ],
        "systemHealth": {
            "aiUptime": 99.7,
            "apiUsage": 78,
            "whatsappStatus": "Active",
            "lastSync": "2024-12-18 14:55:00",
            "messagesProcessed": 24847,
            "avgResponseTime": "1.2s",
            "modelVersion": "v3.2.1",
            "dbStatus": "Healthy"
        },
        "recentActivity": [
            { "type": "detection", "message": "Critical TB case detected in Chennai", "time": "2 mins ago", "icon": "alert" },
            { "type": "conversation", "message": "New conversation started from Bihar", "time": "5 mins ago", "icon": "chat" },
            { "type": "system", "message": "AI model updated to v3.2.1", "time": "15 mins ago", "icon": "update" },
            { "type": "detection", "message": "High-risk case flagged in Pune", "time": "28 mins ago", "icon": "flag" },
            { "type": "report", "message": "Weekly report generated successfully", "time": "1 hour ago", "icon": "report" },
            { "type": "detection", "message": "Medium-risk case identified in Kolkata", "time": "1.5 hours ago", "icon": "alert" },
            { "type": "conversation", "message": "500 conversations processed today", "time": "2 hours ago", "icon": "milestone" }
        ],
        "weeklyStats": {
            "conversationsThisWeek": 4520,
            "tbCasesThisWeek": 89,
            "alertsThisWeek": 12,
            "regionsActiveThisWeek": 22
        },
        "monthlyStats": {
            "conversationsThisMonth": 18240,
            "tbCasesThisMonth": 347,
            "alertsThisMonth": 45,
            "regionsActiveThisMonth": 28
        }
    };
}

// Initialize Lucide icons
function initializeLucideIcons() {
    lucide.createIcons();
}

// Sidebar functionality
function initializeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');

    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        setTimeout(() => {
            if (casesChart) casesChart.resize();
            if (distributionChart) distributionChart.resize();
            if (map) map.invalidateSize();
        }, 300);
    });

    mobileMenuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    // Close sidebar on outside click (mobile)
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 992) {
            if (!sidebar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        }
    });
}

// Navigation
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section');
    const currentSectionSpan = document.getElementById('currentSection');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = item.dataset.section;

            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            // Show corresponding section
            sections.forEach(section => section.classList.add('hidden'));
            const targetSection = document.getElementById(`section-${sectionId}`);
            if (targetSection) {
                targetSection.classList.remove('hidden');

                // Update breadcrumb
                const sectionName = item.querySelector('span').textContent;
                currentSectionSpan.textContent = sectionName;

                // Reinitialize charts/map for the section
                if (sectionId === 'analytics') {
                    initializeAnalyticsCharts();
                } else if (sectionId === 'heatmap') {
                    setTimeout(() => {
                        if (map) map.invalidateSize();
                    }, 100);
                } else if (sectionId === 'reports') {
                    initializeReportPreviewChart();
                }
            }

            // Close mobile sidebar
            document.getElementById('sidebar').classList.remove('open');
        });
    });
}

// Initialize Charts
function initializeCharts() {
    initializeCasesChart();
    initializeDistributionChart();
}

function initializeCasesChart() {
    const ctx = document.getElementById('casesChart');
    if (!ctx || !mockData) return;

    const gradient1 = ctx.getContext('2d').createLinearGradient(0, 0, 0, 280);
    gradient1.addColorStop(0, 'rgba(239, 68, 68, 0.3)');
    gradient1.addColorStop(1, 'rgba(239, 68, 68, 0.0)');

    const gradient2 = ctx.getContext('2d').createLinearGradient(0, 0, 0, 280);
    gradient2.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
    gradient2.addColorStop(1, 'rgba(59, 130, 246, 0.0)');

    casesChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: mockData.casesOverTime.labels,
            datasets: [
                {
                    label: 'TB Suspected Cases',
                    data: mockData.casesOverTime.tbCases,
                    borderColor: '#ef4444',
                    backgroundColor: gradient1,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointBackgroundColor: '#ef4444',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                },
                {
                    label: 'Normal Cases',
                    data: mockData.casesOverTime.normalCases.map(v => v / 10),
                    borderColor: '#3b82f6',
                    backgroundColor: gradient2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointBackgroundColor: '#3b82f6',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                        color: '#9ca3af',
                        usePointStyle: true,
                        padding: 20,
                        font: { size: 12, family: 'Inter' }
                    }
                },
                tooltip: {
                    backgroundColor: '#1a2234',
                    titleColor: '#f9fafb',
                    bodyColor: '#9ca3af',
                    borderColor: '#374151',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: true,
                    callbacks: {
                        label: function (context) {
                            if (context.dataset.label === 'Normal Cases') {
                                return `${context.dataset.label}: ${context.raw * 10}`;
                            }
                            return `${context.dataset.label}: ${context.raw}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(75, 85, 99, 0.2)', drawBorder: false },
                    ticks: { color: '#6b7280', font: { size: 11 } }
                },
                y: {
                    grid: { color: 'rgba(75, 85, 99, 0.2)', drawBorder: false },
                    ticks: { color: '#6b7280', font: { size: 11 } }
                }
            },
            interaction: { intersect: false, mode: 'index' }
        }
    });
}

function initializeDistributionChart() {
    const ctx = document.getElementById('distributionChart');
    if (!ctx || !mockData) return;

    distributionChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: mockData.tbDistribution.labels,
            datasets: [{
                data: mockData.tbDistribution.data,
                backgroundColor: ['#ef4444', '#10b981', '#f59e0b'],
                borderColor: '#111827',
                borderWidth: 3,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '65%',
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#1a2234',
                    titleColor: '#f9fafb',
                    bodyColor: '#9ca3af',
                    borderColor: '#374151',
                    borderWidth: 1,
                    padding: 12
                }
            }
        }
    });

    // Create custom legend
    const legendContainer = document.getElementById('distributionLegend');
    if (legendContainer) {
        const colors = ['#ef4444', '#10b981', '#f59e0b'];
        legendContainer.innerHTML = mockData.tbDistribution.labels.map((label, i) => `
            <div class="legend-item" style="display: flex; align-items: center; gap: 8px;">
                <span style="width: 12px; height: 12px; background: ${colors[i]}; border-radius: 3px;"></span>
                <span style="color: #9ca3af;">${label}</span>
            </div>
        `).join('');
    }
}

function initializeAnalyticsCharts() {
    // Regional Chart
    const regionalCtx = document.getElementById('regionalChart');
    if (regionalCtx && !regionalChart && mockData) {
        regionalChart = new Chart(regionalCtx, {
            type: 'bar',
            data: {
                labels: mockData.regionData.slice(0, 8).map(r => r.state),
                datasets: [{
                    label: 'TB Suspected',
                    data: mockData.regionData.slice(0, 8).map(r => r.tbSuspected),
                    backgroundColor: 'rgba(239, 68, 68, 0.7)',
                    borderColor: '#ef4444',
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#1a2234',
                        titleColor: '#f9fafb',
                        bodyColor: '#9ca3af',
                        borderColor: '#374151',
                        borderWidth: 1
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { color: '#6b7280', font: { size: 10 } }
                    },
                    y: {
                        grid: { color: 'rgba(75, 85, 99, 0.2)' },
                        ticks: { color: '#6b7280' }
                    }
                }
            }
        });
    }

    // Symptoms Chart
    const symptomsCtx = document.getElementById('symptomsChart');
    if (symptomsCtx && !symptomsChart) {
        symptomsChart = new Chart(symptomsCtx, {
            type: 'bar',
            data: {
                labels: ['Persistent Cough', 'Weight Loss', 'Night Sweats', 'Fever', 'Fatigue', 'Chest Pain'],
                datasets: [{
                    label: 'Frequency',
                    data: [847, 623, 512, 489, 378, 234],
                    backgroundColor: 'rgba(59, 130, 246, 0.7)',
                    borderColor: '#3b82f6',
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: {
                        grid: { color: 'rgba(75, 85, 99, 0.2)' },
                        ticks: { color: '#6b7280' }
                    },
                    y: {
                        grid: { display: false },
                        ticks: { color: '#6b7280', font: { size: 11 } }
                    }
                }
            }
        });
    }

    // Weekly Chart
    const weeklyCtx = document.getElementById('weeklyChart');
    if (weeklyCtx && !weeklyChart) {
        weeklyChart = new Chart(weeklyCtx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [
                    {
                        label: 'This Week',
                        data: [156, 189, 201, 178, 223, 245, 198],
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Last Week',
                        data: [134, 167, 178, 156, 189, 212, 167],
                        borderColor: '#6b7280',
                        backgroundColor: 'transparent',
                        borderDash: [5, 5],
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'end',
                        labels: { color: '#9ca3af', usePointStyle: true }
                    }
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(75, 85, 99, 0.2)' },
                        ticks: { color: '#6b7280' }
                    },
                    y: {
                        grid: { color: 'rgba(75, 85, 99, 0.2)' },
                        ticks: { color: '#6b7280' }
                    }
                }
            }
        });
    }

    // Language Chart
    const languageCtx = document.getElementById('languageChart');
    if (languageCtx && !languageChart) {
        languageChart = new Chart(languageCtx, {
            type: 'doughnut',
            data: {
                labels: ['Hindi', 'English', 'Tamil', 'Bengali', 'Telugu', 'Marathi', 'Other'],
                datasets: [{
                    data: [42, 25, 12, 8, 6, 4, 3],
                    backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#6b7280'],
                    borderColor: '#111827',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '60%',
                plugins: {
                    legend: {
                        position: 'right',
                        labels: { color: '#9ca3af', padding: 10, font: { size: 11 } }
                    }
                }
            }
        });
    }
}

function initializeReportPreviewChart() {
    const ctx = document.getElementById('reportPreviewChart');
    if (!ctx || reportPreviewChart) return;

    reportPreviewChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Cases',
                data: [12, 19, 15, 17, 14, 8, 4],
                backgroundColor: 'rgba(59, 130, 246, 0.7)',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { display: false }, ticks: { color: '#6b7280' } },
                y: { grid: { color: 'rgba(75, 85, 99, 0.2)' }, ticks: { color: '#6b7280' } }
            }
        }
    });
}

// Initialize Map
function initializeMap() {
    const mapContainer = document.getElementById('indiaMap');
    if (!mapContainer) return;

    // Create map
    map = L.map('indiaMap', {
        center: [22.5, 82],
        zoom: 5,
        zoomControl: true,
        scrollWheelZoom: true
    });

    // Dark tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap contributors © CARTO',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(map);

    if (!mockData) return;

    // Heat data - multiply for higher intensity
    const heatData = mockData.regionData.map(region => [
        region.lat,
        region.lng,
        region.tbSuspected / 10  // Higher intensity for more visible hotspots
    ]);

    heatLayer = L.heatLayer(heatData, {
        radius: 50,           // Larger radius for bigger spots
        blur: 25,             // Moderate blur for smooth edges
        maxZoom: 8,
        max: 35,              // Lower max for more intense colors
        minOpacity: 0.5,      // Ensure minimum visibility
        gradient: {
            0.0: '#22d3ee',   // Cyan (low)
            0.25: '#22c55e',  // Green
            0.5: '#facc15',   // Yellow
            0.75: '#f97316',  // Orange
            1.0: '#ef4444'    // Red (high)
        }
    }).addTo(map);

    // Clickable hotspot markers (always visible, work with heatmap)
    const clickableMarkersLayer = L.layerGroup().addTo(map);
    mockData.regionData.forEach(region => {
        // Create transparent but clickable circle
        const clickableMarker = L.circleMarker([region.lat, region.lng], {
            radius: 25,              // Large clickable area
            fillColor: 'transparent',
            color: 'transparent',
            fillOpacity: 0,
            weight: 0,
            interactive: true        // Make it clickable
        });

        const trendIcon = region.trend === 'up' ? '📈' : region.trend === 'down' ? '📉' : '➡️';
        const trendColor = region.trend === 'up' ? '#ef4444' : region.trend === 'down' ? '#22c55e' : '#64748b';

        // Create detailed popup
        clickableMarker.bindPopup(`
            <div class="map-popup" style="min-width: 200px;">
                <h4 style="font-size: 1.1rem; margin-bottom: 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 0.5rem;">
                    📍 ${region.state}
                </h4>
                <div class="map-popup-stat" style="display: flex; justify-content: space-between; padding: 0.4rem 0;">
                    <span style="color: #94a3b8;">Total Patients</span>
                    <span style="font-weight: 700; font-size: 1.1rem; color: #fff;">${region.totalCases.toLocaleString()}</span>
                </div>
                <div class="map-popup-stat" style="display: flex; justify-content: space-between; padding: 0.4rem 0;">
                    <span style="color: #94a3b8;">TB Suspected</span>
                    <span style="font-weight: 700; font-size: 1.1rem; color: #ef4444;">${region.tbSuspected}</span>
                </div>
                <div class="map-popup-stat" style="display: flex; justify-content: space-between; padding: 0.4rem 0;">
                    <span style="color: #94a3b8;">Trend</span>
                    <span style="font-weight: 600; color: ${trendColor};">${trendIcon} ${region.trend.toUpperCase()}</span>
                </div>
                <div style="margin-top: 0.75rem; padding-top: 0.5rem; border-top: 1px solid rgba(255,255,255,0.2); font-size: 0.8rem; color: #64748b;">
                    Districts: ${region.districts.join(', ')}
                </div>
            </div>
        `, {
            className: 'custom-popup',
            maxWidth: 280
        });

        // Add hover cursor
        clickableMarker.on('mouseover', function () {
            this.setStyle({ cursor: 'pointer' });
        });

        clickableMarkersLayer.addLayer(clickableMarker);
    });

    // Markers layer (visible markers for toggle)
    markersLayer = L.layerGroup();
    mockData.regionData.forEach(region => {
        const marker = L.circleMarker([region.lat, region.lng], {
            radius: Math.sqrt(region.tbSuspected) * 0.8,
            fillColor: getTrendColor(region.trend),
            color: '#fff',
            weight: 2,
            opacity: 0.9,
            fillOpacity: 0.6
        });

        const trendIcon = region.trend === 'up' ? '↑' : region.trend === 'down' ? '↓' : '→';
        const trendClass = `trend-${region.trend}`;

        marker.bindPopup(`
            <div class="map-popup">
                <h4>${region.state}</h4>
                <div class="map-popup-stat">
                    <span>Total Cases</span>
                    <span>${region.totalCases.toLocaleString()}</span>
                </div>
                <div class="map-popup-stat">
                    <span>TB Suspected</span>
                    <span style="color: #ef4444; font-weight: 600;">${region.tbSuspected}</span>
                </div>
                <div class="map-popup-stat">
                    <span>Trend</span>
                    <span class="${trendClass}">${trendIcon} ${region.trend}</span>
                </div>
            </div>
        `);

        markersLayer.addLayer(marker);
    });

    // Map control buttons
    document.querySelectorAll('.map-control-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.map-control-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            if (btn.dataset.layer === 'heat') {
                map.addLayer(heatLayer);
                map.removeLayer(markersLayer);
            } else {
                map.removeLayer(heatLayer);
                map.addLayer(markersLayer);
            }
        });
    });
}

function getTrendColor(trend) {
    switch (trend) {
        case 'up': return '#ef4444';
        case 'down': return '#22c55e';
        default: return '#eab308';
    }
}

// Populate UI with data
function populateUI() {
    if (!mockData) return;
    populateActivityFeed();
    populateQuickStats('weekly');
    populateConversationsTable();
    populateTBCases();
    populateAlerts();
    initializeQuickStatsToggle();
}

function populateActivityFeed() {
    const container = document.getElementById('activityList');
    if (!container || !mockData) return;

    const iconMap = {
        alert: { icon: 'alert-triangle', class: 'alert' },
        chat: { icon: 'message-square', class: 'chat' },
        update: { icon: 'refresh-cw', class: 'update' },
        flag: { icon: 'flag', class: 'flag' },
        report: { icon: 'file-text', class: 'report' },
        milestone: { icon: 'award', class: 'milestone' }
    };

    container.innerHTML = mockData.recentActivity.map(activity => {
        const iconData = iconMap[activity.icon] || iconMap.alert;
        return `
            <div class="activity-item">
                <div class="activity-icon ${iconData.class}">
                    <i data-lucide="${iconData.icon}"></i>
                </div>
                <div class="activity-content">
                    <p class="activity-message">${activity.message}</p>
                    <span class="activity-time">${activity.time}</span>
                </div>
            </div>
        `;
    }).join('');

    lucide.createIcons();
}

function populateQuickStats(period) {
    const container = document.getElementById('quickStats');
    if (!container || !mockData) return;

    const stats = period === 'weekly' ? mockData.weeklyStats : mockData.monthlyStats;

    container.innerHTML = `
        <div class="quick-stat">
            <span class="quick-stat-value">${stats.conversationsThisWeek?.toLocaleString() || stats.conversationsThisMonth?.toLocaleString()}</span>
            <span class="quick-stat-label">Conversations</span>
        </div>
        <div class="quick-stat">
            <span class="quick-stat-value">${stats.tbCasesThisWeek || stats.tbCasesThisMonth}</span>
            <span class="quick-stat-label">TB Cases</span>
        </div>
        <div class="quick-stat">
            <span class="quick-stat-value">${stats.alertsThisWeek || stats.alertsThisMonth}</span>
            <span class="quick-stat-label">Alerts</span>
        </div>
        <div class="quick-stat">
            <span class="quick-stat-value">${stats.regionsActiveThisWeek || stats.regionsActiveThisMonth}</span>
            <span class="quick-stat-label">Active Regions</span>
        </div>
    `;
}

function initializeQuickStatsToggle() {
    const toggleBtns = document.querySelectorAll('.quick-stats-card .toggle-btn');
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            toggleBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            populateQuickStats(btn.dataset.period);
        });
    });
}

function populateConversationsTable() {
    const tbody = document.getElementById('conversationsBody');
    if (!tbody || !mockData) return;

    tbody.innerHTML = mockData.conversations.map(conv => {
        const outcomeClass = conv.outcome === 'TB Risk' ? 'tb-risk' : 'normal';
        const statusClass = conv.status.toLowerCase().replace(' ', '-');

        return `
            <tr data-id="${conv.id}">
                <td><strong>${conv.id}</strong></td>
                <td>${conv.language}</td>
                <td>
                    <div class="symptoms-list">
                        ${conv.symptoms.slice(0, 2).map(s => `<span class="symptom-tag">${s}</span>`).join('')}
                        ${conv.symptoms.length > 2 ? `<span class="symptom-tag">+${conv.symptoms.length - 2}</span>` : ''}
                    </div>
                </td>
                <td><span class="outcome-badge ${outcomeClass}">${conv.outcome}</span></td>
                <td>${conv.timestamp}</td>
                <td><span class="status-pill ${statusClass}">${conv.status}</span></td>
                <td><button class="view-btn" onclick="openConversationModal('${conv.id}')">View</button></td>
            </tr>
        `;
    }).join('');

    // Filter functionality
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterConversations(btn.dataset.filter);
        });
    });

    // Search functionality
    const searchInput = document.getElementById('conversationSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            document.querySelectorAll('#conversationsBody tr').forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(query) ? '' : 'none';
            });
        });
    }
}

function filterConversations(filter) {
    const rows = document.querySelectorAll('#conversationsBody tr');
    rows.forEach(row => {
        const outcome = row.querySelector('.outcome-badge').textContent;
        if (filter === 'all') {
            row.style.display = '';
        } else if (filter === 'tb' && outcome === 'TB Risk') {
            row.style.display = '';
        } else if (filter === 'normal' && outcome === 'Normal') {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function populateTBCases() {
    const container = document.getElementById('tbCasesList');
    if (!container || !mockData) return;

    container.innerHTML = mockData.tbCases.map(tbCase => {
        const severityClass = tbCase.riskLevel.toLowerCase();

        return `
            <div class="case-card">
                <div class="case-severity ${severityClass}"></div>
                <div class="case-info">
                    <div>
                        <span class="case-field-label">Case ID</span>
                        <span class="case-field-value">${tbCase.id}</span>
                    </div>
                    <div>
                        <span class="case-field-label">Risk Level</span>
                        <span class="case-field-value" style="color: ${getRiskColor(tbCase.riskLevel)}">${tbCase.riskLevel}</span>
                    </div>
                    <div>
                        <span class="case-field-label">Region</span>
                        <span class="case-field-value">${tbCase.region}, ${tbCase.district}</span>
                    </div>
                    <div>
                        <span class="case-field-label">Symptoms</span>
                        <span class="case-field-value">${tbCase.symptoms.slice(0, 2).join(', ')}</span>
                    </div>
                    <div>
                        <span class="case-field-label">Action</span>
                        <span class="case-field-value">${tbCase.action}</span>
                    </div>
                </div>
                <div class="case-actions">
                    <button class="btn-primary" onclick="showToast('Case opened for review', 'success')">
                        <i data-lucide="external-link"></i>
                        Review
                    </button>
                </div>
            </div>
        `;
    }).join('');

    lucide.createIcons();
}

function getRiskColor(risk) {
    switch (risk.toLowerCase()) {
        case 'critical': return '#ef4444';
        case 'high': return '#f59e0b';
        case 'medium': return '#3b82f6';
        case 'low': return '#10b981';
        default: return '#9ca3af';
    }
}

function populateAlerts() {
    const container = document.getElementById('alertsList');
    if (!container || !mockData) return;

    const severityIcons = {
        'Critical': 'alert-octagon',
        'High': 'alert-triangle',
        'Medium': 'alert-circle',
        'Low': 'info'
    };

    container.innerHTML = mockData.alerts.map(alert => {
        const severityClass = alert.severity.toLowerCase();
        const statusClass = alert.status.toLowerCase().replace(' ', '-');

        return `
            <div class="alert-card">
                <div class="alert-severity ${severityClass}">
                    <i data-lucide="${severityIcons[alert.severity] || 'alert-circle'}"></i>
                </div>
                <div class="alert-content">
                    <span class="alert-type">${alert.type}</span>
                    <p class="alert-message">${alert.message}</p>
                    <div class="alert-meta">
                        <span><i data-lucide="map-pin" style="width:14px;height:14px;display:inline;vertical-align:middle;margin-right:4px;"></i>${alert.region}${alert.district !== 'N/A' ? `, ${alert.district}` : ''}</span>
                        <span><i data-lucide="clock" style="width:14px;height:14px;display:inline;vertical-align:middle;margin-right:4px;"></i>${alert.timestamp}</span>
                    </div>
                </div>
                <span class="alert-status ${statusClass}">${alert.status}</span>
                <div class="alert-action">
                    <button class="btn-secondary" onclick="showToast('Alert marked for review', 'success')">
                        <i data-lucide="eye"></i>
                        Review
                    </button>
                </div>
            </div>
        `;
    }).join('');

    lucide.createIcons();
}

// Modal functionality
window.openConversationModal = function (conversationId) {
    const modal = document.getElementById('conversationModal');
    const conversation = mockData.conversations.find(c => c.id === conversationId);

    if (!conversation || !modal) return;

    document.getElementById('modalConversationId').textContent = conversation.id;

    // Populate meta
    document.getElementById('conversationMeta').innerHTML = `
        <div class="meta-item">
            <span class="meta-label">Language</span>
            <span class="meta-value">${conversation.language}</span>
        </div>
        <div class="meta-item">
            <span class="meta-label">Region</span>
            <span class="meta-value">${conversation.region}</span>
        </div>
        <div class="meta-item">
            <span class="meta-label">Outcome</span>
            <span class="meta-value" style="color: ${conversation.outcome === 'TB Risk' ? '#ef4444' : '#10b981'}">${conversation.outcome}</span>
        </div>
        <div class="meta-item">
            <span class="meta-label">Risk Level</span>
            <span class="meta-value" style="color: ${getRiskColor(conversation.riskLevel)}">${conversation.riskLevel}</span>
        </div>
    `;

    // Populate chat
    document.getElementById('chatContainer').innerHTML = conversation.messages.map(msg => `
        <div class="chat-bubble ${msg.sender} ${msg.highlight ? 'highlight' : ''}">
            <span class="chat-label">${msg.sender === 'user' ? 'User' : 'ArogyaAI'}</span>
            ${msg.text}
            <div class="chat-time">${msg.time}</div>
        </div>
    `).join('');

    modal.classList.add('active');
};

// Event listeners
function initializeEventListeners() {
    // Close modal
    document.getElementById('closeModal')?.addEventListener('click', () => {
        document.getElementById('conversationModal').classList.remove('active');
    });

    document.getElementById('conversationModal')?.addEventListener('click', (e) => {
        if (e.target.id === 'conversationModal') {
            e.target.classList.remove('active');
        }
    });

    // Escape key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.getElementById('conversationModal')?.classList.remove('active');
        }
    });

    // Report download buttons (mock)
    document.querySelectorAll('.btn-icon').forEach(btn => {
        btn.addEventListener('click', () => {
            showToast('Download started (Demo)', 'success');
        });
    });
}

// Toast notifications
window.showToast = function (message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icons = {
        success: 'check-circle',
        error: 'x-circle',
        warning: 'alert-triangle'
    };

    toast.innerHTML = `
        <i data-lucide="${icons[type] || 'info'}"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);
    lucide.createIcons();

    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
};

// Update last updated time
function updateLastUpdated() {
    const el = document.getElementById('lastUpdated');
    if (el) {
        const now = new Date();
        el.textContent = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

// Simulate real-time updates
setInterval(() => {
    updateLastUpdated();
}, 60000);
