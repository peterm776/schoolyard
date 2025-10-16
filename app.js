import { getAuth, onAuthStateChanged, signOut, updateProfile } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, collection, doc, getDoc, onSnapshot, query, where, getDocs, collectionGroup, runTransaction, serverTimestamp, orderBy } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-storage.js";
import * as V from './views.js';
import * as C from './constants.js';
import { attachHandlersToWindow } from './handlers.js';
import { applyTheme, showToast } from './utils.js';
import { GoogleGenAI } from "https://esm.run/@google/genai";

export class SchoolApp {
    auth;
    db;
    storage;
    ai;
    
    state = {
        user: null, school: null, allUsers: [], users: [], students: [], teachers: [], courses: [],
        dayTypes: [], timeBlocks: [], masterCalendar: [], schedules: [],
        assignments: [], grades: [], attendance: [], attendanceNotes: [], events: [], announcements: [],
        tuitionItems: [], launchpadLinks: [], gradingPeriods: [], reportCardTemplates: [], generatedReportCards: [],
        homeworkSubmissions: [],
        incidents: [], lunchMenu: [], eventCategories: [],
        // Version 2.0 State
        quizzes: [], quizSubmissions: [], messages: [],
        unsubscribeListeners: [], currentCalendar: null,
    };

    routes;

    constructor(firebaseApp) {
        this.auth = getAuth(firebaseApp);
        this.db = getFirestore(firebaseApp);
        this.storage = getStorage(firebaseApp);
        
        // Initialize Gemini AI
        const apiKey = C.GEMINI_API_KEY;
        if (apiKey && apiKey !== "YOUR_API_KEY_HERE") {
            try {
                 this.ai = new GoogleGenAI({ apiKey });
            } catch (error) {
                console.error("Could not initialize GoogleGenAI. Please check your API key.", error);
                this.ai = null;
            }
        } else {
            console.warn("Gemini API key is not configured. AI features will be disabled.");
            this.ai = null;
        }

        this.routes = {
            'myday': { render: (ids, params) => V.renderMyDay(this) }, 
            'dashboard': { render: (ids, params) => V.renderParentDashboard(this) },
            'launchpad': { render: (ids, params) => V.renderLaunchpad(this) },
            'courses': { render: (ids, params) => V.renderCourses(this, ids, params) }, 
            'homework': { render: (ids, params) => V.renderHomework(this) },
            'schedule': { render: (ids, params) => V.renderScheduleEditor(this, ids) },
            'attendance': { render: (ids, params) => V.renderAttendance(this) },
            'gradebook': { render: (ids, params) => V.renderGradebook(this, ids, params) }, 
            'tuition': { render: (ids, params) => V.renderTuition(this) },
            'calendar': { render: (ids, params) => V.renderCalendar(this) }, 
            'users': { render: (ids, params) => V.renderUsers(this) },
            'profile': { render: (ids, params) => V.renderProfile(this) }, 
            'settings': { render: (ids, params) => V.renderSettings(this, ids, params) },
            'reports': { render: (ids, params) => V.renderReports(this, ids, params) }, 
            'report-cards': { render: (ids, params) => V.renderReportCards(this, ids, params) },
            'behavior': { render: (ids, params) => V.renderBehaviorLog(this) },
            'lunch': { render: (ids, params) => V.renderLunchMenu(this) },
            // Version 2.0 Routes
            'ai-assistant': { render: (ids, params) => V.renderAiAssistant(this, params) },
            'directory': { render: (ids, params) => V.renderDirectory(this) },
            'messages': { render: (ids, params) => V.renderMessages(this, ids) },
        };
    }

    initialize() {
        onAuthStateChanged(this.auth, this.onAuthStateChanged.bind(this));
        window.addEventListener('hashchange', this.router.bind(this));
        window.addEventListener('load', () => {
             if (!window.location.hash || window.location.hash === '#/') {
                window.location.hash = '#/login';
            }
            this.router();
        });
        attachHandlersToWindow(this);
    }

    // AUTH & DATA FLOW
    async onAuthStateChanged(user) {
        if (user) {
            document.getElementById('router-outlet').innerHTML = C.templates.authView;
            try {
                await this.findUserSchool(user);
            } catch (error) {
                console.error("Error during authentication process:", error);
                this.handleAuthError();
            }
        } else {
            this.state.user = null;
            this.state.school = null;
            this.clearListeners();
            if (!window.location.hash.startsWith('#/login') && !window.location.hash.startsWith('#/signup') && !window.location.hash.startsWith('#/create-school')) {
                window.location.hash = '#/login';
            } else {
                this.router();
            }
        }
    }

    async findUserSchool(user) {
        const q = query(collectionGroup(this.db, 'users'), where('uid', '==', user.uid));
        const userDocs = await getDocs(q);
        if (userDocs.empty) { // User exists in Auth, but not in any school's user subcollection
            this.handleNoSchoolFound(user);
        } else {
            const userDoc = userDocs.docs[0];
            const schoolRef = userDoc.ref.parent.parent;
            const schoolDoc = await getDoc(schoolRef);
            this.state.school = { id: schoolDoc.id, ...schoolDoc.data() };
            this.state.user = { id: userDoc.id, ...userDoc.data() };
            this.onSchoolFound();
        }
    }
    
