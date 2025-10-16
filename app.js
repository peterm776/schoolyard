import { getAuth, onAuthStateChanged, signOut, updateProfile } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, collection, doc, getDoc, onSnapshot, query, where, getDocs, collectionGroup, runTransaction, serverTimestamp, orderBy } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-storage.js";
import * as V from './views.js';
import * as C from './constants.js';
import { attachHandlersToWindow } from './handlers.js';
import { applyTheme, showToast } from './utils.js';

export class SchoolApp {
    auth;
    db;
    storage;
    
    state = {
        user: null, school: null, allUsers: [], users: [], students: [], teachers: [], courses: [],
        dayTypes: [], timeBlocks: [], masterCalendar: [], schedules: [],
        assignments: [], grades: [], attendance: [], attendanceNotes: [], events: [], announcements: [],
        tuitionItems: [], launchpadLinks: [], gradingPeriods: [], reportCardTemplates: [], generatedReportCards: [],
        homeworkSubmissions: [],
        incidents: [], lunchMenu: [], eventCategories: [],
        unsubscribeListeners: [], currentCalendar: null,
    };

    routes;

    constructor(firebaseApp) {
        this.auth = getAuth(firebaseApp);
        this.db = getFirestore(firebaseApp);
        this.storage = getStorage(firebaseApp);
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
                await this.findAndSetSchoolData(user);
            } catch (error) {
                console.error("Error setting school data:", error);
                if (error.message === 'User not found in any school.') {
                    V.renderSignupView(this);
                } else {
                    showToast(error.message, 'error');
                }
            }
        } else {
            this.resetState();
            this.router();
        }
    }

    async findAndSetSchoolData(user) {
        const schoolsRef = collection(this.db, 'schools');
        const schoolSnapshot = await getDocs(schoolsRef);
        let foundSchool = null;
        let foundUserDoc = null;

        for (const schoolDoc of schoolSnapshot.docs) {
            const userRef = doc(this.db, 'schools', schoolDoc.id, 'users', user.uid);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
                foundSchool = { id: schoolDoc.id, ...schoolDoc.data() };
                foundUserDoc = userDoc;
                break;
            }
        }

        if (foundSchool && foundUserDoc) {
            this.state.school = foundSchool;
            this.state.user = { id: foundUserDoc.id, ...foundUserDoc.data() };
            document.getElementById('router-outlet').innerHTML = C.templates.appView;
            V.renderAppShell(this);
            applyTheme(this.state.school.theme);
            await this.attachDataListeners();
            if (!window.location.hash || ['#/login', '#/signup', '#/create-school', '#/'].includes(window.location.hash)) {
                window.location.hash = this.state.user.role === 'parent' ? '#/dashboard' : '#/myday';
            }
            this.router();
        } else {
            const potentialUserQuery = query(collectionGroup(this.db, 'users'), where('email', '==', user.email), where('isPlaceholder', '==', true));
            const potentialDocs = await getDocs(potentialUserQuery);
            if (!potentialDocs.empty) {
                const placeholderDoc = potentialDocs.docs[0];
                const schoolId = placeholderDoc.ref.parent.parent.id;
                await runTransaction(this.db, async (transaction) => {
                    transaction.delete(placeholderDoc.ref);
                    const newUserRef = doc(this.db, 'schools', schoolId, 'users', user.uid);
                    transaction.set(newUserRef, { ...placeholderDoc.data(), uid: user.uid, isPlaceholder: false });
                });
                await this.findAndSetSchoolData(user);
            } else {
                 throw new Error('User not found in any school.');
            }
        }
    }

    attachDataListeners() {
        this.unsubscribeListeners.forEach(unsub => unsub());
        this.unsubscribeListeners = [];
        this.listenForData('users', null, 'allUsers');
        this.listenForData('courses');
        this.listenForData('dayTypes');
        this.listenForData('timeBlocks');
        this.listenForData('masterCalendar');
        this.listenForData('schedules');
        this.listenForData('assignments', orderBy('dueDate', 'desc'));
        this.listenForData('grades');
        this.listenForData('attendance');
        this.listenForData('attendanceNotes');
        this.listenForData('announcements', orderBy('createdAt', 'desc'));
        this.listenForData('events');
        this.listenForData('tuitionItems');
        this.listenForData('launchpadLinks');
        this.listenForData('gradingPeriods');
        this.listenForData('reportCardTemplates');
        this.listenForData('generatedReportCards');
        this.listenForData('homeworkSubmissions');
        this.listenForData('incidents', orderBy('date', 'desc'));
        this.listenForData('lunchMenu');
    }

    listenForData(collectionName, qConstraints, stateKey = collectionName) {
        let collQuery = collection(this.db, 'schools', this.state.school.id, collectionName);
        if (qConstraints) {
            collQuery = query(collQuery, qConstraints);
        }
        const unsubscribe = onSnapshot(collQuery, (snapshot) => {
            this.state[stateKey] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            if(stateKey === 'allUsers') {
                this.state.students = this.state.allUsers.filter(u => u.role === 'student');
                this.state.teachers = this.state.allUsers.filter(u => u.role === 'teacher');
            }
            this.router(); // Re-render the current view with new data
        }, (error) => {
            console.error(`Error listening to ${collectionName}:`, error);
            showToast(`Could not load ${collectionName}.`, 'error');
        });
        this.unsubscribeListeners.push(unsubscribe);
    }
    
    resetState() {
        this.unsubscribeListeners.forEach(unsub => unsub());
        this.state = { 
            user: null, school: null, allUsers: [], users: [], students: [], teachers: [], courses: [],
            dayTypes: [], timeBlocks: [], masterCalendar: [], schedules: [],
            assignments: [], grades: [], attendance: [], attendanceNotes: [], events: [], announcements: [],
            tuitionItems: [], launchpadLinks: [], gradingPeriods: [], reportCardTemplates: [], generatedReportCards: [],
            homeworkSubmissions: [],
            incidents: [], lunchMenu: [], eventCategories: [],
            unsubscribeListeners: [], currentCalendar: null,
        };
    }
    
    getRoute() {
        const hash = window.location.hash.slice(2) || 'login';
        const [page, ...ids] = hash.split('/');
        const params = new URLSearchParams(window.location.hash.split('?')[1]);
        return [page, ids, params];
    }
    
    router() {
        const [page, ids, params] = this.getRoute();
        const outlet = document.getElementById('router-outlet');
        if (!outlet) return;

        if (!this.state.user) {
            outlet.innerHTML = C.templates.authView;
            if (page === 'signup') V.renderSignupView(this);
            else if (page === 'create-school') V.renderCreateSchoolView(this);
            else V.renderLoginView(this);
            return;
        }
        
        const route = this.routes[page];
        if (route) {
            V.populateNav(this);
            try {
                route.render(ids, params);
            } catch (error) {
                 console.error(`Error rendering page ${page}:`, error);
                 document.getElementById('content').innerHTML = `<p class="text-red-500">Error loading this page.</p>`;
            }
        } else {
            window.location.hash = '#/myday';
        }
    }
    
    // --- HELPERS ---
    getEnrolledStudentIds(courseId) {
        const courseSchedules = this.state.schedules.filter(s => Object.values(s.schedule).includes(courseId));
        return courseSchedules.map(s => s.studentId);
    }

    canEdit(item) {
        const user = this.state.user;
        if (!user || !item) return false;
        if (user.role === 'admin') return true;
        if (user.role === 'teacher' && item.teacherId === user.id) return true;
        return false;
    }
}
