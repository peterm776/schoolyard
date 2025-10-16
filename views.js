import { signOut } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { setPageTitle, showToast, openModal } from './utils.js';
import * as C from './constants.js';
import { handleLoginSubmit, handleGoogleLogin, handleSignupSubmit, handleCreateSchoolSubmit } from './handlers.js';

// --- AUTH VIEWS ---
export function renderLoginView(app) {
    const container = document.getElementById('view-container');
    if (!container) return;
    container.innerHTML = `
        <h1 class="text-3xl font-bold text-slate-800 mb-2">Welcome to Schoolyard</h1>
        <p class="text-slate-600 mb-6">Sign in to your school's portal.</p>
        <form id="login-form" class="text-left space-y-4">
            <div>
                <label for="email" class="font-semibold text-slate-700">Email</label>
                <input id="email" type="email" autocomplete="email" class="w-full p-2 border rounded-lg mt-1" required>
            </div>
            <div>
                <label for="password" class="font-semibold text-slate-700">Password</label>
                <input id="password" type="password" autocomplete="current-password" class="w-full p-2 border rounded-lg mt-1" required>
            </div>
            <button type="submit" class="w-full bg-primary-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-600">Sign In</button>
        </form>
        <div class="relative my-6">
            <div class="absolute inset-0 flex items-center" aria-hidden="true"><div class="w-full border-t border-gray-300"></div></div>
            <div class="relative flex justify-center"><span class="bg-white/80 px-2 text-sm text-gray-500">Or</span></div>
        </div>
        <button id="google-login-button" class="w-full bg-slate-800 text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-900 transition-colors flex items-center justify-center"><svg class="w-5 h-5 mr-3" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/><path d="M1 1h22v22H1z" fill="none"/></svg>Sign in with Google</button>
        <p class="text-xs text-slate-500 mt-4">Don't have an account? <a href="#/signup" class="text-primary-600 hover:underline">Sign Up</a>.</p>`;

    document.getElementById('login-form').addEventListener('submit', (e) => handleLoginSubmit(app, e));
    document.getElementById('google-login-button').addEventListener('click', () => handleGoogleLogin(app));
}

export function renderSignupView(app) {
    const container = document.getElementById('view-container');
    if (!container) return;
    container.innerHTML = `<h1 class="text-3xl font-bold text-slate-800 mb-2">Create an Account</h1>
    <p class="text-slate-600 mb-6">Create your account to join your school.</p>
    <form id="signup-form" class="text-left space-y-4">
        <div>
            <label class="font-semibold text-slate-700">Your Full Name</label>
            <input name="displayName" type="text" placeholder="e.g., John Appleseed" class="w-full p-2 border rounded-lg mt-1" required>
        </div>
        <div>
            <label class="font-semibold text-slate-700">Your Email</label>
            <input name="email" type="email" autocomplete="email" class="w-full p-2 border rounded-lg mt-1" required>
        </div>
        <div>
            <label class="font-semibold text-slate-700">Password</label>
            <input name="password" type="password" autocomplete="new-password" class="w-full p-2 border rounded-lg mt-1" required>
        </div>
        <button type="submit" class="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700">Sign Up</button>
    </form>
     <p class="text-xs text-slate-500 mt-4">Already have an account? <a href="#/login" class="text-primary-600 hover:underline">Sign In</a>.</p>
     <p class="text-xs text-slate-500 mt-2">Administrator? <a href="#/create-school" class="text-primary-600 hover:underline">Create a new school</a>.</p>
    `;
    document.getElementById('signup-form').addEventListener('submit', (e) => handleSignupSubmit(app, e));
}

export function renderCreateSchoolView(app) {
    const container = document.getElementById('view-container');
    if (!container) return;
    container.innerHTML = `<h1 class="text-3xl font-bold text-slate-800 mb-2">Create a New School</h1><p class="text-slate-600 mb-6">Let's get your new school portal started.</p>
    <form id="school-signup-form" class="text-left space-y-4">
        <div>
            <label class="font-semibold text-slate-700">Your Full Name</label>
            <input name="displayName" type="text" placeholder="e.g., Jane Doe" class="w-full p-2 border rounded-lg mt-1" required>
        </div>
        <div>
            <label class="font-semibold text-slate-700">Your Admin Email</label>
            <input name="email" type="email" value="${app.auth.currentUser?.email || ''}" class="w-full p-2 border rounded-lg mt-1" required>
        </div>
        <div>
            <label class="font-semibold text-slate-700">Admin Password</label>
            <input name="password" type="password" class="w-full p-2 border rounded-lg mt-1" required>
        </div>
        <div>
            <label class="font-semibold text-slate-700">School Name</label>
            <input name="schoolName" type="text" placeholder="e.g., Villanova Preparatory School" class="w-full p-2 border rounded-lg mt-1" required>
        </div>
        <button type="submit" class="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 flex items-center justify-center">Create School & Account</button>
    </form>
    <p class="text-xs text-slate-500 mt-4">Already have an account? <a href="#/login" class="text-primary-600 hover:underline">Sign in instead</a>.</p>`;
    
    document.getElementById('school-signup-form').addEventListener('submit', (e) => handleCreateSchoolSubmit(app, e));
}

// --- APP SHELL & NAV ---
export function renderAppShell(app) {
    const { state, auth } = app;
    const header = document.getElementById('sidebar-header');
    if(header) {
        if (state.school.logoUrl) {
            header.innerHTML = `<img src="${state.school.logoUrl}" alt="${state.school.name} Logo" class="max-h-12 w-auto">`;
        } else {
            header.innerHTML = `<h1 class="text-xl font-bold text-white">${state.school.name}</h1>`;
        }
    }
    const userInfo = document.getElementById('user-info');
    if (userInfo) userInfo.innerHTML = `<p class="font-semibold text-slate-800">${state.user.displayName}</p><p class="text-xs text-slate-500 capitalize">${state.user.role}</p>`;
    
    const logoutBtn = document.getElementById('logout-button');
    if(logoutBtn) logoutBtn.onclick = () => signOut(auth);

    const sidebarToggle = document.getElementById('sidebar-toggle');
    if(sidebarToggle) sidebarToggle.onclick = () => document.getElementById('sidebar').classList.toggle('open');
    
    populateNav(app);
}

export function populateNav(app) {
    const { state } = app;
    const navEl = document.getElementById('nav');
    if (!navEl || !state.user || !state.user.role) { return; }
    const [page] = app.getRoute();
    const allowedLinks = C.rolesConfig[state.user.role] || [];
    navEl.innerHTML = allowedLinks.map(linkKey => {
        const link = C.allNavLinks[linkKey];
        if (!link) return '';
        const href = `#/${link.href}`;
        return `<a href="${href}" class="nav-link flex items-center p-3 my-1 rounded-lg text-slate-300 hover:bg-primary-500 hover:text-white transition-colors duration-200 ${page === link.href ? 'active' : ''}">${link.icon} ${link.text}</a>`;
    }).join('');
}

// --- MAIN PAGE VIEWS ---

