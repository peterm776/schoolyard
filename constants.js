export const GEMINI_API_KEY = "YOUR_API_KEY_HERE"; // IMPORTANT: Replace with your actual Gemini API Key

export const palettes = {
    sky: { 100: "224 242 254", 400: "#38bdf8", 500: "#0ea5e9", 600: "#0284c7", 700: "#0369a1" },
    indigo: { 100: "224 231 255", 400: "#818cf8", 500: "#6366f1", 600: "#4f46e5", 700: "#4338ca" },
    emerald: { 100: "209 250 229", 400: "#34d399", 500: "#10b981", 600: "#059669", 700: "#047857" },
    rose: { 100: "255 228 230", 400: "#fb7185", 500: "#f43f5e", 600: "#e11d48", 700: "#be123c" }
};

export const allNavLinks = {
    // Student & Parent
    myday: { href: 'myday', text: 'My Day', icon: `<svg class="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a2 2 0 002 2h10a2 2 0 002-2V10M9 20h6"/></svg>`},
    parentDashboard: { href: 'dashboard', text: 'Dashboard', icon: `<svg class="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>`},
    // Academics
    courses: { href: 'courses', text: 'Courses', icon: `<svg class="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0v6" /></svg>`},
    homework: { href: 'homework', text: 'Homework', icon: `<svg class="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>`},
    gradebook: { href: 'gradebook', text: 'Gradebook', icon: `<svg class="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h4M8 7a2 2 0 012-2h4a2 2 0 012 2v8a2 2 0 01-2 2h-4a2 2 0 01-2-2z"/></svg>`},
    reportCards: { href: 'report-cards', text: 'Report Cards', icon: `<svg class="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>`},
    ai_assistant: { href: 'ai-assistant', text: 'AI Assistant', icon: `<svg class="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>`},
    // Community
    directory: { href: 'directory', text: 'Directory', icon: `<svg class="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A5.995 5.995 0 0012 12a5.995 5.995 0 00-3-5.197m-2 5.197a4 4 0 110-5.292" /></svg>`},
    messages: { href: 'messages', text: 'Messages', icon: `<svg class="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>`},
    calendar: { href: 'calendar', text: 'Calendar', icon: `<svg class="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>`},
    launchpad: { href: 'launchpad', text: 'Launchpad', icon: `<svg class="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>`},
    // Administration
    users: { href: 'users', text: 'Users', icon: `<svg class="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A5.995 5.995 0 0012 12a5.995 5.995 0 00-3-5.197m-2 5.197a4 4 0 110-5.292" /></svg>`},
    attendance: { href: 'attendance', text: 'Attendance', icon: `<svg class="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>`},
    tuition: { href: 'tuition', text: 'Tuition & Billing', icon: `<svg class="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>`},
    reports: { href: 'reports', text: 'Reports', icon: `<svg class="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h2l2-2h4l2 2h2a2 2 0 012 2v10a2 2 0 01-2 2z" /></svg>`},
    settings: { href: 'settings', text: 'Settings', icon: `<svg class="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.096 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>`},
    // Personal
    profile: { href: 'profile', text: 'Profile', icon: `<svg class="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>`},
};

export const navSections = {
    student: [
        { title: 'Home', links: ['myday'] },
        { title: 'Academics', links: ['courses', 'homework', 'gradebook', 'reportCards'] },
        { title: 'Community', links: ['directory', 'messages', 'calendar', 'launchpad'] },
        { title: 'Finances', links: ['tuition'] },
        { title: 'Personal', links: ['profile'] }
    ],
    parent: [
        { title: 'Home', links: ['parentDashboard'] },
        { title: 'Academics', links: ['homework', 'gradebook', 'reportCards'] },
        { title: 'Community', links: ['directory', 'messages', 'calendar', 'launchpad'] },
        { title: 'Finances', links: ['tuition', 'reports'] },
        { title: 'Personal', links: ['profile'] }
    ],
    teacher: [
        { title: 'Home', links: ['myday'] },
        { title: 'Academics', links: ['courses', 'homework', 'attendance', 'gradebook', 'reportCards', 'ai_assistant'] },
        { title: 'Community', links: ['directory', 'messages', 'calendar', 'launchpad'] },
        { title: 'Personal', links: ['profile'] }
    ],
    admin: [
        { title: 'Home', links: ['myday'] },
        { title: 'Academics', links: ['courses', 'homework', 'gradebook', 'reportCards', 'ai_assistant'] },
        { title: 'Community', links: ['directory', 'messages', 'calendar', 'launchpad'] },
        { title: 'Administration', links: ['users', 'attendance', 'tuition', 'reports', 'settings'] },
        { title: 'Personal', links: ['profile'] }
    ]
};

export const templates = {
    authView: `
        <div class="h-screen w-screen flex flex-col items-center justify-center bg-slate-100 p-4" style="background-image: url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2128&auto=format&fit=crop'); background-size: cover; background-position: center;">
            <div id="view-container" class="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl text-center max-w-sm w-full">
                <div class="loader-container h-32 flex items-center justify-center"><div class="loader"></div></div>
            </div>
        </div>`,
    appView: `
        <div class="flex h-screen">
            <aside id="sidebar" class="sidebar fixed top-0 left-0 h-full bg-slate-900 text-white w-64 p-6 z-20 md:translate-x-0 overflow-y-auto">
                <div id="sidebar-header" class="flex items-center justify-center mb-10 h-10"></div>
                <nav id="nav"></nav>
                <div class="absolute bottom-4 left-0 right-0 text-center text-xs text-slate-500">Version 2.0.0</div>
            </aside>
            <main id="main-content" class="main-content flex-1 md:ml-64 overflow-y-auto">
                <div class="p-6 md:p-8">
                    <header class="flex justify-between items-center mb-8">
                        <button id="sidebar-toggle" class="md:hidden p-2 rounded-md bg-slate-200 text-slate-800">
                            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
                        </button>
                        <h2 id="page-title" class="text-3xl font-bold text-slate-800"></h2>
                        <div class="flex items-center">
                            <div id="user-info" class="text-right hidden sm:block"></div>
                            <button id="logout-button" title="Logout" class="ml-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                                <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd" /></svg>
                            </button>
                        </div>
                    </header>
                    <div id="content" class="bg-white rounded-xl shadow-md p-6 min-h-[calc(100vh-150px)]">
                        <div class="loader-container h-64 flex items-center justify-center"><div class="loader"></div></div>
                    </div>
                </div>
            </main>
        </div>`
};