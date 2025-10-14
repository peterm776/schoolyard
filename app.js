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
                await this.findUserSchoolAndLogin(user);
            } catch (error) {
                console.error("Login process failed:", error);
                showToast(`An error occurred during login: ${error.message}`, 'error');
                await signOut(this.auth); 
            }
        } else {
            this.handleLogout();
            this.router(); 
        }
    }

    async findUserSchoolAndLogin(user) {
        const userQueryByEmail = query(collectionGroup(this.db, 'users'), where('email', '==', user.email));
        const userSnapshotByEmail = await getDocs(userQueryByEmail);

        if (!userSnapshotByEmail.empty) {
            const userDoc = userSnapshotByEmail.docs[0];
            const schoolId = userDoc.ref.parent.parent.id;

            if (userDoc.data().isPlaceholder) {
                try {
                    await runTransaction(this.db, async (transaction) => {
                        const placeholderRef = userDoc.ref;
                        const newUserRef = doc(this.db, 'schools', schoolId, 'users', user.uid);
                        const pDoc = await transaction.get(placeholderRef);
                        if (!pDoc.exists()) {
                            throw new Error("This invitation has already been used or is invalid.");
                        }
                        const userData = pDoc.data();
                        transaction.set(newUserRef, { ...userData, uid: user.uid, displayName: user.displayName || userData.displayName, isPlaceholder: false, createdAt: serverTimestamp() });
                        transaction.delete(placeholderRef);
                    });
                    showToast('Account activated successfully!', 'success');
                    await this.loginToSchool(user.uid, schoolId);
                } catch (e) {
                    console.error("Activation transaction failed: ", e);
                    showToast(`Account activation failed: ${e.message}. Please contact your administrator.`, 'error');
                    await signOut(this.auth);
                }
            } else {
                if (userDoc.id !== user.uid) {
                    // It's possible for an admin to create an account for an email that already exists
                    // Let's check if the existing user is just trying to log in.
                    if (userDoc.data().uid === user.uid) {
                         await this.loginToSchool(userDoc.id, schoolId);
                    } else {
                         throw new Error("User account mismatch. An account with this email already exists.");
                    }
                } else {
                    await this.loginToSchool(userDoc.id, schoolId);
                }
            }
        } else {
            const [page] = this.getRoute();
            if (page !== 'create-school' && page !== 'signup') {
                showToast("No invitation found for this email address.", "error");
                await signOut(this.auth);
            } else {
                this.router();
            }
        }
    }
    
    async loginToSchool(userId, schoolId) {
        const schoolDoc = await getDoc(doc(this.db, 'schools', schoolId));
        const userDoc = await getDoc(doc(this.db, 'schools', schoolId, 'users', userId));
        if (schoolDoc.exists() && userDoc.exists()) {
            this.state.school = { id: schoolId, ...schoolDoc.data() };
            this.state.user = { id: userId, ...userDoc.data() };
            
            const favicon = document.getElementById('favicon');
            if (this.state.school.logoUrl && favicon) {
                favicon.href = this.state.school.logoUrl;
            }

            applyTheme(this.state.school.theme);
            await this.setupRealtimeListeners();
        } else {
            showToast("Your school or user account could not be found.", "error");
            await signOut(this.auth);
        }
    }

    handleLogout() {
        if (this.state.unsubscribeListeners.length > 0) this.state.unsubscribeListeners.forEach(unsub => unsub());
        Object.keys(this.state).forEach(key => { (this.state)[key] = Array.isArray(this.state[key]) ? [] : null; });
        window.location.hash = '#/login';
    }

    async setupRealtimeListeners() {
        if (this.state.unsubscribeListeners.length > 0) {
            this.state.unsubscribeListeners.forEach(unsub => unsub());
            this.state.unsubscribeListeners = [];
        }
    
        const handleListenerError = (key, error) => {
            console.error(`Error listening to ${key}:`, error);
            showToast(`Permission error fetching '${key}'.`, 'error');
        };

        const schoolUnsub = onSnapshot(doc(this.db, 'schools', this.state.school.id), (doc) => {
            if (this.state.user) {
                const oldTheme = this.state.school?.theme;
                this.state.school = { id: doc.id, ...doc.data() };
                if (this.state.school.theme !== oldTheme) applyTheme(this.state.school.theme);
                const favicon = document.getElementById('favicon');
                if (favicon) {
                    if (this.state.school.logoUrl) {
                        favicon.href = this.state.school.logoUrl;
                    } else {
                        favicon.href = 'data:;base64,iVBORw0KGgo=';
                    }
                }
                if (document.getElementById('main-content')) V.renderAppShell(this);
            }
        }, (err) => handleListenerError('school', err));
        this.state.unsubscribeListeners.push(schoolUnsub);
    
        const handleSnapshot = (key, snapshot) => {
            if (!this.state.user) return;
            (this.state)[key] = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            if (key === 'users') {
                this.state.allUsers = this.state.users;
                this.state.students = this.state.users.filter(u => u.role === 'student');
                this.state.teachers = this.state.users.filter(u => u.role === 'teacher');
            }
            this.router(); 
        };
    
        const role = this.state.user.role;
        let collectionsToListen = [];

        if (role === 'admin') {
            collectionsToListen = ['users', 'courses', 'dayTypes', 'timeBlocks', 'masterCalendar', 'schedules', 'assignments', 'grades', 'attendance', 'attendanceNotes', 'events', 'announcements', 'tuitionItems', 'launchpadLinks', 'gradingPeriods', 'reportCardTemplates', 'generatedReportCards', 'homeworkSubmissions'];
        } else if (role === 'teacher') {
            collectionsToListen = ['users', 'courses', 'dayTypes', 'timeBlocks', 'masterCalendar', 'schedules', 'assignments', 'grades', 'attendance', 'attendanceNotes', 'events', 'announcements', 'gradingPeriods', 'reportCardTemplates', 'launchpadLinks', 'homeworkSubmissions'];
        } else {
            collectionsToListen = ['users', 'courses', 'dayTypes', 'timeBlocks', 'masterCalendar', 'events', 'announcements', 'launchpadLinks', 'assignments', 'gradingPeriods'];
        }
        
        collectionsToListen.forEach(key => {
            const q = query(collection(this.db, 'schools', this.state.school.id, key));
            const unsub = onSnapshot(q, (snap) => handleSnapshot(key, snap), (err) => handleListenerError(key, err));
            this.state.unsubscribeListeners.push(unsub);
        });

        if (role === 'student' || role === 'parent') {
            const studentIds = role === 'parent' ? (this.state.user.childrenIds || []) : [this.state.user.id];

            if (studentIds.length > 0) {
                 const collectionsToFilter = ['grades', 'tuitionItems', 'generatedReportCards', 'schedules', 'homeworkSubmissions'];
                 collectionsToFilter.forEach(key => {
                     const q = query(collection(this.db, 'schools', this.state.school.id, key), where('studentId', 'in', studentIds));
                     const unsub = onSnapshot(q, (snap) => handleSnapshot(key, snap), (err) => handleListenerError(key, err));
                     this.state.unsubscribeListeners.push(unsub);
                 });
            }
        }
    }
    
    // ROUTING
    getRoute() {
        const hash = window.location.hash.replace('#/', '');
        const [part1, part2] = hash.split('?');
        const [page, ...rest] = part1.split('/');
        return [page || 'login', rest, new URLSearchParams(part2 || '')];
    }

    router() {
        const outlet = document.getElementById('router-outlet');
        if (!outlet) return;

        const [page, idParts, params] = this.getRoute();

        if (this.auth.currentUser && this.state.school) {
            if (!document.getElementById('main-content')) {
                outlet.innerHTML = C.templates.appView;
                V.renderAppShell(this);
            }
            V.populateNav(this); // Always update nav for active link highlighting
            const renderFunction = this.routes[page]?.render;
            if (renderFunction) {
                renderFunction(idParts, params);
            } else {
                const defaultRoute = this.state.user.role === 'parent' ? 'dashboard' : 'myday';
                window.location.hash = `#/${defaultRoute}`;
            }
        } else {
            outlet.innerHTML = C.templates.authView;
            const authRoutes = {
                'login': () => V.renderLoginView(this),
                'signup': () => V.renderSignupView(this),
                'create-school': () => V.renderCreateSchoolView(this)
            };
            (authRoutes[page] || authRoutes.login)();
        }
    }

    // HELPERS
    canEdit(course) {
        if(!this.state.user) return false;
        const { role, id } = this.state.user;
        if (role === 'admin') return true;
        if (role === 'teacher' && course && course.teacherId === id) return true;
        return false;
    }

    getEnrolledStudentIds(courseId) {
        const studentIds = new Set();
        this.state.schedules.forEach(schedule => {
            for (const timeBlockId in schedule.schedule) {
                if (schedule.schedule[timeBlockId] === courseId) {
                    studentIds.add(schedule.studentId);
                }
            }
        });
        return Array.from(studentIds);
    }
}