export function renderMyDay(app) {
    setPageTitle('My Day');
    const content = document.getElementById('content');
    if(!content) return;
    const { state } = app;
    const today = new Date().toISOString().split('T')[0];
    const todaysCalendarEntry = state.masterCalendar.find(entry => entry.date === today);
    
    let html = `<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">`;
    
    html += `<div class="lg:col-span-1 bg-slate-50 p-4 rounded-lg"><h3 class="text-xl font-bold text-slate-700 mb-4">Today's Schedule</h3>`;
    if (todaysCalendarEntry) {
        const dayType = state.dayTypes.find(dt => dt.id === todaysCalendarEntry.dayTypeId);
        const timeBlocks = state.timeBlocks.filter(tb => tb.dayTypeId === dayType?.id).sort((a,b) => a.startTime.localeCompare(b.startTime));
        html += `<p class="font-semibold text-primary-600 mb-4">It's a "${dayType?.name || 'Unknown'}" day.</p>`;
        if (timeBlocks.length > 0 && (state.user.role === 'student' || state.user.role === 'parent')) {
            html += `<ul class="space-y-2">`;
            const studentId = state.user.role === 'student' ? state.user.id : (state.user.childrenIds ? state.user.childrenIds[0] : null);
            const mySchedule = studentId ? state.schedules.find(s => s.studentId === studentId) : null;
            timeBlocks.forEach(tb => {
                const courseId = mySchedule?.schedule[tb.id];
                const course = courseId ? state.courses.find(c => c.id === courseId) : null;
                html += `<li class="p-3 bg-white rounded-md shadow-sm"><p class="font-bold text-slate-600">${tb.startTime} - ${tb.endTime}</p><p class="font-semibold text-slate-800">${tb.name}</p><p class="text-slate-500">${course ? course.name : 'Free Period'}</p></li>`;
            });
            html += `</ul>`;
        } else if (timeBlocks.length === 0) {
            html += `<p class="text-slate-500">No time blocks defined for this day type.</p>`;
        } else {
             html += `<p class="text-slate-500">View your assigned courses on the Courses page.</p>`;
        }
    } else { 
        html += `<p class="text-slate-500">No school day scheduled for today.</p>`; 
    }
    html += `</div>`;

    const studentIds = state.user.role === 'parent' ? state.user.childrenIds || [] : (state.user.role === 'student' ? [state.user.id] : []);
    const myCourses = state.courses.filter(c => {
         if (state.user.role === 'teacher') return c.teacherId === state.user.id;
         if (state.user.role === 'admin') return true;
         const enrolledIds = app.getEnrolledStudentIds(c.id);
         return studentIds.some(sid => enrolledIds.includes(sid));
    });
    const myCourseIds = myCourses.map(c => c.id);

    html += `<div class="lg:col-span-2 space-y-6">`;
    html += `<div class="bg-slate-50 p-4 rounded-lg"><h3 class="text-xl font-bold text-slate-700 mb-4">Upcoming Assignments</h3>`;
    const upcomingAssignments = state.assignments.filter(a => myCourseIds.includes(a.courseId) && new Date(a.dueDate) >= new Date()).sort((a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    if (upcomingAssignments.length > 0) {
        html += `<ul class="space-y-2">${upcomingAssignments.slice(0, 5).map(assign => { const course = state.courses.find(c => c.id === assign.courseId); return `<li class="p-3 bg-white rounded-md shadow-sm flex justify-between items-center"><div><p class="font-bold text-slate-800">${assign.title}</p><p class="text-sm text-slate-500">${course?.name || ''}</p></div><span class="font-semibold text-red-600">Due: ${assign.dueDate}</span></li>`; }).join('')}</ul>`;
    } else { html += `<p class="text-slate-500">No upcoming assignments. Great job!</p>`; }
    html += `</div>`;
    html += `<div class="bg-slate-50 p-4 rounded-lg"><h3 class="text-xl font-bold text-slate-700 mb-4">Recent Announcements</h3>`;
    const recentAnnouncements = state.announcements.filter(a => myCourseIds.includes(a.courseId) || a.courseId === 'school-wide').sort((a,b) => b.createdAt?.toDate() - a.createdAt?.toDate());
     if (recentAnnouncements.length > 0) {
        html += `<ul class="space-y-3">${recentAnnouncements.slice(0, 3).map(ann => { const course = state.courses.find(c => c.id === ann.courseId); const author = state.allUsers.find(u => u.id === ann.authorId); return `<li class="p-3 bg-white rounded-md shadow-sm"><div><p class="font-bold text-slate-800">${course?.name || 'School Announcement'}</p><p class="text-sm text-slate-500">By ${author?.displayName || 'Admin'} on ${ann.createdAt?.toDate().toLocaleDateString()}</p></div><p class="mt-2 text-slate-700">${ann.content}</p></li>`; }).join('')}</ul>`;
    } else { html += `<p class="text-slate-500">No recent announcements.</p>`; }
    html += `</div></div></div>`;
    content.innerHTML = html;
}

export function renderParentDashboard(app) {
     setPageTitle('Dashboard');
     const content = document.getElementById('content');
     if(!content) return;
     const { state } = app;
     const children = state.students.filter(s => state.user.childrenIds?.includes(s.id));

     if (!children || children.length === 0) {
         content.innerHTML = `<p class="text-slate-500">No students are currently assigned to your parent account. Please contact the school administrator.</p>`;
         return;
     }

     const studentOptions = children.map(c => `<option value="${c.id}">${c.displayName}</option>`).join('');

     const childrenIds = state.user.childrenIds || [];
     const recentIncidents = state.incidents.filter(i => childrenIds.includes(i.studentId)).slice(0, 3);
     
     let incidentsHtml = `<div class="bg-slate-50 p-6 rounded-lg shadow-sm mt-8">
        <h4 class="text-xl font-bold text-slate-700 mb-4">Recent Behavior Log</h4>`;
     if (recentIncidents.length > 0) {
        incidentsHtml += `<div class="space-y-3">
            ${recentIncidents.map(incident => {
                const student = state.students.find(s => s.id === incident.studentId);
                const typeClass = incident.type || 'neutral';
                return `<div class="incident-card ${typeClass}">
                    <div>
                        <p class="font-bold">${student?.displayName}</p>
                        <p class="text-sm text-slate-500">${incident.date} &bull; Reported by ${incident.reporterName}</p>
                        <p class="mt-1 text-slate-700">${incident.description}</p>
                    </div>
                </div>`;
            }).join('')}
        </div>
        <a href="#/behavior" class="block text-center mt-4 font-semibold text-primary-600 hover:underline">View Full Log &rarr;</a>`;
     } else {
        incidentsHtml += `<p class="text-slate-500">No recent incidents have been logged.</p>`;
     }
     incidentsHtml += `</div>`;

     content.innerHTML = `
         <div class="max-w-2xl mx-auto">
             <div class="bg-slate-50 p-6 rounded-lg shadow-sm">
                 <h4 class="text-xl font-bold text-slate-700 mb-4">Submit Attendance Note</h4>
                 <form id="attendance-note-form">
                     <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                             <label class="block font-semibold text-slate-700">Student</label>
                             <select name="studentId" class="w-full p-2 border rounded-lg mt-1" required>${studentOptions}</select>
                         </div>
                         <div>
                             <label class="block font-semibold text-slate-700">Date</label>
                             <input type="date" name="date" value="${new Date().toISOString().split('T')[0]}" class="w-full p-2 border rounded-lg mt-1" required>
                         </div>
                         <div class="md:col-span-2">
                             <label class="block font-semibold text-slate-700">Note Type</label>
                             <select name="type" class="w-full p-2 border rounded-lg mt-1" required>
                                 <option value="sick">Sick Day</option>
                                 <option value="late">Arriving Late</option>
                                 <option value="early">Leaving Early</option>
                             </select>
                         </div>
                         <div class="md:col-span-2">
                             <label class="block font-semibold text-slate-700">Reason (optional)</label>
                             <textarea name="reason" rows="3" placeholder="e.g., Doctor's appointment at 2 PM" class="w-full p-2 border rounded-lg mt-1"></textarea>
                         </div>
                     </div>
                     <div class="text-right mt-4">
                         <button type="submit" class="bg-primary-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-600">Submit Note</button>
                     </div>
                 </form>
             </div>
             ${incidentsHtml}
         </div>
       `;
     document.getElementById('attendance-note-form').addEventListener('submit', (e) => window.handleAttendanceNoteSubmit(e));
}

export function renderLaunchpad(app) {
    setPageTitle('Launchpad');
    const content = document.getElementById('content');
    if(!content) return;
    const { state } = app;
    const links = state.launchpadLinks.sort((a, b) => a.name.localeCompare(b.name));
    let html = ``;
    if(state.user.role === 'admin') {
        html += `<div class="flex justify-end mb-4"><a href="#/settings?tab=launchpad" class="bg-primary-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-600">Manage Links</a></div>`;
    }
    if (links.length === 0) {
        html += `<p class="text-slate-500 text-center py-8">No Launchpad links have been configured by the administrator.</p>`;
    } else {
        html += `<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">${links.map(link => `<a href="${link.url}" target="_blank" rel="noopener noreferrer" class="flex flex-col items-center p-4 bg-slate-50 rounded-lg hover:bg-primary-100 hover:shadow-md transition-all"><div class="w-20 h-20 rounded-lg mb-2 bg-slate-200 flex items-center justify-center text-3xl font-bold text-primary-600">${link.name.charAt(0)}</div><span class="font-semibold text-slate-700 text-center">${link.name}</span></a>`).join('')}</div>`;
    }
    content.innerHTML = html;
}

export function renderCourses(app, idParts, params) {
    const [courseId] = idParts;
    if (courseId) return renderCourseDetail(app, courseId, params);
    setPageTitle('Courses');
    const content = document.getElementById('content');
    if (!content) return;
    const { state } = app;
    let html = `<div class="flex justify-between items-center mb-6"><h3 class="text-2xl font-bold text-slate-700">My Courses</h3>`;
    if (state.user.role === 'admin') html += `<button onclick="window.openCourseModal()" class="bg-primary-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-600">Add Course</button>`;
    html += `</div>`;

    const studentIds = state.user.role === 'parent' ? state.user.childrenIds || [] : [state.user.id];
    
    const myCourses = state.courses.filter(c => {
         if (state.user.role === 'admin') return true;
         if (state.user.role === 'teacher') return c.teacherId === state.user.id;
         const enrolledIds = app.getEnrolledStudentIds(c.id);
         return studentIds.some(sid => enrolledIds.includes(sid));
    });

    if (myCourses.length === 0) {
        html += `<p class="text-slate-500">You are not enrolled in or assigned to any courses.</p>`;
    } else {
        html += `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">${myCourses.map(course => {
            const teacher = state.allUsers.find(u => u.id === course.teacherId);
            const enrolledStudentIds = app.getEnrolledStudentIds(course.id);
            let adminControls = '';
            if (app.canEdit(course)) {
                adminControls = `
                    <div class="mt-4 pt-4 border-t border-slate-200 flex justify-end space-x-2">
                        <button onclick="window.openCourseModal('${course.id}', event)" class="text-xs font-semibold text-yellow-600 hover:text-yellow-800">EDIT</button>
                        <button onclick="window.deleteCourse('${course.id}', event)" class="text-xs font-semibold text-red-600 hover:text-red-800">DELETE</button>
                    </div>`;
            }

            return `
                <div class="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow border-l-4 border-primary-500 flex flex-col justify-between">
                    <a href="#/courses/${course.id}" class="flex-grow">
                        <h4 class="text-xl font-bold text-slate-800 truncate">${course.name}</h4>
                        <p class="text-slate-600">Teacher: ${teacher ? teacher.displayName : 'Not Assigned'}</p>
                        <p class="text-sm text-slate-500 mt-2">${enrolledStudentIds.length} students</p>
                    </a>
                    ${adminControls}
                </div>`;
        }).join('')}</div>`;
    }
    content.innerHTML = html;
}

export function renderCourseDetail(app, courseId, params) {
    const { state } = app;
    const course = state.courses.find(c => c.id === courseId);
    const content = document.getElementById('content');
    if (!content) return;
    if (!course) { content.innerHTML = `<p>Course not found.</p><a href="#/courses">&larr; Back to courses</a>`; return; }
    
    const currentTab = params.get('tab') || 'stream';
    setPageTitle(course.name);
    const teacher = state.allUsers.find(u => u.id === course.teacherId);
    content.innerHTML = `<div class="mb-6"><a href="#/courses" class="text-primary-600 hover:underline">&larr; Back to all courses</a></div><div class="p-4 rounded-lg bg-primary-600 text-white shadow-lg mb-6"><h3 class="text-3xl font-bold">${course.name}</h3><p>${teacher?.displayName || 'N/A'}</p></div><div class="flex border-b mb-6 overflow-x-auto"><a href="#/courses/${courseId}?tab=stream" class="course-tab p-4 border-b-2 ${currentTab === 'stream' ? 'active' : ''}">Stream</a><a href="#/courses/${courseId}?tab=classwork" class="course-tab p-4 border-b-2 ${currentTab === 'classwork' ? 'active' : ''}">Classwork</a><a href="#/courses/${courseId}?tab=people" class="course-tab p-4 border-b-2 ${currentTab === 'people' ? 'active' : ''}">People</a>${app.canEdit(course) ? `<a href="#/courses/${courseId}?tab=attendance" class="course-tab p-4 border-b-2 ${currentTab === 'attendance' ? 'active' : ''}">Attendance</a>` : ''}</div><div id="course-content"></div>`;
    const tabRenderers = { 'stream': renderCourseStream, 'classwork': renderCourseClasswork, 'people': renderCoursePeople, 'attendance': renderCourseAttendance };
    (tabRenderers[currentTab] || tabRenderers.stream)(app, course);
}

function renderCourseStream(app, course) {
    const { state } = app;
    const content = document.getElementById('course-content');
    if(!content) return;
    let formHtml = app.canEdit(course) ? `<div class="bg-white p-4 rounded-lg shadow mb-6"><form id="announcement-form"><textarea name="content" class="w-full p-2 border rounded-lg" placeholder="Announce something to your class" required></textarea><div class="text-right mt-2"><button type="submit" class="bg-primary-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-600">Post</button></div></form></div>` : '';
    const announcements = state.announcements.filter(a => a.courseId === course.id).sort((a,b) => b.createdAt?.toDate() - a.createdAt?.toDate());
    let announcementsHtml = announcements.map(ann => { const author = state.allUsers.find(u => u.id === ann.authorId); return `<div class="bg-white p-4 rounded-lg shadow flex items-start space-x-4"><div class="bg-primary-500 text-white rounded-full h-10 w-10 flex-shrink-0 flex items-center justify-center font-bold">${author?.displayName?.charAt(0) || '?' }</div><div><p class="font-semibold">${author.displayName} <span class="text-sm text-slate-500 font-normal">${ann.createdAt?.toDate().toLocaleString() || ''}</span></p><p class="mt-1">${ann.content.replace(/\n/g, '<br>')}</p></div></div>` }).join('<hr class="my-6 border-slate-200">');
    if (announcements.length === 0) { announcementsHtml = `<p class="text-center text-slate-500 py-8">No announcements yet.</p>`; }
    content.innerHTML = `<div class="max-w-3xl mx-auto">${formHtml}${announcementsHtml}</div>`;
    if (app.canEdit(course)) { document.getElementById('announcement-form').addEventListener('submit', e => window.handleAnnouncementSubmit(e, course.id)); }
}

function renderCourseClasswork(app, course) {
    const { state } = app;
    const content = document.getElementById('course-content');
    if(!content) return;
    let createButton = app.canEdit(course) ? `<button onclick="window.openAssignmentModal(null, '${course.id}')" class="bg-primary-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-600">Create Assignment</button>` : '';
    const assignments = state.assignments.filter(a => a.courseId === course.id).sort((a,b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
    let assignmentsHtml = assignments.length > 0 ? `<ul class="space-y-3">${assignments.map(a => `<li class="p-4 bg-slate-50 rounded-md flex justify-between items-center"><div><p class="font-semibold text-lg text-slate-800">${a.title} <span class="text-xs font-medium uppercase px-2 py-1 rounded-full ${a.type === 'homework' ? 'bg-indigo-100 text-indigo-800' : 'bg-amber-100 text-amber-800'}">${a.type || 'classwork'}</span></p><p class="text-sm text-slate-500">Due: ${a.dueDate} &bull; ${a.maxPoints || 0} pts</p></div>${app.canEdit(course) ? `<div class="flex space-x-2"><button onclick="window.openAssignmentModal('${a.id}', '${course.id}')" class="text-yellow-600 hover:text-yellow-800 font-semibold">Edit</button><button onclick="window.deleteAssignment('${a.id}')" class="text-red-600 hover:text-red-800 font-semibold">Delete</button></div>` : ''}</li>`).join('')}</ul>` : `<p class="text-center text-slate-500 py-8">No assignments have been created for this course yet.</p>`;
    content.innerHTML = `<div class="flex justify-end mb-4">${createButton}</div>${assignmentsHtml}`;
}

function renderCoursePeople(app, course) {
    const { state } = app;
    const content = document.getElementById('course-content');
    if(!content) return;
    const teacher = state.allUsers.find(u => u.id === course.teacherId);
    const enrolledStudentIds = app.getEnrolledStudentIds(course.id);
    const enrolledStudents = state.students.filter(s => enrolledStudentIds.includes(s.id));

    let teacherHtml = `<div class="border-b-2 border-primary-500 pb-2 mb-4"><h3 class="text-2xl font-bold text-primary-600">Teacher</h3></div><div class="flex items-center space-x-4 p-2"><div class="bg-slate-200 text-slate-700 rounded-full h-10 w-10 flex items-center justify-center font-bold">${teacher?.displayName?.charAt(0) || '?'}</div><p class="text-lg">${teacher?.displayName || 'N/A'}</p></div>`;
    let studentsHtml = `<div class="border-b-2 border-primary-500 pb-2 mb-4 mt-8"><h3 class="text-2xl font-bold text-primary-600">Students</h3><p class="text-slate-500">${enrolledStudents.length} students</p></div><ul class="space-y-1">${enrolledStudents.map(s => `<li class="flex items-center space-x-4 p-2"><div class="bg-slate-200 text-slate-700 rounded-full h-10 w-10 flex-shrink-0 flex items-center justify-center font-bold">${s.displayName.charAt(0)}</div><p class="text-lg">${s.displayName}</p></li>`).join('')}</ul>`;
    content.innerHTML = `<div class="max-w-3xl mx-auto">${teacherHtml}${studentsHtml}</div>`;
}

function renderCourseAttendance(app, course) {
      const { state } = app;
      const content = document.getElementById('course-content');
      if(!content) return;
      const today = new Date().toISOString().split('T')[0];
      const enrolledStudentIds = app.getEnrolledStudentIds(course.id);
      const students = state.students.filter(s => enrolledStudentIds.includes(s.id));
      const todaysAttendance = state.attendance.find(a => a.date === today && a.courseId === course.id);
      let html = `<div class="flex items-center justify-between mb-4"><h3 class="text-xl font-bold">Attendance for ${today}</h3><button id="save-attendance-btn" class="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700">Save Attendance</button></div><form id="attendance-form"><table class="min-w-full bg-white"><thead class="bg-slate-100"><tr><th class="py-3 px-4 text-left font-semibold text-slate-600">Student Name</th><th class="py-3 px-4 text-center font-semibold text-slate-600">Present</th><th class="py-3 px-4 text-center font-semibold text-slate-600">Absent</th><th class="py-3 px-4 text-center font-semibold text-slate-600">Tardy</th></tr></thead><tbody>${students.map(student => { const status = todaysAttendance?.statuses?.[student.id] || 'present'; return `<tr class="border-b"><td class="py-3 px-4 font-medium">${student.displayName}</td><td class="py-3 px-4 text-center"><input type="radio" name="${student.id}" value="present" ${status === 'present' ? 'checked' : ''} class="w-5 h-5 text-primary-600 focus:ring-primary-500"></td><td class="py-3 px-4 text-center"><input type="radio" name="${student.id}" value="absent" ${status === 'absent' ? 'checked' : ''} class="w-5 h-5 text-primary-600 focus:ring-primary-500"></td><td class="py-3 px-4 text-center"><input type="radio" name="${student.id}" value="tardy" ${status === 'tardy' ? 'checked' : ''} class="w-5 h-5 text-primary-600 focus:ring-primary-500"></td></tr>` }).join('')}</tbody></table></form>`;
      content.innerHTML = html;
      document.getElementById('save-attendance-btn').addEventListener('click', () => window.handleAttendanceSubmit(course.id, today, todaysAttendance?.id));
}

export function renderHomework(app) {
    setPageTitle('Homework Calendar');
    const content = document.getElementById('content');
    if (!content) return;
    content.innerHTML = `<div id='homework-calendar'></div>`;
    
    setTimeout(() => {
        const calendarEl = document.getElementById('homework-calendar');
        if (!calendarEl) return;
        
        const { state } = app;
        const homeworkAssignments = state.assignments.filter(a => a.type === 'homework');
        
        const events = homeworkAssignments.map(hw => {
            const course = state.courses.find(c => c.id === hw.courseId);
            return {
                id: hw.id,
                title: `${course?.name || 'Course'}: ${hw.title}`,
                start: hw.dueDate,
                allDay: true,
                backgroundColor: '#4f46e5', // Indigo color for homework
                borderColor: '#4f46e5'
            };
        });

        if (state.currentCalendar) state.currentCalendar.destroy();
        state.currentCalendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,listWeek'
            },
            events: events,
            eventClick: (info) => {
                window.openHomeworkModal(info.event.id);
            }
        });
        state.currentCalendar.render();
    }, 0);
}


export function renderAttendance(app) {
    setPageTitle('Attendance');
    const content = document.getElementById('content');
    if(!content) return;
    const { state } = app;

    if (state.user.role === 'admin' || state.user.role === 'teacher') {
        const notes = [...state.attendanceNotes].sort((a,b) => b.date.localeCompare(a.date));
        let notesHtml = `<div class="mb-8"><h3 class="text-xl font-bold text-slate-700 mb-4">Parent Absence/Tardy Submissions</h3>`;
        if(notes.length > 0) {
              notesHtml += `<div class="space-y-3">${notes.map(note => {
                  const student = state.students.find(s => s.id === note.studentId);
                  const parent = state.allUsers.find(u => u.id === note.parentId);
                  const statusClass = note.status === 'approved' ? 'approved' : '';
                  const statusText = note.status ? note.status.charAt(0).toUpperCase() + note.status.slice(1) : 'Submitted';
                  
                  return `<div class="attendance-note-card ${statusClass}">
                      <div class="flex justify-between items-start">
                          <div>
                              <p class="font-bold text-slate-800">${student?.displayName || 'Unknown Student'}</p>
                              <p class="text-sm"><span class="font-semibold capitalize">${note.type}</span> on <span class="font-semibold">${note.date}</span></p>
                              <p class="text-xs text-slate-500">Submitted by ${parent?.displayName} on ${note.submittedAt?.toDate().toLocaleDateString()}</p>
                          </div>
                          <div class="text-right">
                              <span class="text-xs font-bold uppercase px-2 py-1 rounded-full ${note.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">${statusText}</span>
                              ${note.status !== 'approved' ? `<button onclick="window.updateAttendanceNoteStatus('${note.id}', 'approved')" class="text-xs ml-2 bg-green-500 text-white font-bold py-1 px-2 rounded hover:bg-green-600">Approve</button>` : ''}
                          </div>
                      </div>
                      ${note.reason ? `<p class="text-slate-700 mt-2 p-2 bg-white rounded">${note.reason}</p>` : ''}
                  </div>`
              }).join('')}</div>`;
        } else {
            notesHtml += `<p class="text-slate-500">No new attendance notes from parents.</p>`;
        }
        notesHtml += `</div>`;

        const myCourses = state.courses.filter(c => c.teacherId === state.user.id || state.user.role === 'admin');
        if (myCourses.length === 0 && state.user.role === 'teacher') {
              content.innerHTML = notesHtml + `<p class="text-slate-500">You are not assigned to teach any courses.</p>`;
              return;
        }
        let html = notesHtml + `<h3 class="text-xl font-bold text-slate-700 mb-4">Take Daily Attendance</h3><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">`;
        html += myCourses.map(course => {
            const studentCount = app.getEnrolledStudentIds(course.id).length;
            return `<a href="#/courses/${course.id}?tab=attendance" class="block p-4 bg-slate-50 hover:bg-primary-100 rounded-lg shadow-sm transition-colors"><p class="font-bold text-lg text-primary-700">${course.name}</p><p class="text-slate-500">${studentCount} students</p></a>`
        }).join('');
        html += `</div>`;
        content.innerHTML = html;
    } else {
        content.innerHTML = `<p class="text-slate-500">Attendance records are managed by teachers and administrators. Parents can submit attendance notes from the Dashboard.</p>`;
    }
}

export function renderGradebook(app, idParts, params) {
    setPageTitle('Gradebook');
    const content = document.getElementById('content');
    if(!content) return;
    const { state } = app;
    const courseId = params.get('courseId');
    
    if (state.user.role === 'student' || state.user.role === 'parent') {
        let html = `<h3 class="text-2xl font-bold text-slate-700 mb-6">My Grades</h3>`;
        const studentIds = state.user.role === 'parent' ? state.user.childrenIds || [] : [state.user.id];
        
        if (studentIds.length === 0 && state.user.role === 'parent') {
            html += `<p class="text-slate-500">No students assigned to this account.</p>`;
            content.innerHTML = html;
            return;
        }

        studentIds.forEach(studentId => {
            const student = state.students.find(s => s.id === studentId);
            if (!student) return;

            if (state.user.role === 'parent') {
                html += `<h4 class="text-2xl font-semibold text-slate-600 mb-4 mt-6 border-t pt-4">${student.displayName}</h4>`;
            }
            
            const enrolledCourses = state.courses.filter(c => app.getEnrolledStudentIds(c.id).includes(studentId));
            
            if(enrolledCourses.length === 0) {
                html += `<p class="text-slate-500">Not enrolled in any courses.</p>`;
            } else {
               html += enrolledCourses.map(course => {
                    const assignments = state.assignments.filter(a => a.courseId === course.id);
                    if (assignments.length === 0) return `<div class="mb-8"><h5 class="text-xl font-bold text-primary-700 mb-2">${course.name}</h5><p class="text-slate-500 text-sm">No assignments yet.</p></div>`;
                    
                    let courseHtml = `<div class="mb-8"><h5 class="text-xl font-bold text-primary-700 mb-2">${course.name}</h5>`;
                    courseHtml += `<ul class="space-y-2">` + assignments.map(a => {
                        const grade = state.grades.find(g => g.assignmentId === a.id && g.studentId === studentId);
                        
                        let gradeDisplay = '';
                        if (grade?.score != null) {
                            gradeDisplay = `<span class="font-semibold px-3">${grade.score} / ${a.maxPoints || '?'}</span>`;
                        } else {
                            gradeDisplay = `<span class="font-semibold px-3 text-slate-400">Not Graded</span>`;
                        }

                        return `<li class="flex justify-between items-center p-3 bg-slate-50 rounded-md"><span>${a.title}</span>${gradeDisplay}</li>`;
                    }).join('') + `</ul>`;
                    return courseHtml + `</div>`;
                }).join('');
            }
        });
        content.innerHTML = html;
        return;
    }

    const myCourses = state.user.role === 'admin' ? state.courses : state.courses.filter(c => c.teacherId === state.user.id);
    if (myCourses.length === 0) {
        content.innerHTML = `<p class="text-slate-500">You are not assigned to teach any courses.</p>`;
        return;
    }
    let courseOptions = `<option value="">Select a course...</option>` + myCourses.map(c => `<option value="${c.id}" ${c.id === courseId ? 'selected' : ''}>${c.name}</option>`).join('');
    let html = `<div class="mb-4"><label for="gradebook-course-select" class="block font-semibold mb-2">Select a Course:</label><select id="gradebook-course-select" class="p-2 border rounded-lg w-full md:w-1/2">${courseOptions}</select></div>`;
    if (courseId) {
        const course = state.courses.find(c => c.id === courseId);
        const enrolledStudentIds = app.getEnrolledStudentIds(course.id);
        const students = state.students.filter(s => enrolledStudentIds.includes(s.id));
        const assignments = state.assignments.filter(a => a.courseId === courseId);
        const grades = state.grades.filter(g => g.courseId === courseId);
        html += `<div class="overflow-x-auto"><table class="min-w-full text-sm gradebook-table"><thead class="bg-slate-100"><tr><th class="p-2 border font-semibold text-left">Student Name</th>${assignments.map(a => `<th class="p-2 border font-semibold">${a.title}<br><span class="text-xs font-normal">(${a.maxPoints || 0} pts)</span></th>`).join('')}</tr></thead><tbody>${students.map(student => `<tr class="border-b"><td class="p-2 border font-medium text-left">${student.displayName}</td>${assignments.map(assignment => { const grade = grades.find(g => g.studentId === student.id && g.assignmentId === assignment.id); return `<td class="p-0 border"><input type="number" value="${grade?.score ?? ''}" onchange="window.updateGrade(this, '${student.id}', '${assignment.id}', '${courseId}', this.value, '${grade?.id || ''}')" class="w-full h-full text-center p-2 outline-none focus:bg-primary-100" /></td>` }).join('')}</tr>`).join('')}</tbody></table></div>`;
    }
    content.innerHTML = html;
    const selectEl = document.getElementById('gradebook-course-select');
    if (selectEl) { selectEl.addEventListener('change', (e) => { window.location.hash = `#/gradebook?courseId=${e.target.value}`; }); }
}

export function renderTuition(app) {
    setPageTitle('Tuition & Billing');
    const content = document.getElementById('content');
    if(!content) return;
    const { state } = app;
    if (state.user.role === 'admin') {
        content.innerHTML = `This data is managed in <a href="#/settings?tab=tuition" class="text-primary-600 hover:underline">Settings &rarr; Tuition</a>. Parent statements can be generated in <a href="#/reports?tab=tuition" class="text-primary-600 hover:underline">Reports</a>.`;
        return;
    }
    const studentIds = state.user.role === 'parent' ? state.user.childrenIds || [] : [state.user.id];
    const myTuitionItems = state.tuitionItems.filter(item => studentIds.includes(item.studentId));
    const totalCharges = myTuitionItems.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    let html = `<div class="bg-slate-50 rounded-lg p-6 max-w-2xl mx-auto"><h3 class="text-xl font-bold text-slate-700 mb-4">Account Summary for ${state.user.displayName}</h3>`;
    if (myTuitionItems.length > 0) {
        html += `<table class="w-full mb-4"><thead><tr class="border-b"><th class="text-left font-semibold py-2">Item Description</th><th class="text-right font-semibold py-2">Amount</th></tr></thead><tbody>`;
        myTuitionItems.forEach(item => {
            html += `<tr><td class="py-2">${item.description}</td><td class="text-right py-2">$${parseFloat(item.amount).toFixed(2)}</td></tr>`;
        });
        html += `</tbody></table>`;
    } else {
        html += `<p class="text-slate-500 mb-4">No tuition items have been posted to your account yet.</p>`;
    }
    html += `<div class="flex justify-between items-center border-t pt-4 mt-4"><p class="text-lg font-bold">Balance Due:</p><p class="text-lg font-bold text-red-600">$${totalCharges.toFixed(2)}</p></div><button onclick="window.openPaymentModal()" class="w-full mt-6 bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700">Make a Payment</button></div>`;
    content.innerHTML = html;
}

export function renderCalendar(app) {
      setPageTitle('Calendar');
      const content = document.getElementById('content');
      if(!content) return;
      const { state } = app;
      content.innerHTML = `<div id='calendar'></div>`;
      setTimeout(() => {
          const calendarEl = document.getElementById('calendar');
          if(!calendarEl || !state.courses) return;
          const studentIds = state.user.role === 'parent' ? state.user.childrenIds || [] : [state.user.id];
          const myCourseIds = state.courses.filter(c => {
               if (state.user.role === 'admin' || state.user.role === 'teacher') return true;
               const enrolledIds = app.getEnrolledStudentIds(c.id);
               return studentIds.some(sid => enrolledIds.includes(sid));
          }).map(c => c.id);

          const assignmentEvents = state.assignments.filter(a => myCourseIds.includes(a.courseId)).map(a => ({ title: `Due: ${a.title}`, start: a.dueDate, allDay: true, backgroundColor: '#ef4444' }));
          const schoolEvents = state.events.map(e => ({ title: e.title, start: e.date, allDay: true, backgroundColor: '#22c55e' }));
          
          if(state.currentCalendar) state.currentCalendar.destroy();
          state.currentCalendar = new FullCalendar.Calendar(calendarEl, { initialView: 'dayGridMonth', headerToolbar: { left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,listWeek' }, events: [...assignmentEvents, ...schoolEvents] });
          state.currentCalendar.render();
      }, 0);
}

export function renderUsers(app) {
    if(app.state.user.role !== 'admin') { 
        document.getElementById('content').innerHTML = `<p>You do not have permission to view this page.</p>`; 
        return; 
    }
    setPageTitle('Users');
    const content = document.getElementById('content');
    if(!content) return;

    content.innerHTML = `
        <div class="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
            <h3 class="text-2xl font-bold text-slate-700">User Management</h3>
            <div class="flex flex-col sm:flex-row gap-2">
                <input type="text" id="user-search" placeholder="Search by name or email..." class="p-2 border rounded-lg w-full sm:w-auto">
                <select id="role-filter" class="p-2 border rounded-lg w-full sm:w-auto">
                    <option value="">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="teacher">Teacher</option>
                    <option value="student">Student</option>
                    <option value="parent">Parent</option>
                </select>
                <button onclick="window.openUserCsvImportModal()" class="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 whitespace-nowrap">Import CSV</button>
                <button onclick="window.openUserModal()" class="bg-primary-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-600 whitespace-nowrap">Add User</button>
            </div>
        </div>
        <div class="overflow-x-auto">
            <table class="min-w-full bg-white">
                <thead class="bg-slate-100">
                    <tr>
                        <th class="py-3 px-4 text-left font-semibold text-slate-600">Name</th>
                        <th class="py-3 px-4 text-left font-semibold text-slate-600">Email</th>
                        <th class="py-3 px-4 text-left font-semibold text-slate-600">Role</th>
                        <th class="py-3 px-4 text-left font-semibold text-slate-600">Actions</th>
                    </tr>
                </thead>
                <tbody id="users-table-body">
                </tbody>
            </table>
        </div>`;
    
    renderUserTable(app); // Initial render
    
    document.getElementById('user-search')?.addEventListener('input', () => renderUserTable(app));
    document.getElementById('role-filter')?.addEventListener('change', () => renderUserTable(app));
}

export function renderUserTable(app) {
    const tableBody = document.getElementById('users-table-body');
    if (!tableBody) return;

    const searchTerm = document.getElementById('user-search')?.value.toLowerCase() || '';
    const roleFilter = document.getElementById('role-filter')?.value || '';

    const filteredUsers = app.state.allUsers
        .filter(u => {
            const matchesSearch = u.displayName.toLowerCase().includes(searchTerm) || u.email.toLowerCase().includes(searchTerm);
            const matchesRole = roleFilter ? u.role === roleFilter : true;
            return matchesSearch && matchesRole;
        })
        .sort((a,b) => a.displayName.localeCompare(b.displayName));

    tableBody.innerHTML = filteredUsers.map(u => {
        let actions = `<button onclick="window.openUserModal('${u.id}')" class="text-yellow-600 hover:underline">Edit</button><button onclick="window.deleteUser('${u.id}')" class="ml-4 text-red-600 hover:underline">Delete</button>`;
        if (u.role === 'student') {
            actions += `<a href="#/schedule/${u.id}" class="ml-4 text-green-600 hover:underline">Schedule</a>`;
        }
        return `<tr class="border-b"><td class="py-3 px-4">${u.displayName}</td><td class="py-3 px-4">${u.email}</td><td class="py-3 px-4 capitalize">${u.role}</td><td class="py-3 px-4">${actions}</td></tr>`
    }).join('');
}

export function renderScheduleEditor(app, idParts) {
    const { state } = app;
    const [studentId] = idParts;
    const student = state.students.find(s => s.id === studentId);
    const content = document.getElementById('content');
    if (!content || !student) {
        if(content) content.innerHTML = `<p>Student not found.</p>`;
        return;
    }

    setPageTitle(`Schedule for ${student.displayName}`);
    
    const scheduleDoc = state.schedules.find(s => s.studentId === studentId);
    const currentSchedule = scheduleDoc ? scheduleDoc.schedule : {};
    
    let html = `<div class="flex justify-between items-center mb-6">
            <a href="#/users" class="text-primary-600 hover:underline">&larr; Back to all users</a>
            <button type="button" onclick="window.openPrintableScheduleModal('${studentId}')" class="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 flex items-center">
                <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                Print Schedule
            </button>
        </div>
        <form id="schedule-form">
            <div class="space-y-8">`;

    state.dayTypes.forEach(dayType => {
        html += `<div><h3 class="text-2xl font-bold text-slate-700 mb-4">${dayType.name}</h3><div class="space-y-4">`;
        const timeBlocks = state.timeBlocks.filter(tb => tb.dayTypeId === dayType.id).sort((a,b) => a.startTime.localeCompare(b.startTime));

        if (timeBlocks.length === 0) {
            html += `<p class="text-slate-500">No time blocks defined for this day type.</p>`;
        } else {
            timeBlocks.forEach(block => {
                const currentCourseId = currentSchedule[block.id] || '';
                html += `<div class="grid grid-cols-3 gap-4 items-center">
                        <label class="font-semibold text-slate-600 text-right">${block.name} (${block.startTime} - ${block.endTime})</label>
                        <div class="col-span-2">
                            <select name="${block.id}" class="w-full p-2 border rounded-lg">
                                <option value="">-- No Course --</option>
                                ${state.courses.map(c => `<option value="${c.id}" ${currentCourseId === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
                            </select>
                        </div>
                    </div>`;
            });
        }
        html += `</div></div>`;
    });
    
    html += `</div>
            <div class="mt-8 text-right">
                <button type="submit" class="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700">Save Schedule</button>
            </div>
        </form>`;
    
    content.innerHTML = html;
    document.getElementById('schedule-form').addEventListener('submit', (e) => window.handleScheduleFormSubmit(e, studentId));
}

export function renderProfile(app) {
    setPageTitle('Profile');
    const content = document.getElementById('content');
    if (!content) return;
    const { state } = app;
    const isParent = state.user.role === 'parent';

    content.innerHTML = `<div class="bg-slate-50 p-6 rounded-lg max-w-md mx-auto">
        <form id="profile-form">
            <div class="space-y-4">
                <div>
                    <label class="block font-semibold text-slate-700">Full Name</label>
                    <input type="text" name="displayName" value="${state.user.displayName}" 
                           class="w-full p-2 border rounded-lg mt-1 ${isParent ? 'bg-slate-100 cursor-not-allowed' : ''}" 
                           ${isParent ? 'readonly' : ''}>
                    ${isParent ? `<p class="text-xs text-slate-500 mt-1">Parent names must be changed by a school administrator.</p>` : ''}
                </div>
                <div>
                    <label class="block font-semibold text-slate-700">Email</label>
                    <input type="email" value="${state.user.email}" class="w-full p-2 border rounded-lg mt-1 bg-slate-100" readonly>
                </div>
                <div>
                    <label class="block font-semibold text-slate-700">Role</label>
                    <p class="mt-2 inline-block bg-primary-100 text-primary-700 font-semibold px-3 py-1 rounded-full text-sm capitalize">${state.user.role}</p>
                </div>
                ${!isParent ? `<button type="submit" class="w-full bg-primary-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-600">Save Changes</button>` : ''}
            </div>
        </form>
    </div>`;

    if (!isParent) {
        document.getElementById('profile-form').addEventListener('submit', (e) => window.handleProfileUpdate(e));
    }
}

export function renderSettings(app, idParts, params) {
    if (app.state.user.role !== 'admin') { document.getElementById('content').innerHTML = `<p>You do not have permission to view this page.</p>`; return; }
    setPageTitle('Settings');
    const content = document.getElementById('content');
    if(!content) return;
    const currentTab = params.get('tab') || 'general';
    const tabs = [
        { id: 'general', name: 'General' }, { id: 'academics', name: 'Academics' },
        { id: 'master_calendar', name: 'Master Calendar' }, { id: 'tuition', name: 'Tuition Items' },
        { id: 'launchpad', name: 'Launchpad' }, { id: 'lunch_menu', name: 'Lunch Menu' }
    ];
    content.innerHTML = `
        <div class="flex border-b mb-6 overflow-x-auto">
            ${tabs.map(tab => `<a href="#/settings?tab=${tab.id}" class="settings-tab p-4 border-b-2 ${currentTab === tab.id ? 'active' : ''}">${tab.name}</a>`).join('')}
        </div>
        <div id="settings-content"></div>
    `;
    const tabRenderers = {
        'general': renderSettingsGeneral, 'academics': renderSettingsAcademics,
        'master_calendar': renderSettingsMasterCalendar, 'tuition': renderSettingsTuition,
        'launchpad': renderSettingsLaunchpad, 'lunch_menu': renderSettingsLunchMenu
    };
    (tabRenderers[currentTab] || tabRenderers.general)(app);
}

function renderSettingsGeneral(app) { const { state } = app; const content = document.getElementById('settings-content'); if(!content) return; content.innerHTML = `<form id="general-settings-form" class="max-w-xl space-y-6"><div><label for="school-name" class="block font-semibold text-slate-700">School Name</label><input type="text" id="school-name" name="name" value="${state.school.name}" class="mt-1 w-full p-2 border rounded-lg" required></div><div><label for="school-logo" class="block font-semibold text-slate-700">School Logo URL</label><input type="url" id="school-logo" name="logoUrl" value="${state.school.logoUrl || ''}" placeholder="https://..." class="mt-1 w-full p-2 border rounded-lg"></div><div><label class="block font-semibold text-slate-700">Theme Color</label><div class="mt-2 flex flex-wrap gap-4">${Object.keys(C.palettes).map(theme => `<label class="flex items-center space-x-2"><input type="radio" name="theme" value="${theme}" ${state.school.theme === theme ? 'checked' : ''} class="w-5 h-5 text-primary-600 focus:ring-primary-500 border-gray-300"><span class="capitalize">${theme}</span><span class="h-6 w-6 rounded-full" style="background-color: ${C.palettes[theme][500]}"></span></label>`).join('')}</div></div><button type="submit" class="bg-primary-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-600">Save Changes</button></form>`; document.getElementById('general-settings-form').addEventListener('submit', (e) => window.handleGeneralSettingsSubmit(e)); }

function renderSettingsAcademics(app) {
    const { state } = app;
    const content = document.getElementById('settings-content');
    if(!content) return;
    const dayTypes = state.dayTypes.map(dt => `
        <div class="bg-white p-4 rounded-lg shadow">
            <div class="flex justify-between items-center mb-2">
                <h4 class="text-lg font-bold">${dt.name}</h4>
                <div>
                    <button onclick="window.duplicateDayType('${dt.id}')" class="text-sm font-semibold text-blue-600 hover:text-blue-800">DUPLICATE</button>
                    <button onclick="window.openDayTypeModal('${dt.id}')" class="text-sm font-semibold text-yellow-600 hover:text-yellow-800 ml-2">EDIT</button>
                    <button onclick="window.deleteDayType('${dt.id}')" class="text-sm font-semibold text-red-600 hover:text-red-800 ml-2">DELETE</button>
                </div>
            </div>
            <ul class="space-y-2">${state.timeBlocks.filter(tb => tb.dayTypeId === dt.id).sort((a,b) => a.startTime.localeCompare(b.startTime)).map(tb => `<li class="p-2 bg-slate-100 rounded flex justify-between items-center"><div><strong>${tb.name}</strong>: ${tb.startTime} - ${tb.endTime}</div><div><button onclick="window.openTimeBlockModal('${tb.id}', '${dt.id}')" class="text-xs font-semibold text-yellow-600 hover:text-yellow-800">EDIT</button><button onclick="window.deleteTimeBlock('${tb.id}')" class="text-xs font-semibold text-red-600 hover:text-red-800 ml-2">DELETE</button></div></li>`).join('')}</ul>
            <button onclick="window.openTimeBlockModal(null, '${dt.id}')" class="mt-3 w-full text-sm font-bold bg-slate-200 hover:bg-slate-300 text-slate-700 py-1 rounded">Add Time Block</button>
        </div>`).join('');
    content.innerHTML = `<div class="grid grid-cols-1 lg:grid-cols-2 gap-6"><div class="lg:col-span-2 flex justify-between items-center"><div><h3 class="text-2xl font-bold">Day Types & Schedules</h3><p class="text-slate-500">Define the different types of school days and their time blocks.</p></div><button onclick="window.openDayTypeModal()" class="bg-primary-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-600">New Day Type</button></div>${dayTypes}</div>`;
}

function renderSettingsMasterCalendar(app) {
    const content = document.getElementById('settings-content');
    if(!content) return;
    content.innerHTML = `<h3 class="text-2xl font-bold mb-4">Master Calendar</h3><div id="master-calendar"></div>`;
    setTimeout(() => {
        const { state } = app;
        const calendarEl = document.getElementById('master-calendar');
        const calendarEvents = state.masterCalendar.map(e => ({
            id: e.id,
            title: state.dayTypes.find(dt => dt.id === e.dayTypeId)?.name || 'Unknown',
            start: e.date,
            allDay: true,
        }));
        const calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            headerToolbar: { left: 'prev,next today', center: 'title', right: 'dayGridMonth' },
            events: calendarEvents,
            dateClick: (info) => window.openMasterCalendarModal(info.dateStr, null),
            eventClick: (info) => window.openMasterCalendarModal(info.event.startStr, info.event.id)
        });
        calendar.render();
    }, 0);
}

function renderSettingsTuition(app) {
    const { state } = app;
    const content = document.getElementById('settings-content');
    if(!content) return;
    const items = state.tuitionItems.map(item => {
        const student = state.students.find(s => s.id === item.studentId);
        return `<tr><td class="py-2 px-4 border-b">${student?.displayName || 'N/A'}</td><td class="py-2 px-4 border-b">${item.description}</td><td class="py-2 px-4 border-b text-right">$${parseFloat(item.amount).toFixed(2)}</td><td class="py-2 px-4 border-b text-right"><button onclick="window.openTuitionItemModal('${item.id}')" class="text-yellow-600 font-semibold text-sm">EDIT</button><button onclick="window.deleteTuitionItem('${item.id}')" class="ml-2 text-red-600 font-semibold text-sm">DELETE</button></td></tr>`;
    }).join('');
    content.innerHTML = `<div class="flex justify-between items-center mb-4"><h3 class="text-2xl font-bold">Tuition & Billing Items</h3><button onclick="window.openTuitionItemModal()" class="bg-primary-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-600">Add Item</button></div><table class="min-w-full bg-white"><thead><tr class="bg-slate-100"><th class="text-left py-2 px-4">Student</th><th class="text-left py-2 px-4">Description</th><th class="text-right py-2 px-4">Amount</th><th class="text-right py-2 px-4">Actions</th></tr></thead><tbody>${items}</tbody></table>`;
}

function renderSettingsLaunchpad(app) {
    const { state } = app;
    const content = document.getElementById('settings-content');
    if(!content) return;
    const links = state.launchpadLinks.map(link => `<tr><td class="py-2 px-4 border-b">${link.name}</td><td class="py-2 px-4 border-b"><a href="${link.url}" target="_blank" class="text-blue-600 hover:underline">${link.url}</a></td><td class="py-2 px-4 border-b text-right"><button onclick="window.openLaunchpadLinkModal('${link.id}')" class="text-yellow-600 font-semibold text-sm">EDIT</button><button onclick="window.deleteLaunchpadLink('${link.id}')" class="ml-2 text-red-600 font-semibold text-sm">DELETE</button></td></tr>`).join('');
    content.innerHTML = `<div class="flex justify-between items-center mb-4"><h3 class="text-2xl font-bold">Launchpad Links</h3><button onclick="window.openLaunchpadLinkModal()" class="bg-primary-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-600">Add Link</button></div><table class="min-w-full bg-white"><thead><tr class="bg-slate-100"><th class="text-left py-2 px-4">Name</th><th class="text-left py-2 px-4">URL</th><th class="text-right py-2 px-4">Actions</th></tr></thead><tbody>${links}</tbody></table>`;
}

function renderSettingsLunchMenu(app) {
    const { state } = app;
    const content = document.getElementById('settings-content');
    if (!content) return;

    const today = new Date();
    const dayOfWeek = today.getDay(); // Sunday - 0, Monday - 1, etc.
    const monday = new Date(today);
    monday.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)); // Adjust for Sunday

    const weekDates = [];
    for (let i = 0; i < 5; i++) {
        const day = new Date(monday);
        day.setDate(monday.getDate() + i);
        weekDates.push(day.toISOString().split('T')[0]);
    }

    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    const formFields = weekDates.map((date, index) => {
        const menu = state.lunchMenu.find(m => m.id === date);
        const menuText = menu ? menu.items.join('\n') : '';
        return `<div class="bg-slate-50 p-4 rounded-lg">
            <label class="font-bold text-lg text-slate-700">${dayNames[index]} (${date})</label>
            <textarea name="menu_${date}" rows="5" class="w-full p-2 mt-2 border rounded-md" placeholder="Enter one menu item per line">${menuText}</textarea>
        </div>`;
    }).join('');

    content.innerHTML = `
        <div class="flex justify-between items-center mb-4">
            <h3 class="text-2xl font-bold">Manage Weekly Lunch Menu</h3>
        </div>
        <p class="mb-4 text-slate-600">Enter the lunch menu for the current week. Each line in the text box will be treated as a separate menu item.</p>
        <form id="lunch-menu-form" data-week='${JSON.stringify(weekDates)}'>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                ${formFields}
            </div>
            <div class="text-right mt-6">
                <button type="submit" class="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700">Save Menu</button>
            </div>
        </form>
    `;
    document.getElementById('lunch-menu-form').addEventListener('submit', e => window.handleLunchMenuUpdate(e));
}

export function renderReports(app, idParts, params) {
    const { state } = app;
    if (state.user.role === 'student' || state.user.role === 'teacher') { document.getElementById('content').innerHTML = `<p>You do not have permission to view this page.</p>`; return; }
    setPageTitle('Reports');
    const content = document.getElementById('content');
    if(!content) return;
    const currentTab = params.get('tab') || (state.user.role === 'admin' ? 'enrollment' : 'tuition');
    const adminTabs = [
        { id: 'enrollment', name: 'Enrollment' }, { id: 'schedule_completion', name: 'Schedule Completion' },
        { id: 'attendance', name: 'Attendance' }, { id: 'grade_distribution', name: 'Grade Distribution' },
        { id: 'tuition', name: 'Tuition' },
    ];
    const parentTabs = [{ id: 'tuition', name: 'Tuition Statement' }];
    const tabs = state.user.role === 'admin' ? adminTabs : parentTabs;

    content.innerHTML = `<div class="flex border-b mb-6 overflow-x-auto">${tabs.map(tab => `<a href="#/reports?tab=${tab.id}" class="report-tab p-4 border-b-2 ${currentTab === tab.id ? 'active' : ''}">${tab.name}</a>`).join('')}</div><div id="report-content"></div>`;
    const adminRenderers = { enrollment: renderEnrollmentReport, attendance: renderAttendanceReport, schedule_completion: renderScheduleReport, grade_distribution: renderGradeDistributionReport, tuition: renderAdminTuitionReport };
    const parentRenderers = { tuition: renderParentTuitionReport };
    const renderers = state.user.role === 'admin' ? adminRenderers : parentRenderers;
    (renderers[currentTab] || (()=>{}))(app);
}

function renderEnrollmentReport(app) {
    const { state } = app;
    const content = document.getElementById('report-content');
    if(!content) return;
    const roleCounts = state.allUsers.reduce((acc, user) => { acc[user.role] = (acc[user.role] || 0) + 1; return acc; }, {});
    const courses = state.courses.map(c => `<tr><td class="p-2 border-b">${c.name}</td><td class="p-2 border-b">${state.teachers.find(t=>t.id === c.teacherId)?.displayName || 'N/A'}</td><td class="p-2 border-b text-center">${app.getEnrolledStudentIds(c.id).length}</td></tr>`).join('');
    content.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><h3 class="text-xl font-bold mb-2">Enrollment by Role</h3>
            <div class="bg-slate-50 p-4 rounded-lg space-y-2">${Object.keys(roleCounts).map(role => `<div class="flex justify-between font-semibold"><span class="capitalize">${role}</span><span>${roleCounts[role]}</span></div>`).join('')}</div></div>
            <div><h3 class="text-xl font-bold mb-2">Enrollment by Course</h3><table class="w-full text-left"><thead><tr class="bg-slate-100"><th class="p-2">Course</th><th class="p-2">Teacher</th><th class="p-2 text-center">Students</th></tr></thead><tbody>${courses}</tbody></table></div>
        </div>
    `;
}

function renderScheduleReport(app) {
    const { state } = app;
    const content = document.getElementById('report-content');
    if (!content) return;

    const totalTimeBlocks = state.dayTypes.reduce((sum, dt) => {
        return sum + state.timeBlocks.filter(tb => tb.dayTypeId === dt.id).length;
    }, 0);

    let html = `<h3 class="text-xl font-bold mb-4">Student Schedule Completion</h3>
        <p class="text-slate-600 mb-4">This report shows the percentage of available time blocks that have a course scheduled for each student.</p>
        <table class="min-w-full bg-white text-left">
            <thead class="bg-slate-100">
                <tr>
                    <th class="p-3 font-semibold">Student</th>
                    <th class="p-3 font-semibold text-center">Scheduled / Total Blocks</th>
                    <th class="p-3 font-semibold">Completion</th>
                </tr>
            </thead>
            <tbody>`;

    state.students.forEach(student => {
        const schedule = state.schedules.find(s => s.studentId === student.id);
        const scheduledBlocks = schedule ? Object.values(schedule.schedule).filter(courseId => courseId).length : 0;
        const completion = totalTimeBlocks > 0 ? (scheduledBlocks / totalTimeBlocks) * 100 : 0;
        const barColor = completion > 80 ? 'bg-green-500' : completion > 50 ? 'bg-yellow-500' : 'bg-red-500';

        html += `<tr class="border-b">
            <td class="p-3">${student.displayName}</td>
            <td class="p-3 text-center">${scheduledBlocks} / ${totalTimeBlocks}</td>
            <td class="p-3">
                <div class="w-full bg-slate-200 rounded-full h-4">
                    <div class="${barColor} h-4 rounded-full" style="width: ${completion.toFixed(2)}%"></div>
                </div>
                <span class="text-xs">${completion.toFixed(0)}%</span>
            </td>
        </tr>`;
    });

    html += `</tbody></table>`;
    content.innerHTML = html;
}


function renderAttendanceReport(app) {
    const { state } = app;
    const content = document.getElementById('report-content');
    if (!content) return;

    let html = `<h3 class="text-xl font-bold mb-4">Student Attendance Summary</h3>
        <p class="text-slate-600 mb-4">This report shows a count of absences and tardies for each student across all courses.</p>
        <table class="min-w-full bg-white text-left">
            <thead class="bg-slate-100">
                <tr>
                    <th class="p-3 font-semibold">Student</th>
                    <th class="p-3 font-semibold text-center">Absences</th>
                    <th class="p-3 font-semibold text-center">Tardies</th>
                </tr>
            </thead>
            <tbody>`;

    state.students.forEach(student => {
        let absentCount = 0;
        let tardyCount = 0;
        state.attendance.forEach(record => {
            const status = record.statuses[student.id];
            if (status === 'absent') absentCount++;
            if (status === 'tardy') tardyCount++;
        });

        html += `<tr class="border-b">
            <td class="p-3">${student.displayName}</td>
            <td class="p-3 text-center font-semibold ${absentCount > 0 ? 'text-red-600' : ''}">${absentCount}</td>
            <td class="p-3 text-center font-semibold ${tardyCount > 0 ? 'text-yellow-600' : ''}">${tardyCount}</td>
        </tr>`;
    });
    
    html += `</tbody></table>`;
    content.innerHTML = html;
}

function renderGradeDistributionReport(app) {
    const { state } = app;
    const content = document.getElementById('report-content');
    if (!content) return;

    const courseId = new URLSearchParams(window.location.hash.split('?')[1]).get('courseId');
    const courseOptions = state.courses.map(c => `<option value="${c.id}" ${c.id === courseId ? 'selected' : ''}>${c.name}</option>`).join('');

    let html = `<h3 class="text-xl font-bold mb-4">Grade Distribution Report</h3>
        <select id="grade-report-course" class="p-2 border rounded-lg mb-4">
            <option value="">-- Select a Course --</option>
            ${courseOptions}
        </select>`;

    if (courseId) {
        const assignments = state.assignments.filter(a => a.courseId === courseId);
        if (assignments.length === 0) {
            html += `<p class="text-slate-500">This course has no assignments.</p>`;
        } else {
            html += `<div class="grid grid-cols-1 md:grid-cols-2 gap-6">`;
            assignments.forEach(assignment => {
                const grades = state.grades.filter(g => g.assignmentId === assignment.id && g.score != null);
                const scores = grades.map(g => (g.score / assignment.maxPoints) * 100);
                const avg = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
                
                html += `<div class="bg-slate-50 p-4 rounded-lg">
                    <h4 class="font-bold">${assignment.title}</h4>
                    <p class="text-sm text-slate-500">${grades.length} students graded</p>
                    <p class="text-lg font-semibold mt-2">Average: <span class="${avg >= 80 ? 'text-green-600' : avg >= 60 ? 'text-yellow-600' : 'text-red-600'}">${avg.toFixed(1)}%</span></p>
                </div>`;
            });
            html += `</div>`;
        }
    }
    content.innerHTML = html;
    document.getElementById('grade-report-course')?.addEventListener('change', (e) => {
        window.location.hash = `#/reports?tab=grade_distribution&courseId=${e.target.value}`;
    });
}

function renderAdminTuitionReport(app) {
    const { state } = app;
    const content = document.getElementById('report-content');
    if (!content) return;
    
    const parents = state.allUsers.filter(u => u.role === 'parent');
    
    let html = `<h3 class="text-xl font-bold mb-4">Parent Account Balances</h3>
        <table class="min-w-full bg-white text-left">
            <thead class="bg-slate-100">
                <tr>
                    <th class="p-3 font-semibold">Parent Name</th>
                    <th class="p-3 font-semibold">Assigned Students</th>
                    <th class="p-3 font-semibold text-right">Total Balance</th>
                    <th class="p-3 font-semibold text-center">Actions</th>
                </tr>
            </thead>
            <tbody>`;

    parents.forEach(parent => {
        const studentIds = parent.childrenIds || [];
        const studentNames = state.students.filter(s => studentIds.includes(s.id)).map(s => s.displayName).join(', ');
        const balance = state.tuitionItems.filter(i => studentIds.includes(i.studentId)).reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

        html += `<tr class="border-b">
            <td class="p-3">${parent.displayName}</td>
            <td class="p-3 text-sm">${studentNames || 'None'}</td>
            <td class="p-3 text-right font-semibold">$${balance.toFixed(2)}</td>
            <td class="p-3 text-center">
                <button onclick="window.openParentStatementModal('${parent.id}')" class="text-primary-600 hover:underline text-sm font-semibold">View Statement</button>
            </td>
        </tr>`;
    });

    html += `</tbody></table>`;
    content.innerHTML = html;
}

function renderParentTuitionReport(app) {
    const { state } = app;
    const content = document.getElementById('report-content');
    if (!content) return;
    
    const studentIds = state.user.childrenIds || [];
    const items = state.tuitionItems.filter(item => studentIds.includes(item.studentId));
    if (items.length === 0) {
        content.innerHTML = `<p class="text-slate-500">No billing items found for your account.</p>`;
        return;
    }
    
    const total = items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    const itemsHtml = items.map(item => {
        const student = state.students.find(s => s.id === item.studentId);
        return `<tr><td class="p-2 border-b">${student?.displayName || ''}</td><td class="p-2 border-b">${item.description}</td><td class="p-2 border-b text-right">$${parseFloat(item.amount).toFixed(2)}</td></tr>`;
    }).join('');

    content.innerHTML = `
        <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-bold">Annual Statement for ${state.user.displayName}</h3>
            <button onclick="window.openParentStatementModal()" class="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600">Download PDF Statement</button>
        </div>
        <table class="w-full text-left">
            <thead class="bg-slate-100"><th class="p-2 font-semibold">Student</th><th class="p-2 font-semibold">Description</th><th class="p-2 font-semibold text-right">Amount</th></thead>
            <tbody>${itemsHtml}</tbody>
            <tfoot><tr class="font-bold border-t-2"><td class="p-2" colspan="2">Total Due</td><td class="p-2 text-right">$${total.toFixed(2)}</td></tr></tfoot>
        </table>`;
}

export function renderReportCards(app, idParts, params) {
    const { state } = app;
    const content = document.getElementById('content');
    if(!content) return;

    if (state.user.role === 'admin' || state.user.role === 'teacher') {
        setPageTitle('Report Cards');
        const currentTab = params.get('tab') || 'generator';
        const tabs = [
            { id: 'generator', name: 'Generator' },
            { id: 'template', name: 'Template Editor' },
        ];
        content.innerHTML = `<div class="flex border-b mb-6 overflow-x-auto">${tabs.map(tab => `<a href="#/report-cards?tab=${tab.id}" class="report-tab p-4 border-b-2 ${currentTab === tab.id ? 'active' : ''}">${tab.name}</a>`).join('')}</div><div id="rc-content"></div>`;
        const renderers = { 'generator': renderReportCardGenerator, 'template': renderReportCardTemplateEditor };
        (renderers[currentTab] || renderers.generator)(app);
    } else {
        renderStudentReportCards(app);
    }
}

function renderStudentReportCards(app) {
    setPageTitle('Report Cards');
    const { state } = app;
    const content = document.getElementById('content');
    if(!content) return;

    const studentIds = state.user.role === 'parent' ? state.user.childrenIds || [] : [state.user.id];
    const myReportCards = state.generatedReportCards.filter(rc => studentIds.includes(rc.studentId)).sort((a,b) => b.generatedAt?.toDate() - a.generatedAt?.toDate());
    
    if (myReportCards.length === 0) {
        content.innerHTML = `<p class="text-slate-500">No report cards have been generated yet.</p>`;
        return;
    }

    let html = `<div class="space-y-4">`;
    myReportCards.forEach(rc => {
        html += `<div class="bg-slate-50 p-4 rounded-lg flex justify-between items-center">
            <div>
                <p class="font-bold text-lg">${rc.periodName}</p>
                <p class="text-sm text-slate-600">${rc.studentName}</p>
            </div>
            <button onclick="window.openReportCardModal('${rc.id}')" class="bg-primary-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-600">View</button>
        </div>`;
    });
    html += `</div>`;
    content.innerHTML = html;
}

function renderReportCardGenerator(app) {
    const { state } = app;
    const content = document.getElementById('rc-content');
    if(!content) return;

    const periodsHtml = state.gradingPeriods.map(p => {
        const generatedCount = state.generatedReportCards.filter(rc => rc.periodId === p.id).length;
        return `<tr>
            <td class="p-3 border-b">${p.name}</td>
            <td class="p-3 border-b">${p.startDate} to ${p.endDate}</td>
            <td class="p-3 border-b">${generatedCount} / ${state.students.length} students</td>
            <td class="p-3 border-b text-right">
                <button id="generate-rc-btn-${p.id}" onclick="window.generateReportCardsForPeriod('${p.id}')" class="bg-green-600 text-white font-bold py-1 px-3 rounded-lg text-sm hover:bg-green-700">Generate</button>
            </td>
        </tr>`;
    }).join('');

    const generatedHtml = state.generatedReportCards.sort((a,b) => b.generatedAt?.toDate() - a.generatedAt?.toDate()).map(rc => {
        return `<tr>
            <td class="p-3 border-b">${rc.studentName}</td>
            <td class="p-3 border-b">${rc.periodName}</td>
            <td class="p-3 border-b">${rc.generatedAt?.toDate().toLocaleDateString()}</td>
            <td class="p-3 border-b text-right">
                <button onclick="window.openReportCardModal('${rc.id}')" class="text-sm font-semibold text-blue-600 hover:underline">View</button>
                <button onclick="window.deleteReportCard('${rc.id}')" class="text-sm font-semibold text-red-600 hover:underline ml-2">Delete</button>
            </td>
        </tr>`;
    }).join('');

    content.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-bold">Grading Periods</h3>
                    <button onclick="window.openGradingPeriodModal()" class="bg-primary-500 text-white font-bold py-1 px-3 rounded-lg text-sm hover:bg-primary-600">Add Period</button>
                </div>
                <table class="w-full text-left bg-white rounded-lg shadow"><thead><tr class="bg-slate-100"><th class="p-3">Name</th><th class="p-3">Dates</th><th class="p-3">Status</th><th class="p-3"></th></tr></thead><tbody>${periodsHtml}</tbody></table>
            </div>
            <div>
                <h3 class="text-xl font-bold mb-4">Generated Report Cards</h3>
                <div class="max-h-96 overflow-y-auto"><table class="w-full text-left bg-white rounded-lg shadow"><thead><tr class="bg-slate-100"><th class="p-3">Student</th><th class="p-3">Period</th><th class="p-3">Date</th><th class="p-3"></th></tr></thead><tbody>${generatedHtml}</tbody></table></div>
            </div>
        </div>
    `;
}

function renderReportCardTemplateEditor(app) {
    const { state } = app;
    const content = document.getElementById('rc-content');
    if(!content) return;

    const components = [
        { type: 'schoolHeader', name: 'School Header', icon: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"/></svg>`, preview: '<h1>School Name</h1><h2>Report Card</h2>' },
        { type: 'studentInfo', name: 'Student Info', icon: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>`, preview: '<p><strong>Student:</strong> John Doe</p><p><strong>Period:</strong> Trimester 1</p>' },
        { type: 'gradesTable', name: 'Grades Table', icon: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 15h18M3 20h18M3 5h18"/></svg>`, preview: 'Shows detailed assignments and a final grade for each course.' },
        { type: 'finalGrade', name: 'Final Grade Summary', icon: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`, preview: 'A summary table of final grades for all courses.' },
        { type: 'attendanceSummary', name: 'Attendance', icon: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>`, preview: '<p><strong>Absences:</strong> 2</p><p><strong>Tardies:</strong> 1</p>' },
        { type: 'gradingScale', name: 'Grading Scale', icon: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"/></svg>`, preview: '<p>A: 90-100, B: 80-89, ...</p>' },
        { type: 'teacherComments', name: 'Teacher Comments', icon: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>`, preview: 'A text box for teacher comments.' },
        { type: 'principalComment', name: 'Principal\'s Comment', icon: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>`, preview: 'A text box for the principal\'s comments.' },
        { type: 'signatureLine', name: 'Signature Line', icon: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>`, preview: '<p>___________________</p><p>Signature</p>' },
        { type: 'pageBreak', name: 'Page Break', icon: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15V5m0 10l3.5-3.5M5 15l-3.5-3.5M19 15V5m0 10l3.5-3.5M19 15l-3.5-3.5M4 9h16"/></svg>`, preview: 'Forces a new page when printing.' },
    ];

    content.innerHTML = `
        <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-bold">Report Card Template Editor</h3>
            <button onclick="window.handleReportCardTemplateSave()" class="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700">Save Template</button>
        </div>
        <div class="report-card-editor">
            <div id="rc-palette" class="palette">
                <h4 class="font-bold text-lg mb-2 text-slate-600">Components</h4>
                <p class="text-sm text-slate-500 mb-4">Drag components onto the canvas.</p>
                ${components.map(c => `
                    <div class="palette-item" draggable="true" data-type="${c.type}">
                        ${c.icon}
                        <span>${c.name}</span>
                    </div>
                `).join('')}
            </div>
            <div id="rc-canvas" class="canvas"></div>
        </div>
    `;
    const canvas = document.getElementById('rc-canvas');
    const template = state.reportCardTemplates[0];
    if (template && template.layout) {
        template.layout.forEach(item => {
            const component = components.find(c => c.type === item.type);
            if (component) {
                canvas.appendChild(createCanvasItem(component));
            }
        });
    }
    attachDragAndDropListeners(components);
}

function createCanvasItem(component) {
    const item = document.createElement('div');
    item.className = 'canvas-item';
    item.dataset.type = component.type;
    item.draggable = true;
    item.innerHTML = `
        <div class="flex items-start gap-4 flex-grow">
            <span class="item-icon">${component.icon}</span>
            <div class="item-content">
                <h5 class="font-bold text-slate-700">${component.name}</h5>
                <div class="canvas-item-preview">${component.preview}</div>
            </div>
        </div>
        <button class="remove-btn" onclick="this.parentElement.remove()">&times;</button>
    `;
    return item;
}

function attachDragAndDropListeners(components) {
    const paletteItems = document.querySelectorAll('#rc-palette .palette-item');
    const canvas = document.getElementById('rc-canvas');
    if (!canvas) return;
    let draggedItem = null;
    let placeholder = document.createElement('div');
    placeholder.className = 'canvas-item-placeholder';

    const getDragAfterElement = (container, y) => {
        const draggableElements = [...container.querySelectorAll('.canvas-item:not([style*="display: none"])')];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    };

    const addCanvasItemListeners = (item) => {
        item.addEventListener('dragstart', (e) => {
            draggedItem = e.target.closest('.canvas-item');
            e.dataTransfer.effectAllowed = 'move';
            setTimeout(() => { item.style.display = 'none'; }, 0);
        });
        item.addEventListener('dragend', () => {
            setTimeout(() => {
                if (draggedItem) draggedItem.style.display = 'flex';
                draggedItem = null;
                if (placeholder.parentElement) placeholder.remove();
            }, 0);
        });
    };

    paletteItems.forEach(item => {
        item.addEventListener('dragstart', (e) => {
            draggedItem = e.target.closest('.palette-item');
            e.dataTransfer.effectAllowed = 'copy';
        });
    });

    canvas.addEventListener('dragover', (e) => {
        e.preventDefault();
        canvas.classList.add('drag-over');
        const afterElement = getDragAfterElement(canvas, e.clientY);
        if (afterElement == null) {
            canvas.appendChild(placeholder);
        } else {
            canvas.insertBefore(placeholder, afterElement);
        }
    });
    
    canvas.addEventListener('dragleave', () => { canvas.classList.remove('drag-over'); });
    canvas.addEventListener('dragend', () => { canvas.classList.remove('drag-over'); });
    
    canvas.addEventListener('drop', (e) => {
        e.preventDefault();
        canvas.classList.remove('drag-over');
        if (!draggedItem) return;

        let newItem;
        if (draggedItem.classList.contains('canvas-item')) { // Reordering
            newItem = draggedItem;
        } else { // New item from palette
            const type = draggedItem.dataset.type;
            const component = components.find(c => c.type === type);
            if (component) {
                newItem = createCanvasItem(component);
                addCanvasItemListeners(newItem);
            }
        }

        if (newItem && placeholder.parentElement) {
            canvas.replaceChild(newItem, placeholder);
            newItem.style.display = 'flex';
        }
        draggedItem = null;
    });
    
    document.querySelectorAll('#rc-canvas .canvas-item').forEach(item => {
        addCanvasItemListeners(item);
    });
}

// --- MODAL & PRINTABLE CONTENT RENDERERS ---

export function openHomeworkModal(app, assignmentId) {
    const { state } = app;
    const assignment = state.assignments.find(a => a.id === assignmentId);
    if (!assignment) {
        showToast('Assignment not found.', 'error');
        return;
    }
    const course = state.courses.find(c => c.id === assignment.courseId);
    const submission = state.homeworkSubmissions.find(s => s.assignmentId === assignmentId && s.studentId === state.user.id);

    const isStudent = state.user.role === 'student' || state.user.role === 'parent';
    
    let submissionHtml = '';
    if (isStudent) {
        let previewHtml = '';
        if (submission?.fileUrl && submission.fileType?.startsWith('image/')) {
            previewHtml = `<img src="${submission.fileUrl}" alt="Submission preview" class="submission-preview-img mx-auto">`;
        }
        
        submissionHtml = `
            <div class="mt-6 pt-6 border-t">
                <h4 class="text-xl font-bold text-slate-700 mb-4">My Submission</h4>
                ${submission ? `
                    <div class="submission-list-item">
                        <div>
                            <p class="font-semibold">Submitted: ${submission.submittedAt?.toDate().toLocaleString()}</p>
                            <a href="${submission.fileUrl}" target="_blank" class="submission-file-link mt-1">${submission.fileName}</a>
                        </div>
                        <span class="font-semibold text-sm py-1 px-3 rounded-full ${submission.status === 'graded' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'} capitalize">${submission.status}</span>
                    </div>
                    ${submission.status === 'graded' ? `
                        <div class="bg-slate-50 p-3 rounded-lg mt-3">
                            <p><strong>Grade:</strong> ${submission.grade} / ${assignment.maxPoints}</p>
                            <p><strong>Feedback:</strong> ${submission.feedback || 'No feedback provided.'}</p>
                        </div>
                    ` : ''}
                ` : '<p class="text-slate-500">No submission yet.</p>'}
                <form id="homework-upload-form" class="mt-4">
                    <label for="homework-file-upload" class="file-upload-area">
                        <svg class="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                        <p class="mt-2 text-slate-600">Drag & drop a file here, or click to select.</p>
                        <input id="homework-file-upload" name="file" type="file">
                    </label>
                    <div id="file-preview-container" class="mt-2"></div>
                    <div id="upload-progress-container" class="mt-4 hidden"><div class="upload-progress-bar"><div id="upload-progress-bar-inner" style="width: 0%"></div></div></div>
                    <button type="submit" class="w-full mt-4 bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700">Submit</button>
                </form>
            </div>
        `;
    }

    const title = `${course.name}: ${assignment.title}`;
    const body = `
        <p class="text-slate-600"><strong>Due Date:</strong> ${assignment.dueDate}</p>
        <p class="text-slate-600"><strong>Points:</strong> ${assignment.maxPoints}</p>
        ${submissionHtml}
    `;
    
    openModal(title, body);

    if (isStudent) {
        const form = document.getElementById('homework-upload-form');
        const fileInput = document.getElementById('homework-file-upload');
        const fileArea = form.querySelector('.file-upload-area');
        const previewContainer = document.getElementById('file-preview-container');

        form.addEventListener('submit', (e) => window.handleHomeworkFileUpload(e, assignmentId));

        fileArea.addEventListener('dragover', (e) => { e.preventDefault(); fileArea.classList.add('drag-over'); });
        fileArea.addEventListener('dragleave', () => fileArea.classList.remove('drag-over'));
        fileArea.addEventListener('drop', (e) => {
            e.preventDefault();
            fileArea.classList.remove('drag-over');
            if (e.dataTransfer.files.length > 0) {
                fileInput.files = e.dataTransfer.files;
                fileInput.dispatchEvent(new Event('change'));
            }
        });

        fileInput.addEventListener('change', () => {
            previewContainer.innerHTML = '';
            const file = fileInput.files[0];
            if (file) {
                previewContainer.innerHTML = `<p class="font-semibold text-center">${file.name}</p>`;
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        previewContainer.innerHTML += `<img src="${e.target.result}" alt="Preview" class="submission-preview-img mx-auto">`;
                    };
                    reader.readAsDataURL(file);
                }
            }
        });
    }
}

export function renderReportCardModalContent(app, rc) {
    const { state } = app;
    const student = state.students.find(s => s.id === rc.studentId);

    const componentRenderers = {
        schoolHeader: () => `<div class="text-center mb-8"><h1 class="text-3xl font-bold">${state.school.name}</h1><h2 class="text-xl">Report Card</h2></div>`,
        studentInfo: () => `<div class="mb-6"><p><strong>Student:</strong> ${rc.studentName}</p><p><strong>Grading Period:</strong> ${rc.periodName}</p><p><strong>Date Generated:</strong> ${rc.generatedAt.toDate().toLocaleDateString()}</p></div>`,
        gradesTable: () => {
            let html = '';
            rc.data.courses?.forEach(course => {
                html += `<h4 class="font-bold text-lg mt-6 mb-2">${course.name}</h4><table class="w-full text-sm"><thead><tr class="border-b bg-slate-50"><th class="text-left p-2">Assignment</th><th class="text-right p-2">Score</th></tr></thead><tbody>`;
                (course.grades || []).forEach(g => {
                    html += `<tr><td class="p-2 border-b">${g.title}</td><td class="p-2 border-b text-right">${g.score ?? 'N/A'} / ${g.maxPoints}</td></tr>`;
                });
                html += `</tbody><tfoot><tr class="font-bold"><td class="p-2">Final Grade</td><td class="p-2 text-right">${course.finalLetterGrade} (${course.finalGradePercent?.toFixed(1) ?? 'N/A'}%)</td></tr></tfoot></table>`;
            });
            return html;
        },
        finalGrade: () => {
            let html = `<h4 class="font-bold text-lg mt-6 mb-2">Final Grades</h4><table class="w-full"><thead><tr class="border-b bg-slate-50"><th class="text-left p-2">Course</th><th class="text-right p-2">Grade</th></tr></thead><tbody>`;
            rc.data.courses?.forEach(course => {
                html += `<tr><td class="p-2 border-b">${course.name}</td><td class="p-2 border-b text-right">${course.finalLetterGrade} (${course.finalGradePercent?.toFixed(1) ?? 'N/A'}%)</td></tr>`;
            });
            return html + '</tbody></table>';
        },
        attendanceSummary: () => `<div class="mt-6"><h4 class="font-bold text-lg mb-2">Attendance Summary</h4><p><strong>Absences:</strong> ${rc.data.attendance?.absent || 0}</p><p><strong>Tardies:</strong> ${rc.data.attendance?.tardy || 0}</p></div>`,
        gradingScale: () => `<div class="mt-6 text-xs"><h4 class="font-bold text-lg mb-2">Grading Scale</h4><p>A: 90-100 | B: 80-89 | C: 70-79 | D: 60-69 | F: <60</p></div>`,
        teacherComments: () => `<div class="mt-6"><h4 class="font-bold text-lg mb-2">Teacher Comments</h4><div class="border h-24 p-2"></div></div>`,
        principalComment: () => `<div class="mt-6"><h4 class="font-bold text-lg mb-2">Principal's Comment</h4><div class="border h-24 p-2"></div></div>`,
        signatureLine: () => `<div class="mt-24 pt-4 border-t"><p>Signature</p></div>`,
        pageBreak: () => `<div class="page-break"></div>`
    };

    const layout = rc.templateLayout || [];
    let content = layout.map(component => (componentRenderers[component.type] || (() => ''))()).join('');
    
    return `<div id="printable-report-card" class="printable-report">${content}</div>`;
}

export function renderParentStatementModalContent(app, parent) {
    const { state } = app;
    const studentIds = parent.childrenIds || [];
    const studentNames = state.students.filter(s => studentIds.includes(s.id)).map(s => s.displayName).join(', ');
    const items = state.tuitionItems.filter(item => studentIds.includes(item.studentId));
    const total = items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    
    const itemsHtml = items.map(item => {
        const student = state.students.find(s => s.id === item.studentId);
        return `<tr><td class="p-2 border-b">${student?.displayName || ''}</td><td class="p-2 border-b">${item.description}</td><td class="p-2 border-b text-right">$${parseFloat(item.amount).toFixed(2)}</td></tr>`;
    }).join('');

    return `
        <div id="printable-statement" class="printable-report">
            <div class="text-center mb-8">
                <h1 class="text-2xl font-bold">${state.school.name}</h1>
                <h2 class="text-lg">Tuition Statement</h2>
            </div>
            <div class="mb-6">
                <p><strong>To:</strong> ${parent.displayName}</p>
                <p><strong>For Students:</strong> ${studentNames}</p>
                <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            <table class="w-full text-left">
                <thead class="bg-slate-50">
                    <tr>
                        <th class="p-2 font-bold border-b">Student</th>
                        <th class="p-2 font-bold border-b">Description</th>
                        <th class="p-2 font-bold border-b text-right">Amount</th>
                    </tr>
                </thead>
                <tbody>${itemsHtml}</tbody>
                <tfoot>
                    <tr class="font-bold text-lg border-t-2">
                        <td class="p-2" colspan="2">Total Amount Due</td>
                        <td class="p-2 text-right">$${total.toFixed(2)}</td>
                    </tr>
                </tfoot>
            </table>
            <div class="mt-24 pt-4 border-t text-sm">
                <p>Please make checks payable to ${state.school.name}. Thank you!</p>
            </div>
        </div>
    `;
}

export function renderPrintableSchedule(app, studentId) {
    const { state } = app;
    const container = document.getElementById('printable-schedule-content');
    if (!container) return;

    const student = state.students.find(s => s.id === studentId);
    if (!student) { container.innerHTML = 'Student not found.'; return; }
    
    const scheduleDoc = state.schedules.find(s => s.studentId === studentId);
    const studentSchedule = scheduleDoc ? scheduleDoc.schedule : {};
    
    let html = `<div class="text-center mb-6"><h1 class="text-xl font-bold">${state.school.name}</h1><h2 class="text-lg">Weekly Schedule: ${student.displayName}</h2></div>`;
    html += `<div class="space-y-6">`;

    state.dayTypes.forEach(dayType => {
        const timeBlocks = state.timeBlocks
            .filter(tb => tb.dayTypeId === dayType.id)
            .sort((a,b) => a.startTime.localeCompare(b.startTime));
        
        html += `<div><h3 class="text-lg font-bold mb-2">${dayType.name}</h3>`;
        if (timeBlocks.length > 0) {
            html += `<table class="printable-schedule-table"><thead><tr><th class="w-1/4">Time</th><th>Course</th><th class="w-1/4">Teacher</th></tr></thead><tbody>`;
            timeBlocks.forEach(block => {
                const courseId = studentSchedule[block.id];
                const course = courseId ? state.courses.find(c => c.id === courseId) : null;
                const teacher = course ? state.teachers.find(t => t.id === course.teacherId) : null;
                html += `<tr><td>${block.startTime} - ${block.endTime}</td><td>${course ? course.name : '---'}</td><td>${teacher ? teacher.displayName : '---'}</td></tr>`;
            });
            html += `</tbody></table>`;
        } else {
            html += `<p>No classes scheduled.</p>`;
        }
        html += `</div>`;
    });

    html += `</div>`;
    container.innerHTML = html;
}

export function renderBehaviorLog(app) {
    setPageTitle('Behavior Log');
    const { state } = app;
    const content = document.getElementById('content');
    if (!content) return;
    
    const isParent = state.user.role === 'parent';
    const canLog = state.user.role === 'admin' || state.user.role === 'teacher';

    const childrenIds = isParent ? state.user.childrenIds || [] : [];
    const myIncidents = isParent ? state.incidents.filter(i => childrenIds.includes(i.studentId)) : state.incidents;

    let studentSelector = '';
    if (canLog) {
        const studentOptions = state.students.map(s => `<option value="${s.id}">${s.displayName}</option>`).join('');
        studentSelector = `
            <div class="flex justify-end items-center mb-6">
                <select id="log-student-select" class="p-2 border rounded-lg mr-2">
                    <option value="">-- Select a Student to Log For --</option>
                    ${studentOptions}
                </select>
                <button id="log-incident-btn" class="bg-primary-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-600">Log New Incident</button>
            </div>
        `;
    }

    let incidentsHtml = '';
    if (myIncidents.length > 0) {
        incidentsHtml = `<div class="space-y-4">
            ${myIncidents.map(incident => {
                const student = state.students.find(s => s.id === incident.studentId);
                const typeClass = incident.type || 'neutral';
                const typeIcon = {
                    positive: 'M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L9 14.586l3.293-3.293a1 1 0 011.414 0z',
                    negative: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
                    neutral: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                }[incident.type];

                const canEdit = state.user.role === 'admin' || incident.reporterId === state.user.id;

                return `<div class="incident-card ${typeClass}">
                    <div class="incident-icon">
                        <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="${typeIcon}" clip-rule="evenodd" /></svg>
                    </div>
                    <div class="flex-grow">
                        <div class="flex justify-between items-start">
                             <div>
                                <p class="font-bold text-lg">${student?.displayName || 'Unknown Student'}</p>
                                <p class="text-sm text-slate-500">${incident.date} &bull; Reported by ${incident.reporterName}</p>
                             </div>
                             ${canEdit ? `
                                <div class="flex-shrink-0">
                                    <button onclick="window.openIncidentModal('${incident.studentId}', '${incident.id}')" class="text-xs font-semibold text-yellow-600 hover:text-yellow-800">EDIT</button>
                                    <button onclick="window.deleteIncident('${incident.id}')" class="text-xs font-semibold text-red-600 hover:text-red-800 ml-2">DELETE</button>
                                </div>
                             ` : ''}
                        </div>
                        <p class="mt-2 text-slate-700">${incident.description}</p>
                    </div>
                </div>`;
            }).join('')}
        </div>`;
    } else {
        incidentsHtml = `<p class="text-slate-500 text-center py-8">${isParent ? 'No behavior has been logged for your children.' : 'No incidents have been logged yet.'}</p>`;
    }
    
    content.innerHTML = studentSelector + incidentsHtml;
    
    if (canLog) {
        document.getElementById('log-incident-btn').addEventListener('click', () => {
            const studentId = document.getElementById('log-student-select').value;
            if (studentId) {
                window.openIncidentModal(studentId);
            } else {
                showToast('Please select a student first.', 'error');
            }
        });
    }
}

export function renderLunchMenu(app) {
    setPageTitle('Lunch Menu');
    const { state } = app;
    const content = document.getElementById('content');
    if (!content) return;
    
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));

    const weekDates = [];
    for (let i = 0; i < 5; i++) {
        const day = new Date(monday);
        day.setDate(monday.getDate() + i);
        weekDates.push(day.toISOString().split('T')[0]);
    }
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    let menuHtml = weekDates.map((date, index) => {
        const menu = state.lunchMenu.find(m => m.id === date);
        const menuItems = menu ? menu.items : [];
        return `<div class="menu-day-card">
            <h4>${dayNames[index]}</h4>
            ${menuItems.length > 0 ? `<ul>${menuItems.map(item => `<li>${item}</li>`).join('')}</ul>` : `<p class="text-slate-500">Menu not available.</p>`}
        </div>`;
    }).join('');

    content.innerHTML = `
        <div class="flex justify-between items-center mb-6">
            <h3 class="text-2xl font-bold text-slate-700">This Week's Lunch Menu</h3>
            ${state.user.role === 'admin' ? `<a href="#/settings?tab=lunch_menu" class="bg-primary-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-600">Manage Menu</a>` : ''}
        </div>
        <div class="lunch-menu-grid">${menuHtml}</div>
    `;
}