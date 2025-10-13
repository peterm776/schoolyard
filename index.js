import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { SchoolApp } from './app.js';
import { firebaseConfig } from './config.js';

try {
    // Initialize Firebase
    const firebaseApp = initializeApp(firebaseConfig);
    
    // Create and initialize the main application
    const schoolApp = new SchoolApp(firebaseApp);
    schoolApp.initialize();

} catch (error) {
    console.error("Failed to initialize the application:", error);
    const outlet = document.getElementById('router-outlet');
    if (outlet) {
        outlet.innerHTML = `<div class="h-screen w-screen flex items-center justify-center p-4"><div class="bg-white p-8 rounded-lg shadow-xl text-center"><h1 class="text-2xl font-bold text-red-600 mb-2">Application Error</h1><p class="text-slate-600">Could not start the application. Please check the console for details.</p></div></div>`;
    }
}