    handleNoSchoolFound(user) {
        const emailQuery = query(collectionGroup(this.db, 'users'), where('email', '==', user.email), where('isPlaceholder', '==', true));
        getDocs(emailQuery).then(placeholderDocs => {
            if (!placeholderDocs.empty) {
                // Found a placeholder invitation. Link account.
                const userDocRef = placeholderDocs.docs[0].ref;
                runTransaction(this.db, async (transaction) => {
                    transaction.update(userDocRef, { uid: user.uid, isPlaceholder: false });
                }).then(() => this.findUserSchool(user)); // Re-run the process
            } else {
                // No school and no invitation. Prompt to create a school.
                window.location.hash = '#/create-school';
                this.router();
            }
        });
    }

    onSchoolFound() {
        applyTheme(this.state.school.theme);
        const favicon = document.getElementById('favicon');
        if (this.state.school.faviconUrl) favicon.href = this.state.school.faviconUrl;

        document.getElementById('router-outlet').innerHTML = C.templates.appView;
        this.setupDataListeners();
        this.router();
    }

    handleAuthError() {
        signOut(this.auth);
        showToast("An error occurred. Please log in again.", 'error');
        window.location.hash = '#/login';
        this.router();
    }
    
    clearListeners() {
        this.state.unsubscribeListeners.forEach(unsub => unsub());
        this.state.unsubscribeListeners = [];
    }

    setupDataListeners() {
        this.clearListeners();
        const schoolId = this.state.school.id;
        const collectionsToListen = [
            'allUsers:users', 'courses', 'dayTypes', 'timeBlocks', 'masterCalendar', 'schedules',
            'assignments', 'grades', 'attendance', 'attendanceNotes', 'events', 'announcements',
            'tuitionItems', 'launchpadLinks', 'gradingPeriods', 'reportCardTemplates',
            'generatedReportCards', 'homeworkSubmissions', 'incidents', 'lunchMenu', 'eventCategories',
            'quizzes', 'quizSubmissions',
        ];

        collectionsToListen.forEach(name => {
            const [stateKey, collectionName] = name.includes(':') ? name.split(':') : [name, name];
            const q = collection(this.db, 'schools', schoolId, collectionName);
            const unsub = onSnapshot(q, (snapshot) => {
                this.state[stateKey] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                this.onDataUpdate(stateKey);
            }, (error) => console.error(`Error listening to ${collectionName}:`, error));
            this.state.unsubscribeListeners.push(unsub);
        });

        // Special listener for messages (involves current user)
        const messagesQuery = query(collection(this.db, 'schools', schoolId, 'messages'), where('participantIds', 'array-contains', this.state.user.id), orderBy('lastUpdatedAt', 'desc'));
        const unsubMessages = onSnapshot(messagesQuery, (snapshot) => {
            this.state.messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            this.onDataUpdate('messages');
        }, (error) => console.error(`Error listening to messages:`, error));
        this.state.unsubscribeListeners.push(unsubMessages);
    }
    
    onDataUpdate(collectionName) {
        if (collectionName === 'allUsers') {
            this.state.users = this.state.allUsers.filter(u => !u.isPlaceholder);
            this.state.students = this.state.users.filter(u => u.role === 'student');
            this.state.teachers = this.state.users.filter(u => u.role === 'teacher');
        }
        this.router();
    }

    // ROUTER
    getRoute() {
        const hash = window.location.hash.substring(2) || 'myday';
        const [path, query] = hash.split('?');
        const pathParts = path.split('/').filter(p => p);
        const page = pathParts[0] || 'myday';
        const ids = pathParts.slice(1);
        const params = new URLSearchParams(query);
        return [page, ids, params];
    }
    
    router() {
        const [page, ids, params] = this.getRoute();
        const route = this.routes[page];
        
        if (page === 'login' || page === 'signup' || page === 'create-school') {
            document.getElementById('router-outlet').innerHTML = C.templates.authView;
            if (page === 'login') V.renderLoginView(this);
            if (page === 'signup') V.renderSignupView(this);
            if (page === 'create-school') V.renderCreateSchoolView(this);
            return;
        }

        if (!this.state.user) return; // Wait for user data

        if (document.getElementById('main-content')) {
            V.renderAppShell(this);
            if (route) {
                try {
                    route.render(ids, params);
                } catch (error) {
                    console.error(`Error rendering page ${page}:`, error);
                    document.getElementById('content').innerHTML = `<p class="text-red-500">Error rendering this page.</p>`;
                }
            } else {
                V.renderMyDay(this); // Fallback to a default page
            }
        }
    }
    
    // UTILITY/HELPER METHODS
    getEnrolledStudentIds(courseId) {
        const studentIds = new Set();
        this.state.schedules.forEach(scheduleDoc => {
            Object.values(scheduleDoc.schedule).forEach(cId => {
                if (cId === courseId) {
                    studentIds.add(scheduleDoc.studentId);
                }
            });
        });
        return Array.from(studentIds);
    }

    canEdit(item) {
        const user = this.state.user;
        if (!user) return false;
        if (user.role === 'admin') return true;
        if (user.role === 'teacher' && item.teacherId === user.id) return true;
        return false;
    }
}
