import { signOut, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { doc, updateDoc, addDoc, collection, setDoc, deleteDoc, writeBatch, query, where, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-storage.js";
import { showToast, openModal, closeModal } from './utils.js';
import { renderPrintableSchedule, renderReportCardModalContent, renderParentStatementModalContent } from './views.js';
import { Type } from "https://esm.run/@google/genai";

// This function makes class methods available on the window object for inline event handlers.
export function attachHandlersToWindow(app) {
    const handlers = {
        // Auth
        handleLoginSubmit: (e) => handleLoginSubmit(app, e),
        handleGoogleLogin: () => handleGoogleLogin(app),
        handleSignupSubmit: (e) => handleSignupSubmit(app, e),
        handleCreateSchoolSubmit: (e) => handleCreateSchoolSubmit(app, e),

        // User Management
        openUserModal: (userId = null) => openUserModal(app, userId),
        handleUserFormSubmit: (e) => handleUserFormSubmit(app, e),
        deleteUser: (userId) => deleteUser(app, userId),
        openUserCsvImportModal: () => openUserCsvImportModal(app),
        handleUserCsvImport: (e) => handleUserCsvImport(app, e),
        
        // Academics
        openCourseModal: (courseId = null, event) => openCourseModal(app, courseId, event),
        handleCourseFormSubmit: (e) => handleCourseFormSubmit(app, e),
        deleteCourse: (courseId, event) => deleteCourse(app, courseId, event),
        handleAnnouncementSubmit: (e, courseId) => handleAnnouncementSubmit(app, e, courseId),
        openAssignmentModal: (assignmentId, courseId) => openAssignmentModal(app, assignmentId, courseId),
        handleAssignmentFormSubmit: (e) => handleAssignmentFormSubmit(app, e),
        deleteAssignment: (assignmentId) => deleteAssignment(app, assignmentId),
        updateGrade: (element, studentId, assignmentId, courseId, score, gradeId) => updateGrade(app, element, studentId, assignmentId, courseId, score, gradeId),
        
        // Attendance & Schedule
        handleAttendanceNoteSubmit: (e) => handleAttendanceNoteSubmit(app, e),
        handleAttendanceSubmit: (courseId, date, attendanceId) => handleAttendanceSubmit(app, courseId, date, attendanceId),
        handleScheduleFormSubmit: (e, studentId) => handleScheduleFormSubmit(app, e, studentId),
        openPrintableScheduleModal: (studentId) => openPrintableScheduleModal(app, studentId),
        
        // Profile
        handleProfileUpdate: (e) => handleProfileUpdate(app, e),
        
        // Homework
        openHomeworkModal: (assignmentId) => openHomeworkModal(app, assignmentId),
        handleHomeworkFileUpload: (e, assignmentId) => handleHomeworkFileUpload(app, e, assignmentId),
        handleSubmissionGradeForm: (e, submissionId) => handleSubmissionGradeForm(app, e, submissionId),

        // Settings
        handleGeneralSettingsSubmit: (e) => handleGeneralSettingsSubmit(app, e),
        handleBrandingSettingsSubmit: (e) => handleBrandingSettingsSubmit(app, e),
        openDayTypeModal: (dayTypeId = null) => openDayTypeModal(app, dayTypeId),
        handleDayTypeSubmit: (e) => handleDayTypeSubmit(app, e),
        deleteDayType: (id) => deleteDayType(app, id),
        duplicateDayType: (dayTypeId) => duplicateDayType(app, dayTypeId),
        openTimeBlockModal: (blockId = null, dayTypeId) => openTimeBlockModal(app, blockId, dayTypeId),
        handleTimeBlockSubmit: (e) => handleTimeBlockSubmit(app, e),
        deleteTimeBlock: (id) => deleteTimeBlock(app, id),
        openMasterCalendarModal: (date, entryId = null) => openMasterCalendarModal(app, date, entryId),
        handleMasterCalendarSubmit: (e) => handleMasterCalendarSubmit(app, e),
        handleMasterCalendarDelete: (id) => handleMasterCalendarDelete(app, id),
        openTuitionItemModal: (itemId = null) => openTuitionItemModal(app, itemId),
        handleTuitionItemSubmit: (e) => handleTuitionItemSubmit(app, e),
        deleteTuitionItem: (id) => deleteTuitionItem(app, id),
        openLaunchpadLinkModal: (linkId = null) => openLaunchpadLinkModal(app, linkId),
        handleLaunchpadLinkSubmit: (e) => handleLaunchpadLinkSubmit(app, e),
        deleteLaunchpadLink: (id) => deleteLaunchpadLink(app, id),
        
        // Report Cards
        openGradingPeriodModal: (periodId=null) => openGradingPeriodModal(app, periodId),
        handleGradingPeriodSubmit: (e) => handleGradingPeriodSubmit(app, e),
        deleteGradingPeriod: (id) => deleteGradingPeriod(app, id),
        handleReportCardTemplateSave: () => handleReportCardTemplateSave(app),
        deleteReportCard: (rcId) => deleteReportCard(app, rcId),
        generateReportCardsForPeriod: (periodId) => generateReportCardsForPeriod(app, periodId),
        openReportCardModal: (rcId) => openReportCardModal(app, rcId),
        
        // Reports & PDF
        generatePdfFromHtml: (elementId, pdfTitle) => generatePdfFromHtml(app, elementId, pdfTitle),
        openPaymentModal: () => openPaymentModal(app),
        openParentStatementModal: (parentId = null) => openParentStatementModal(app, parentId),

        // Version 2.0 Handlers
        handleGenerateLessonPlan: (e) => handleGenerateLessonPlan(app, e),
        handleGenerateQuizQuestions: (e) => handleGenerateQuizQuestions(app, e),
        openQuizModal: (courseId, quizId = null) => openQuizModal(app, courseId, quizId),
        handleQuizFormSubmit: (e, courseId, quizId) => handleQuizFormSubmit(app, e, courseId, quizId),
        deleteQuiz: (quizId) => deleteQuiz(app, quizId),
        handleQuizQuestionSubmit: (e, quizId) => handleQuizQuestionSubmit(app, e, quizId),
        deleteQuizQuestion: (quizId, questionId) => deleteQuizQuestion(app, quizId, questionId),
        addAiQuestionToQuiz: (quizId, questionIndex) => addAiQuestionToQuiz(app, quizId, questionIndex),
        handleQuizSubmission: (e, quizId) => handleQuizSubmission(app, e, quizId),
        handleGradeShortAnswer: (e, submissionId, questionId) => handleGradeShortAnswer(app, e, submissionId, questionId),
        
        // Generic
        closeModal: closeModal,
    };
    
    Object.assign(window, handlers);
    
    document.getElementById('modal-template')?.addEventListener('click', (e) => {
        if (e.target === e.currentTarget) closeModal();
    });
    document.getElementById('modal-close-btn')?.addEventListener('click', () => closeModal());
}

// --- AUTH HANDLERS ---
export async function handleLoginSubmit(app, e) {
    e.preventDefault();
    const elements = e.target.elements;
    const email = elements.namedItem('email').value;
    const password = elements.namedItem('password').value;
    try {
        await signInWithEmailAndPassword(app.auth, email, password);
    } catch (err) { showToast(`Login failed: ${err.message}`, 'error'); }
}

export function handleGoogleLogin(app) {
    const provider = new GoogleAuthProvider();
    signInWithPopup(app.auth, provider).catch(err => showToast(`Login failed: ${err.message}`, 'error'));
}

export async function handleSignupSubmit(app, e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = "Signing Up...";

    try {
        const userCredential = await createUserWithEmailAndPassword(app.auth, data.email, data.password);
        await updateProfile(userCredential.user, { displayName: data.displayName });
        showToast('Account created! Checking for invitation...', 'success');
    } catch(err) {
        showToast(`Signup failed: ${err.message}`, 'error');
        submitBtn.disabled = false;
        submitBtn.innerHTML = "Sign Up";
    }
}

export async function handleCreateSchoolSubmit(app, e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    let user = app.auth.currentUser;
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<div class="loader !w-6 !h-6 !border-2 !border-t-white mr-2"></div> Creating...`;
    
    try {
        if (!user || user.email !== data.email) {
            if (user) await signOut(app.auth); // Sign out previous user if emails don't match
            const userCredential = await createUserWithEmailAndPassword(app.auth, data.email, data.password);
            user = userCredential.user;
        }
        await updateProfile(user, { displayName: data.displayName });

        const schoolRef = await addDoc(collection(app.db, 'schools'), { 
            name: data.schoolName, 
            theme: 'sky', 
            logoUrl: '', 
            faviconUrl: '',
            customCss: '',
            createdAt: serverTimestamp() 
        });

        await setDoc(doc(app.db, 'schools', schoolRef.id, 'users', user.uid), { 
            uid: user.uid, 
            displayName: data.displayName, 
            email: data.email, 
            role: 'admin', 
            isPlaceholder: false, 
            createdAt: serverTimestamp() 
        });
        
        showToast('School created successfully! You are now logged in.', 'success');
    } catch (error) {
        console.error("Error creating school:", error);
        showToast(`Could not create school: ${error.message}`, 'error');
        submitBtn.disabled = false; submitBtn.textContent = 'Create School & Account';
    }
}


// --- USER MANAGEMENT ---

export function openUserModal(app, userId = null) {
    const { state } = app;
    const user = userId ? state.allUsers.find(u => u.id === userId) : null;
    const title = user ? `Edit User: ${user.displayName}` : 'Add New User';
    
    const studentOptions = state.students.map(s => `<option value="${s.id}" ${user?.childrenIds?.includes(s.id) ? 'selected' : ''}>${s.displayName}</option>`).join('');
    const parentFields = `<div id="parent-fields" class="${user?.role === 'parent' ? '' : 'hidden'} mt-4">
        <label class="block font-semibold mb-1">Assigned Children (Ctrl/Cmd to select multiple)</label>
        <select name="childrenIds" multiple class="w-full p-2 border rounded-lg h-32">${studentOptions}</select>
    </div>`;

    const body = `<form id="user-form">
        <input type="hidden" name="id" value="${user?.id||''}">
        <label class="block font-semibold mb-1">Full Name</label>
        <input type="text" name="displayName" value="${user?.displayName||''}" class="w-full p-2 border rounded-lg mb-4" required>
        <label class="block font-semibold mb-1">Email</label>
        <input type="email" name="email" value="${user?.email||''}" class="w-full p-2 border rounded-lg mb-4" ${user ? 'readonly' : 'required'}>
        <label class="block font-semibold mb-1">Role</label>
        <select id="role-select" name="role" class="w-full p-2 border rounded-lg mb-2" required>
            <option value="student" ${user?.role==='student'?'selected':''}>Student</option>
            <option value="teacher" ${user?.role==='teacher'?'selected':''}>Teacher</option>
            <option value="parent" ${user?.role==='parent'?'selected':''}>Parent</option>
            <option value="admin" ${user?.role==='admin'?'selected':''}>Admin</option>
        </select>
        ${parentFields}
        <button type="submit" class="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 mt-6">Save</button>
    </form>`;
    openModal(title, body);
    document.getElementById('role-select').onchange = (e) => {
        const parentFieldsEl = document.getElementById('parent-fields');
        if (parentFieldsEl) parentFieldsEl.classList.toggle('hidden', e.target.value !== 'parent');
    };
    document.getElementById('user-form').addEventListener('submit', (e) => handleUserFormSubmit(app, e)); 
}

export async function handleUserFormSubmit(app, e) {
    e.preventDefault();
    const { state, db } = app;
    const form = e.target;
    const formData = new FormData(form);
    
    const childrenIds = formData.getAll('childrenIds');

    const data = {};
    formData.forEach((value, key) => {
        if (key !== 'childrenIds') {
            data[key] = value;
        }
    });
    if (data.role === 'parent') {
        data.childrenIds = childrenIds;
    }

    try {
        if (data.id) { // Editing existing user
            const userId = data.id;
            delete data.id; 
            await updateDoc(doc(db, 'schools', state.school.id, 'users', userId), data);
            showToast('User updated successfully!', 'success');
        } else { // Adding new user (as placeholder)
            const newUser = {
                ...data,
                isPlaceholder: true,
                createdAt: serverTimestamp()
            };
            await addDoc(collection(db, 'schools', state.school.id, 'users'), newUser);
            showToast('Invitation created! The user will be prompted to sign up.', 'success');
        }
        closeModal();
    } catch (err) {
        showToast(`Error saving user: ${err.message}`, 'error');
    }
}

export async function deleteUser(app, userId) {
    if (confirm('Are you sure you want to delete this user? This cannot be undone.')) {
        try {
            await deleteDoc(doc(app.db, 'schools', app.state.school.id, 'users', userId));
            showToast('User deleted successfully.', 'success');
        } catch (err) {
            showToast(`Error deleting user: ${err.message}`, 'error');
        }
    }
}

export function openUserCsvImportModal(app) {
    const title = 'Import Users from CSV';
    const body = `
        <form id="user-csv-form">
            <p class="mb-4 text-slate-600">Upload a CSV file with the columns: <strong>displayName, email, role</strong>. The role must be one of 'student', 'teacher', 'parent', or 'admin'.</p>
            <a href="data:text/csv;charset=utf-8,displayName%2Cemail%2Crole%0AJohn%20Student%2Cjohn.student%40example.com%2Cstudent%0AJane%20Teacher%2Cjane.teacher%40example.com%2Cteacher" download="user_template.csv" class="text-primary-600 hover:underline mb-4 block">Download Template CSV</a>
            <input type="file" name="csvFile" accept=".csv" class="w-full p-2 border rounded-lg" required>
            <button type="submit" class="w-full mt-6 bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700">Import Users</button>
        </form>
    `;
    openModal(title, body);
    document.getElementById('user-csv-form').addEventListener('submit', (e) => handleUserCsvImport(app, e));
}

export async function handleUserCsvImport(app, e) {
    e.preventDefault();
    const file = e.target.elements.csvFile.files[0];
    if (!file) {
        showToast('Please select a CSV file.', 'error');
        return;
    }

    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Importing...';

    Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
            const users = results.data;
            const requiredHeaders = ['displayName', 'email', 'role'];
            const actualHeaders = results.meta.fields;
            
            if (!requiredHeaders.every(h => actualHeaders.includes(h))) {
                showToast('CSV headers must be: displayName, email, role.', 'error');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Import Users';
                return;
            }

            const batch = writeBatch(app.db);
            let importedCount = 0;

            for (const user of users) {
                const displayName = user.displayName?.trim();
                const email = user.email?.trim().toLowerCase();
                const role = user.role?.trim().toLowerCase();
                
                if (displayName && email && ['student', 'teacher', 'parent', 'admin'].includes(role)) {
                    const newUserRef = doc(collection(app.db, 'schools', app.state.school.id, 'users'));
                    batch.set(newUserRef, {
                        displayName,
                        email,
                        role,
                        isPlaceholder: true,
                        createdAt: serverTimestamp()
                    });
                    importedCount++;
                }
            }

            try {
                await batch.commit();
                showToast(`${importedCount} users imported successfully as invitations.`, 'success');
                closeModal();
            } catch (err) {
                showToast(`Error importing users: ${err.message}`, 'error');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Import Users';
            }
        },
        error: (err) => {
            showToast(`CSV parsing error: ${err.message}`, 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Import Users';
        }
    });
}


// --- DASHBOARD HANDLERS ---
export async function handleAttendanceNoteSubmit(app, e) {
    e.preventDefault();
    const { state, db } = app;
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    try {
        await addDoc(collection(db, 'schools', state.school.id, 'attendanceNotes'), {
            ...data,
            parentId: state.user.id,
            submittedAt: serverTimestamp()
        });
        showToast('Attendance note submitted successfully!', 'success');
        form.reset();
    } catch(err) {
        showToast(`Error submitting note: ${err.message}`, 'error');
    }
}


// --- COURSE & ASSIGNMENT HANDLERS ---
export function openCourseModal(app, courseId = null, event = null) {
    event?.stopPropagation();
    const { state } = app;
    const course = courseId ? state.courses.find(c => c.id === courseId) : null;
    const title = course ? 'Edit Course' : 'Add New Course';
    const teacherOptions = state.teachers.map(t => `<option value="${t.id}" ${course?.teacherId === t.id ? 'selected' : ''}>${t.displayName}</option>`).join('');
    const body = `<form id="course-form">
        <input type="hidden" name="id" value="${course?.id || ''}">
        <label class="block font-semibold mb-1">Course Name</label>
        <input type="text" name="name" value="${course?.name || ''}" class="w-full p-2 border rounded-lg mb-4" required>
        <label class="block font-semibold mb-1">Teacher</label>
        <select name="teacherId" class="w-full p-2 border rounded-lg mb-2">
            <option value="">-- Not Assigned --</option>
            ${teacherOptions}
        </select>
        <button type="submit" class="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 mt-6">Save Course</button>
    </form>`;
    openModal(title, body);
    document.getElementById('course-form').addEventListener('submit', e => handleCourseFormSubmit(app, e));
}

export async function handleCourseFormSubmit(app, e) {
    e.preventDefault();
    const { state, db } = app;
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    try {
        if (data.id) {
            const courseId = data.id;
            delete data.id;
            await updateDoc(doc(db, 'schools', state.school.id, 'courses', courseId), data);
            showToast('Course updated!', 'success');
        } else {
            await addDoc(collection(db, 'schools', state.school.id, 'courses'), { ...data, createdAt: serverTimestamp() });
            showToast('Course created!', 'success');
        }
        closeModal();
    } catch (err) {
        showToast(`Error saving course: ${err.message}`, 'error');
    }
}

export async function deleteCourse(app, courseId, event) {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this course and all its data (assignments, grades, etc)?')) {
        try {
            await deleteDoc(doc(app.db, 'schools', app.state.school.id, 'courses', courseId));
            // In a real app, you'd also delete associated data in a batch write or cloud function
            showToast('Course deleted.', 'success');
        } catch (err) {
            showToast(`Error deleting course: ${err.message}`, 'error');
        }
    }
}

export async function handleAnnouncementSubmit(app, e, courseId) {
    e.preventDefault();
    const form = e.target;
    const content = form.elements.namedItem('content').value;
    if (!content) return;
    try {
        await addDoc(collection(app.db, 'schools', app.state.school.id, 'announcements'), {
            courseId,
            content,
            authorId: app.state.user.id,
            createdAt: serverTimestamp()
        });
        form.reset();
    } catch (err) {
        showToast(`Error posting announcement: ${err.message}`, 'error');
    }
}

export function openAssignmentModal(app, assignmentId, courseId) {
    const { state } = app;
    const assignment = assignmentId ? state.assignments.find(a => a.id === assignmentId) : null;
    const title = assignment ? 'Edit Assignment' : 'Create Assignment';
    const body = `<form id="assignment-form">
        <input type="hidden" name="id" value="${assignment?.id || ''}">
        <input type="hidden" name="courseId" value="${courseId}">
        <label class="block font-semibold mb-1">Title</label>
        <input type="text" name="title" value="${assignment?.title || ''}" class="w-full p-2 border rounded-lg mb-4" required>
        <label class="block font-semibold mb-1">Type</label>
        <select name="type" class="w-full p-2 border rounded-lg mb-4">
            <option value="classwork" ${assignment?.type === 'classwork' || !assignment?.type ? 'selected' : ''}>Classwork</option>
            <option value="homework" ${assignment?.type === 'homework' ? 'selected' : ''}>Homework</option>
        </select>
        <label class="block font-semibold mb-1">Due Date</label>
        <input type="date" name="dueDate" value="${assignment?.dueDate || ''}" class="w-full p-2 border rounded-lg mb-4" required>
        <label class="block font-semibold mb-1">Max Points</label>
        <input type="number" name="maxPoints" value="${assignment?.maxPoints || ''}" class="w-full p-2 border rounded-lg mb-4" required>
        <button type="submit" class="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 mt-6">Save</button>
    </form>`;
    openModal(title, body);
    document.getElementById('assignment-form').addEventListener('submit', (e) => handleAssignmentFormSubmit(app, e));
}

export async function handleAssignmentFormSubmit(app, e) {
    e.preventDefault();
    const { state, db } = app;
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    try {
        if (data.id) {
            const assignmentId = data.id;
            delete data.id;
            await updateDoc(doc(db, 'schools', state.school.id, 'assignments', assignmentId), data);
            showToast('Assignment updated!', 'success');
        } else {
            await addDoc(collection(db, 'schools', state.school.id, 'assignments'), { ...data, createdAt: serverTimestamp() });
            showToast('Assignment created!', 'success');
        }
        closeModal();
    } catch (err) { showToast(`Error saving assignment: ${err.message}`, 'error'); }
}

export async function deleteAssignment(app, assignmentId) {
    if (confirm('Delete this assignment? All associated grades will also be removed.')) {
        try {
            await deleteDoc(doc(app.db, 'schools', app.state.school.id, 'assignments', assignmentId));
            showToast('Assignment deleted.', 'success');
        } catch (err) { showToast(`Error: ${err.message}`, 'error'); }
    }
}


// --- GRADEBOOK & ATTENDANCE ---

export async function updateGrade(app, element, studentId, assignmentId, courseId, score, gradeId) {
    const { state, db } = app;
    const scoreValue = score === '' ? null : Number(score);
    try {
        const gradeData = { studentId, assignmentId, courseId, score: scoreValue, updatedAt: serverTimestamp() };
        if (gradeId && gradeId !== 'undefined' && gradeId !== 'null') {
            await updateDoc(doc(db, 'schools', state.school.id, 'grades', gradeId), gradeData);
        } else {
            const newDocRef = doc(collection(db, 'schools', state.school.id, 'grades'));
            await setDoc(newDocRef, gradeData);
            element.setAttribute('onchange', `window.updateGrade(this, '${studentId}', '${assignmentId}', '${courseId}', this.value, '${newDocRef.id}')`);
        }
    } catch (err) {
        showToast(`Error saving grade: ${err.message}`, 'error');
    }
}


export async function handleAttendanceSubmit(app, courseId, date, attendanceId) {
    const { state, db } = app;
    const form = document.getElementById('attendance-form');
    const formData = new FormData(form);
    const statuses = {};
    for (const [studentId, status] of formData.entries()) {
        statuses[studentId] = status;
    }
    try {
        const attendanceData = { courseId, date, statuses };
        if (attendanceId) {
            await updateDoc(doc(db, 'schools', state.school.id, 'attendance', attendanceId), attendanceData);
        } else {
            await addDoc(collection(db, 'schools', state.school.id, 'attendance'), attendanceData);
        }
        showToast('Attendance saved!', 'success');
    } catch (err) {
        showToast(`Error saving attendance: ${err.message}`, 'error');
    }
}

// --- SCHEDULE ---
export async function handleScheduleFormSubmit(app, e, studentId) {
    e.preventDefault();
    const { state, db } = app;
    const formData = new FormData(e.target);
    const schedule = {};
    formData.forEach((courseId, timeBlockId) => {
        schedule[timeBlockId] = courseId;
    });

    try {
        const scheduleQuery = query(collection(db, 'schools', state.school.id, 'schedules'), where('studentId', '==', studentId));
        const snapshot = await getDocs(scheduleQuery);
        if (snapshot.empty) {
            await addDoc(collection(db, 'schools', state.school.id, 'schedules'), { studentId, schedule });
        } else {
            const docId = snapshot.docs[0].id;
            await updateDoc(doc(db, 'schools', state.school.id, 'schedules', docId), { schedule });
        }
        showToast('Schedule saved successfully!', 'success');
    } catch (err) {
        showToast(`Error saving schedule: ${err.message}`, 'error');
    }
}

// --- PROFILE ---
export async function handleProfileUpdate(app, e) {
    e.preventDefault();
    const { state, db, auth } = app;
    const newDisplayName = e.target.elements.namedItem('displayName').value;
    if (newDisplayName === state.user.displayName) return;
    try {
        await updateDoc(doc(db, 'schools', state.school.id, 'users', state.user.id), { displayName: newDisplayName });
        if (auth.currentUser && auth.currentUser.displayName !== newDisplayName) {
            await updateProfile(auth.currentUser, { displayName: newDisplayName });
        }
        showToast('Profile updated!', 'success');
    } catch (err) {
        showToast(`Error updating profile: ${err.message}`, 'error');
    }
}


// --- SETTINGS ---
export async function handleGeneralSettingsSubmit(app, e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    try {
        await updateDoc(doc(app.db, 'schools', app.state.school.id), data);
        showToast('Settings updated!', 'success');
    } catch (err) { showToast(`Error: ${err.message}`, 'error'); }
}

export function openDayTypeModal(app, dayTypeId = null) {
    const dt = dayTypeId ? app.state.dayTypes.find(d => d.id === dayTypeId) : null;
    const body = `<form id="day-type-form">
        <input type="hidden" name="id" value="${dt?.id || ''}">
        <label class="block font-semibold">Day Type Name</label>
        <input type="text" name="name" value="${dt?.name || ''}" class="w-full p-2 border rounded-lg mt-1" required>
        <button type="submit" class="w-full mt-4 bg-primary-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-600">Save</button>
    </form>`;
    openModal(dt ? 'Edit Day Type' : 'New Day Type', body, 'sm');
    document.getElementById('day-type-form').addEventListener('submit', (e) => handleDayTypeSubmit(app, e));
}

export async function handleDayTypeSubmit(app, e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    try {
        if(data.id) {
            await updateDoc(doc(app.db, 'schools', app.state.school.id, 'dayTypes', data.id), { name: data.name });
        } else {
            await addDoc(collection(app.db, 'schools', app.state.school.id, 'dayTypes'), { name: data.name });
        }
        closeModal();
    } catch(err) { showToast(`Error: ${err.message}`, 'error'); }
}

export async function deleteDayType(app, id) { if(confirm('Delete this day type? All time blocks will also be removed.')) { try { await deleteDoc(doc(app.db, 'schools', app.state.school.id, 'dayTypes', id)); showToast('Deleted.', 'success'); } catch(e){showToast(`Error: ${e.message}`,'error')} } }
export async function duplicateDayType(app, dayTypeId) {
    const dayType = app.state.dayTypes.find(dt => dt.id === dayTypeId);
    const timeBlocks = app.state.timeBlocks.filter(tb => tb.dayTypeId === dayTypeId);
    if (!dayType) return;
    try {
        const newDayTypeRef = await addDoc(collection(app.db, 'schools', app.state.school.id, 'dayTypes'), { name: `${dayType.name} (Copy)` });
        const batch = writeBatch(app.db);
        timeBlocks.forEach(tb => {
            const newTimeBlockRef = doc(collection(app.db, 'schools', app.state.school.id, 'timeBlocks'));
            const { id, ...tbData } = tb;
            batch.set(newTimeBlockRef, { ...tbData, dayTypeId: newDayTypeRef.id });
        });
        await batch.commit();
        showToast('Day type duplicated!', 'success');
    } catch (e) { showToast(`Error: ${e.message}`, 'error'); }
}

export function openTimeBlockModal(app, blockId = null, dayTypeId) {
    const tb = blockId ? app.state.timeBlocks.find(t => t.id === blockId) : null;
    const body = `<form id="time-block-form">
        <input type="hidden" name="id" value="${tb?.id || ''}"><input type="hidden" name="dayTypeId" value="${dayTypeId}">
        <div class="grid grid-cols-2 gap-4">
            <div><label class="font-semibold">Start Time</label><input type="time" name="startTime" value="${tb?.startTime || ''}" class="w-full p-2 border rounded mt-1" required></div>
            <div><label class="font-semibold">End Time</label><input type="time" name="endTime" value="${tb?.endTime || ''}" class="w-full p-2 border rounded mt-1" required></div>
        </div>
        <label class="font-semibold mt-4 block">Block Name</label>
        <input type="text" name="name" value="${tb?.name || ''}" class="w-full p-2 border rounded mt-1" required>
        <button type="submit" class="w-full mt-4 bg-primary-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-600">Save</button>
    </form>`;
    openModal(tb ? 'Edit Time Block' : 'New Time Block', body, 'md');
    document.getElementById('time-block-form').addEventListener('submit', (e) => handleTimeBlockSubmit(app, e));
}

export async function handleTimeBlockSubmit(app, e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    try {
        if(data.id) {
            await updateDoc(doc(app.db, 'schools', app.state.school.id, 'timeBlocks', data.id), data);
        } else {
            await addDoc(collection(app.db, 'schools', app.state.school.id, 'timeBlocks'), data);
        }
        closeModal();
    } catch(err) { showToast(`Error: ${err.message}`, 'error'); }
}

export async function deleteTimeBlock(app, id) { if(confirm('Delete this time block?')) { try { await deleteDoc(doc(app.db, 'schools', app.state.school.id, 'timeBlocks', id)); } catch(e){showToast(`Error: ${e.message}`,'error')} } }

export function openMasterCalendarModal(app, date, entryId = null) {
    const entry = entryId ? app.state.masterCalendar.find(e => e.id === entryId) : null;
    const dayTypeOptions = app.state.dayTypes.map(dt => `<option value="${dt.id}" ${entry?.dayTypeId === dt.id ? 'selected' : ''}>${dt.name}</option>`).join('');
    const body = `<form id="master-calendar-form">
        <input type="hidden" name="id" value="${entry?.id || ''}">
        <input type="hidden" name="date" value="${date}">
        <h3 class="text-lg font-bold mb-2">${new Date(date + 'T00:00:00').toDateString()}</h3>
        <label class="font-semibold">Day Type</label>
        <select name="dayTypeId" class="w-full p-2 border rounded mt-1">${dayTypeOptions}</select>
        <div class="flex justify-between mt-4">
            ${entryId ? `<button type="button" onclick="window.handleMasterCalendarDelete('${entryId}')" class="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700">Delete</button>` : '<div></div>'}
            <button type="submit" class="bg-primary-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-600">Save</button>
        </div>
    </form>`;
    openModal('Edit Master Calendar Day', body, 'sm');
    document.getElementById('master-calendar-form').addEventListener('submit', e => handleMasterCalendarSubmit(app, e));
}

export async function handleMasterCalendarSubmit(app, e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    try {
        const q = query(collection(app.db, 'schools', app.state.school.id, 'masterCalendar'), where('date', '==', data.date));
        const snap = await getDocs(q);
        if (!snap.empty) {
            await updateDoc(snap.docs[0].ref, { dayTypeId: data.dayTypeId });
        } else {
            await addDoc(collection(app.db, 'schools', app.state.school.id, 'masterCalendar'), data);
        }
        closeModal();
    } catch (err) { showToast(`Error: ${err.message}`, 'error'); }
}

export async function handleMasterCalendarDelete(app, id) {
    if(confirm('Remove this day type assignment?')) {
        try {
            await deleteDoc(doc(app.db, 'schools', app.state.school.id, 'masterCalendar', id));
            closeModal();
        } catch (err) { showToast(`Error: ${err.message}`, 'error'); }
    }
}

export function openTuitionItemModal(app, itemId = null) {
    const item = itemId ? app.state.tuitionItems.find(i => i.id === itemId) : null;
    const studentOptions = app.state.students.map(s => `<option value="${s.id}" ${item?.studentId === s.id ? 'selected' : ''}>${s.displayName}</option>`).join('');
    const body = `<form id="tuition-item-form">
        <input type="hidden" name="id" value="${item?.id || ''}">
        <label class="font-semibold">Student</label><select name="studentId" class="w-full p-2 border rounded mt-1 mb-4" required>${studentOptions}</select>
        <label class="font-semibold">Description</label><input type="text" name="description" value="${item?.description || ''}" class="w-full p-2 border rounded mt-1 mb-4" required>
        <label class="font-semibold">Amount ($)</label><input type="number" step="0.01" name="amount" value="${item?.amount || ''}" class="w-full p-2 border rounded mt-1 mb-4" required>
        <button type="submit" class="w-full mt-2 bg-primary-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-600">Save</button>
    </form>`;
    openModal(item ? 'Edit Item' : 'New Tuition Item', body);
    document.getElementById('tuition-item-form').addEventListener('submit', e => handleTuitionItemSubmit(app, e));
}

export async function handleTuitionItemSubmit(app, e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    try {
        if(data.id) { await updateDoc(doc(app.db, 'schools', app.state.school.id, 'tuitionItems', data.id), data); }
        else { await addDoc(collection(app.db, 'schools', app.state.school.id, 'tuitionItems'), data); }
        closeModal();
    } catch(err) { showToast(`Error: ${err.message}`, 'error'); }
}

export async function deleteTuitionItem(app, id) { if(confirm('Delete this item?')) { try { await deleteDoc(doc(app.db, 'schools', app.state.school.id, 'tuitionItems', id)); } catch(e) {showToast(`Error: ${e.message}`, 'error')} } }

export function openLaunchpadLinkModal(app, linkId = null) {
    const link = linkId ? app.state.launchpadLinks.find(l => l.id === linkId) : null;
    const body = `<form id="launchpad-form">
        <input type="hidden" name="id" value="${link?.id || ''}">
        <label class="font-semibold">Link Name</label><input type="text" name="name" value="${link?.name || ''}" class="w-full p-2 border rounded mt-1 mb-4" required>
        <label class="font-semibold">URL</label><input type="url" name="url" value="${link?.url || ''}" placeholder="https://..." class="w-full p-2 border rounded mt-1 mb-4" required>
        <button type="submit" class="w-full mt-2 bg-primary-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-600">Save</button>
    </form>`;
    openModal(link ? 'Edit Link' : 'New Launchpad Link', body);
    document.getElementById('launchpad-form').addEventListener('submit', e => handleLaunchpadLinkSubmit(app, e));
}

export async function handleLaunchpadLinkSubmit(app, e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    try {
        if(data.id) { await updateDoc(doc(app.db, 'schools', app.state.school.id, 'launchpadLinks', data.id), data); }
        else { await addDoc(collection(app.db, 'schools', app.state.school.id, 'launchpadLinks'), data); }
        closeModal();
    } catch(err) { showToast(`Error: ${err.message}`, 'error'); }
}

export async function deleteLaunchpadLink(app, id) { if(confirm('Delete this link?')) { try { await deleteDoc(doc(app.db, 'schools', app.state.school.id, 'launchpadLinks', id)); } catch(e) {showToast(`Error: ${e.message}`, 'error')} } }

// REPORT CARD HANDLERS
export function openGradingPeriodModal(app, periodId=null) {
    const period = periodId ? app.state.gradingPeriods.find(p => p.id === periodId) : null;
    const body = `<form id="grading-period-form">
        <input type="hidden" name="id" value="${period?.id || ''}">
        <label class="font-semibold">Period Name</label><input type="text" name="name" value="${period?.name || ''}" class="w-full p-2 border rounded mt-1 mb-4" required>
        <label class="font-semibold">Start Date</label><input type="date" name="startDate" value="${period?.startDate || ''}" class="w-full p-2 border rounded mt-1 mb-4" required>
        <label class="font-semibold">End Date</label><input type="date" name="endDate" value="${period?.endDate || ''}" class="w-full p-2 border rounded mt-1 mb-4" required>
        <button type="submit" class="w-full mt-2 bg-primary-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-600">Save</button>
    </form>`;
    openModal(period ? 'Edit Period' : 'New Grading Period', body);
    document.getElementById('grading-period-form').addEventListener('submit', e => handleGradingPeriodSubmit(app, e));
}
export async function handleGradingPeriodSubmit(app, e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    try {
        if(data.id) { await updateDoc(doc(app.db, 'schools', app.state.school.id, 'gradingPeriods', data.id), data); }
        else { await addDoc(collection(app.db, 'schools', app.state.school.id, 'gradingPeriods'), data); }
        closeModal();
    } catch(err) { showToast(`Error: ${err.message}`, 'error'); }
}
export async function deleteGradingPeriod(app, id) { if(confirm('Delete this period?')) { try { await deleteDoc(doc(app.db, 'schools', app.state.school.id, 'gradingPeriods', id)); } catch(e) {showToast(`Error: ${e.message}`, 'error')} } }

export async function handleReportCardTemplateSave(app) {
    const { state, db } = app;
    const canvas = document.getElementById('rc-canvas');
    if (!canvas) { showToast('Canvas not found.', 'error'); return; }

    const layout = Array.from(canvas.children)
        .filter(el => el.dataset.type)
        .map(el => ({ type: el.dataset.type }));

    const templateData = { layout };

    try {
        if (state.reportCardTemplates.length > 0) {
            await updateDoc(doc(db, 'schools', state.school.id, 'reportCardTemplates', state.reportCardTemplates[0].id), templateData);
        } else {
            await addDoc(collection(db, 'schools', state.school.id, 'reportCardTemplates'), templateData);
        }
        showToast('Template saved successfully!', 'success');
    } catch (err) { 
        showToast(`Error saving template: ${err.message}`, 'error'); 
    }
}

export async function generateReportCardsForPeriod(app, periodId) {
    const btn = document.getElementById(`generate-rc-btn-${periodId}`);
    if (btn) { btn.disabled = true; btn.innerHTML = '...'; }

    const { state, db } = app;
    const period = state.gradingPeriods.find(p => p.id === periodId);
    if (!period) {
        showToast('Grading period not found.', 'error');
        if (btn) { btn.disabled = false; btn.innerHTML = 'Generate'; }
        return;
    }

    const template = state.reportCardTemplates[0] || {};
    const layout = template.layout || [
        { type: 'schoolHeader' }, { type: 'studentInfo' }, { type: 'gradesTable' }, { type: 'attendanceSummary' }
    ];
    const batch = writeBatch(db);

    for (const student of state.students) {
        const studentData = {};
        
        const enrolledCourses = state.courses.filter(c => app.getEnrolledStudentIds(c.id).includes(student.id));
        const coursesData = enrolledCourses.map(course => {
            const assignments = state.assignments.filter(a => a.courseId === course.id && new Date(a.dueDate) >= new Date(period.startDate) && new Date(a.dueDate) <= new Date(period.endDate));
            
            let totalScore = 0;
            let totalMaxPoints = 0;
            
            const grades = assignments.map(a => {
                const grade = state.grades.find(g => g.studentId === student.id && g.assignmentId === a.id);
                const score = grade?.score ?? null;
                const maxPoints = a.maxPoints ? Number(a.maxPoints) : 0;
                
                if (score != null && maxPoints > 0) { // Use != null to include 0 scores
                    totalScore += Number(score);
                    totalMaxPoints += maxPoints;
                }
                
                return { title: a.title, score: score, maxPoints: maxPoints };
            });
            
            const finalGradePercent = totalMaxPoints > 0 ? (totalScore / totalMaxPoints) * 100 : null;
            let finalLetterGrade = 'N/A';
            if (finalGradePercent !== null) {
                if (finalGradePercent >= 90) finalLetterGrade = 'A';
                else if (finalGradePercent >= 80) finalLetterGrade = 'B';
                else if (finalGradePercent >= 70) finalLetterGrade = 'C';
                else if (finalGradePercent >= 60) finalLetterGrade = 'D';
                else finalLetterGrade = 'F';
            }

            return { name: course.name, grades, finalGradePercent, finalLetterGrade };
        });
        studentData.courses = coursesData;

        // This component-based data aggregation is flexible.
        for (const component of layout) {
            if (component.type === 'attendanceSummary') {
                let absentCount = 0; let tardyCount = 0;
                state.attendance.forEach(record => {
                    const status = record.statuses[student.id];
                    if (status === 'absent') absentCount++; if (status === 'tardy') tardyCount++;
                });
                studentData.attendance = { absent: absentCount, tardy: tardyCount };
            }
        }

        const rcRef = doc(collection(db, 'schools', state.school.id, 'generatedReportCards'));
        batch.set(rcRef, {
            studentId: student.id,
            studentName: student.displayName,
            periodId: period.id,
            periodName: period.name,
            generatedAt: serverTimestamp(),
            data: studentData,
            templateLayout: layout 
        });
    }
    try {
        await batch.commit();
        showToast(`${state.students.length} report cards generated!`, 'success');
    } catch (err) {
        showToast(`Error generating report cards: ${err.message}`, 'error');
    } finally {
        if (btn) { btn.disabled = false; btn.innerHTML = 'Generate'; }
    }
}


export async function deleteReportCard(app, rcId) {
    if(confirm('Delete this report card?')) {
        try {
            await deleteDoc(doc(app.db, 'schools', app.state.school.id, 'generatedReportCards', rcId));
            showToast('Deleted.', 'success');
        } catch(e) { showToast(`Error: ${e.message}`, 'error'); }
    }
}

export function openReportCardModal(app, rcId) {
    const rc = app.state.generatedReportCards.find(r => r.id === rcId);
    if (!rc) { showToast('Report card not found.', 'error'); return; }
    const title = `Report Card for ${rc.studentName}`;
    const body = `<div class="flex justify-end mb-4"><button onclick="window.generatePdfFromHtml('printable-report-card', 'Report Card - ${rc.studentName}')" class="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600">Download PDF</button></div>${renderReportCardModalContent(app, rc)}`;
    openModal(title, body, '2xl');
}


export function openParentStatementModal(app, parentId = null) {
    const parent = parentId ? app.state.allUsers.find(u => u.id === parentId) : app.state.user;
    if (!parent) return;
    const title = `Tuition Statement for ${parent.displayName}`;
    const body = `<div class="flex justify-end mb-4"><button onclick="window.generatePdfFromHtml('printable-statement', 'Tuition Statement - ${parent.displayName}')" class="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600">Download PDF</button></div>${renderParentStatementModalContent(app, parent)}`;
    openModal(title, body, '2xl');
}

export function openPrintableScheduleModal(app, studentId) {
    const student = app.state.students.find(s => s.id === studentId);
    if (!student) return;
    const title = `Printable Schedule for ${student.displayName}`;
    const body = `<div class="flex justify-end mb-4"><button onclick="window.generatePdfFromHtml('printable-schedule-content-wrapper', 'Schedule - ${student.displayName}')" class="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600">Download PDF</button></div><div id="printable-schedule-content-wrapper"><div id="printable-schedule-content" class="printable-report"></div></div>`;
    openModal(title, body, '4xl');
    renderPrintableSchedule(app, studentId);
}

export function openPaymentModal(app) {
    const body = `<div class="text-center p-8"><h3 class="text-xl font-bold mb-4">Online Payments</h3><p class="text-slate-600">This feature is a demonstration. In a real application, this would integrate with a payment processor like Stripe.</p><div class="mt-6"><label class="block font-semibold text-left">Card Number</label><input type="text" placeholder="&bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; 1234" class="w-full p-2 border rounded-lg mt-1 bg-slate-100" disabled><div class="grid grid-cols-2 gap-4 mt-4"><input type="text" placeholder="MM/YY" class="p-2 border rounded-lg bg-slate-100" disabled><input type="text" placeholder="CVC" class="p-2 border rounded-lg bg-slate-100" disabled></div><button class="w-full mt-4 bg-slate-300 text-white font-bold py-3 px-4 rounded-lg cursor-not-allowed">Pay Now</button></div></div>`;
    openModal('Make a Payment', body, 'md');
}


// --- UTILITY HANDLERS ---
export function generatePdfFromHtml(app, elementId, pdfTitle) {
    // This function now uses the more robust `pdf.html()` method which handles scaling and pagination automatically.
    // This fixes issues with content appearing "zoomed in", blurry, or splitting incorrectly across pages.
    const { jsPDF } = jspdf;
    const source = document.getElementById(elementId);

    if (!source) {
        console.error('Element not found for PDF generation:', elementId);
        showToast('Could not find element to print.', 'error');
        return;
    }
    showToast('Generating PDF...', 'success');
    
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'letter'
    });

    pdf.html(source, {
        callback: function (doc) {
            doc.save(`${pdfTitle}.pdf`);
        },
        margin: [40, 40, 40, 40], // [top, right, bottom, left] in points
        autoPaging: 'slice', // This is key to handle long content
        html2canvas: {
            scale: 2, // Use a higher scale for better resolution to avoid blurriness
            useCORS: true,
            windowHeight: source.scrollHeight // ensure full height is captured
        },
        // The width of the content in the PDF. Letter paper is 612pt wide.
        // 612 - 40 (left margin) - 40 (right margin) = 532pt
        width: 532, 
        // The width of the "browser" window html2canvas should use to render the element.
        // Using the element's own scrollWidth ensures the layout is as intended.
        windowWidth: source.scrollWidth, 
    }).catch(err => {
        console.error("PDF Generation failed:", err);
        showToast('PDF generation failed. See console for details.', 'error');
    });
}


// --- HOMEWORK HANDLERS ---
export async function handleHomeworkFileUpload(app, e, assignmentId) {
    e.preventDefault();
    const { state, db, storage } = app;
    const form = e.target;
    const fileInput = form.querySelector('input[type="file"]');
    const file = fileInput.files[0];
    if (!file) {
        showToast("Please select a file to upload.", "error");
        return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Uploading...';

    try {
        const studentId = state.user.id;
        const assignment = state.assignments.find(a => a.id === assignmentId);
        
        const storageRef = ref(storage, `schools/${state.school.id}/homeworkSubmissions/${studentId}/${assignmentId}/${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);

        const existingSubmission = state.homeworkSubmissions.find(s => s.studentId === studentId && s.assignmentId === assignmentId);

        const submissionData = {
            studentId,
            assignmentId,
            courseId: assignment.courseId,
            submittedAt: serverTimestamp(),
            fileUrl: downloadURL,
            fileName: file.name,
            status: 'submitted'
        };

        if (existingSubmission) {
            await updateDoc(doc(db, 'schools', state.school.id, 'homeworkSubmissions', existingSubmission.id), submissionData);
            showToast('Homework updated successfully!', 'success');
        } else {
            await addDoc(collection(db, 'schools', state.school.id, 'homeworkSubmissions'), submissionData);
            showToast('Homework submitted successfully!', 'success');
        }
        
        closeModal();
    } catch (error) {
        console.error("Upload failed:", error);
        showToast(`Upload failed: ${error.message}`, 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit';
    }
}

export function openHomeworkModal(app, assignmentId) {
    const { state } = app;
    const assignment = state.assignments.find(a => a.id === assignmentId);
    if (!assignment) {
        showToast("Homework assignment not found.", "error");
        return;
    }

    const title = `${assignment.title}`;
    let body = `<div class="mb-4 p-4 bg-slate-50 rounded-lg"><p class="font-semibold text-slate-700">Due Date: <span class="font-normal">${assignment.dueDate}</span></p><p class="font-semibold text-slate-700">Points: <span class="font-normal">${assignment.maxPoints}</span></p></div>`;

    if (state.user.role === 'student') {
        const mySubmission = state.homeworkSubmissions.find(s => s.studentId === state.user.id && s.assignmentId === assignment.id);
        body += `
            <h4 class="font-bold text-lg text-slate-800 mb-2">My Submission</h4>
            <form id="homework-upload-form" onsubmit="window.handleHomeworkFileUpload(event, '${assignmentId}')">
                <label for="homework-file-input" class="file-upload-area">
                    <p class="font-semibold text-slate-700">Drag & Drop or Click to Upload</p>
                    <p class="text-sm text-slate-500">Attach a photo of your work</p>
                    <input id="homework-file-input" type="file" accept="image/*,application/pdf">
                </label>
                <div id="file-preview-container" class="mt-4 text-center"></div>
                <button type="submit" class="w-full mt-4 bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700">Submit</button>
            </form>
        `;

        if (mySubmission) {
            body += `<div class="mt-6 border-t pt-4">
                <p class="font-semibold text-slate-800">Status: <span class="capitalize font-normal px-2 py-1 rounded-full ${mySubmission.status === 'submitted' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}">${mySubmission.status}</span></p>
                <p class="font-semibold mt-2">Submitted File: <a href="${mySubmission.fileUrl}" target="_blank" class="text-primary-600 hover:underline">${mySubmission.fileName}</a></p>
                <img src="${mySubmission.fileUrl}" alt="Submission preview" class="submission-preview mx-auto">
                ${mySubmission.grade ? `<p class="font-semibold mt-2">Grade: <span class="font-bold">${mySubmission.grade} / ${assignment.maxPoints}</span></p>` : ''}
                ${mySubmission.feedback ? `<div class="mt-2"><p class="font-semibold">Feedback:</p><p class="p-2 bg-slate-100 rounded mt-1">${mySubmission.feedback}</p></div>` : ''}
            </div>`;
        }
    } else if (app.canEdit(assignment)) { // Teacher/Admin view
        const enrolledStudentIds = app.getEnrolledStudentIds(assignment.courseId);
        const students = state.students.filter(s => enrolledStudentIds.includes(s.id));
        
        let studentListHtml = students.map(student => {
            const submission = state.homeworkSubmissions.find(s => s.studentId === student.id && s.assignmentId === assignment.id);
            return `
                <div class="submission-list-item">
                    <p class="font-semibold">${student.displayName}</p>
                    ${submission ? `
                        <div class="flex items-center gap-4">
                            <a href="${submission.fileUrl}" target="_blank" class="submission-file-link">View File</a>
                            <form class="flex items-center gap-2" onsubmit="window.handleSubmissionGradeForm(event, '${submission.id}')">
                                <input type="number" name="grade" placeholder="Grade" class="p-1 border rounded w-20 text-center" value="${submission.grade || ''}">
                                <span class="text-slate-400">/ ${assignment.maxPoints}</span>
                                <button type="submit" class="text-xs bg-green-500 text-white font-bold py-1 px-2 rounded hover:bg-green-600">SAVE</button>
                            </form>
                        </div>
                    ` : `
                        <span class="text-sm text-slate-400 font-semibold">Not Submitted</span>
                    `}
                </div>`;
        }).join('');
        
        body += `<h4 class="font-bold text-lg text-slate-800 mb-2 mt-4">Student Submissions</h4><div class="space-y-1">${studentListHtml}</div>`;
    }

    openModal(title, body, '2xl');
    
    if (state.user.role === 'student') {
        const fileInput = document.getElementById('homework-file-input');
        const previewContainer = document.getElementById('file-preview-container');
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                previewContainer.innerHTML = `<p class="text-slate-600">Selected: ${file.name}</p>`;
            }
        });
    }
}

export async function handleSubmissionGradeForm(app, e, submissionId) {
    e.preventDefault();
    const { db } = app;
    const grade = e.target.elements.grade.value;
    
    try {
        await updateDoc(doc(db, 'schools', app.state.school.id, 'homeworkSubmissions', submissionId), {
            grade: Number(grade),
            status: 'graded'
        });
        showToast('Grade saved!', 'success');
    } catch (err) {
        showToast(`Error saving grade: ${err.message}`, 'error');
    }
}


// --- VERSION 2.0 HANDLERS ---

// AI Assistant
export async function handleGenerateLessonPlan(app, e) {
    e.preventDefault();
    if (!app.ai) {
        showToast('AI features are not available. Please configure the API key.', 'error');
        return;
    }

    const resultDiv = document.getElementById('ai-result');
    const thinkingDiv = document.getElementById('ai-thinking-overlay');
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    resultDiv.innerHTML = '';
    thinkingDiv.classList.remove('hidden');

    const prompt = `Create a detailed lesson plan for a ${data.gradeLevel} class on the topic of "${data.topic}". 
    The key learning objectives are: ${data.objectives}.
    Structure the lesson plan with the following sections:
    1.  **Lesson Title**
    2.  **Subject & Grade Level**
    3.  **Learning Objectives** (reiterate and expand if necessary)
    4.  **Materials & Resources** (list of required items)
    5.  **Lesson Activities** (a step-by-step procedure, including introduction, direct instruction, guided practice, and independent practice)
    6.  **Differentiation** (suggestions for supporting struggling students and challenging advanced students)
    7.  **Assessment** (how to measure student understanding)
    Format the output as clean HTML using headings (h3), paragraphs (p), and lists (ul, li). Do not include markdown.`;

    try {
        const response = await app.ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        resultDiv.innerHTML = response.text;
    } catch (error) {
        console.error("Gemini API Error:", error);
        resultDiv.innerHTML = `<p class="text-red-500">An error occurred while generating the lesson plan. Please check the console for details.</p>`;
        showToast('AI generation failed.', 'error');
    } finally {
        thinkingDiv.classList.add('hidden');
    }
}

export async function handleGenerateQuizQuestions(app, e) {
    e.preventDefault();
    if (!app.ai) { return; }

    const resultDiv = document.getElementById('ai-result');
    const thinkingDiv = document.getElementById('ai-thinking-overlay');
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    resultDiv.innerHTML = '';
    thinkingDiv.classList.remove('hidden');

    const prompt = `Generate ${data.numQuestions} quiz questions about "${data.topic}".
    Include a mix of question types as specified. For multiple choice questions, provide 4 options and clearly indicate the correct answer.`;

    const questionSchema = {
        type: Type.OBJECT,
        properties: {
            question: { type: Type.STRING },
            type: { type: Type.STRING, enum: ['multiple_choice', 'short_answer'] },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            answer: { type: Type.STRING },
        },
        required: ['question', 'type', 'answer']
    };

    try {
        const response = await app.ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: questionSchema,
                },
            },
        });
        
        const questions = JSON.parse(response.text);
        window.generatedQuestions = questions; // Store globally for adding to quiz

        const courseOptions = app.state.courses.filter(c => app.canEdit(c)).map(c => {
             const quizzes = app.state.quizzes.filter(q => q.courseId === c.id);
             return `<optgroup label="${c.name}">
                ${quizzes.map(q => `<option value="${q.id}">${q.title}</option>`).join('')}
             </optgroup>`;
        }).join('');

        resultDiv.innerHTML = questions.map((q, index) => `
            <div class="p-4 bg-slate-50 rounded-lg mb-3">
                <p class="font-semibold">${index + 1}. ${q.question}</p>
                ${q.type === 'multiple_choice' ? `<ul class="list-disc pl-6 mt-2">${q.options.map(opt => `<li>${opt} ${opt === q.answer ? '<span class="text-green-600 font-bold">(Correct)</span>' : ''}</li>`).join('')}</ul>` : `<p class="text-sm text-slate-500 mt-1"><em>Answer: ${q.answer}</em></p>`}
                <div class="mt-2 text-right">
                    <select id="quiz-select-${index}" class="p-1 border rounded-md text-sm"><option value="">Add to quiz...</option>${courseOptions}</select>
                    <button onclick="window.addAiQuestionToQuiz(document.getElementById('quiz-select-${index}').value, ${index})" class="bg-blue-500 text-white text-xs font-bold py-1 px-2 rounded hover:bg-blue-600">ADD</button>
                </div>
            </div>`).join('');
    } catch (error) {
        console.error("Gemini API Error:", error);
        resultDiv.innerHTML = `<p class="text-red-500">An error occurred. The AI may have returned an unexpected format. Please try again.</p>`;
        showToast('AI generation failed.', 'error');
    } finally {
        thinkingDiv.classList.add('hidden');
    }
}

// Quiz Management
export function openQuizModal(app, courseId, quizId = null) {
    const quiz = quizId ? app.state.quizzes.find(q => q.id === quizId) : null;
    const title = quiz ? 'Edit Quiz' : 'Create New Quiz';
    const body = `<form id="quiz-form">
        <label class="block font-semibold mb-1">Quiz Title</label>
        <input type="text" name="title" value="${quiz?.title || ''}" class="w-full p-2 border rounded-lg mb-4" required>
        <label class="block font-semibold mb-1">Due Date</label>
        <input type="date" name="dueDate" value="${quiz?.dueDate || ''}" class="w-full p-2 border rounded-lg mb-4">
        <button type="submit" class="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 mt-6">Save Quiz</button>
    </form>`;
    openModal(title, body);
    document.getElementById('quiz-form').addEventListener('submit', (e) => handleQuizFormSubmit(app, e, courseId, quizId));
}

export async function handleQuizFormSubmit(app, e, courseId, quizId) {
    e.preventDefault();
    const { db } = app;
    const formData = new FormData(e.target);
    const data = {
        title: formData.get('title'),
        dueDate: formData.get('dueDate'),
        courseId: courseId,
        questions: quizId ? app.state.quizzes.find(q=>q.id===quizId).questions || [] : [],
    };

    try {
        if (quizId) {
            await updateDoc(doc(db, 'schools', app.state.school.id, 'quizzes', quizId), data);
            showToast('Quiz updated!', 'success');
        } else {
            await addDoc(collection(db, 'schools', app.state.school.id, 'quizzes'), data);
            showToast('Quiz created!', 'success');
        }
        closeModal();
    } catch (err) {
        showToast(`Error saving quiz: ${err.message}`, 'error');
    }
}

export async function deleteQuiz(app, quizId) {
    if (confirm('Are you sure you want to delete this quiz and all its submissions?')) {
        try {
            await deleteDoc(doc(app.db, 'schools', app.state.school.id, 'quizzes', quizId));
            showToast('Quiz deleted.', 'success');
        } catch (err) { showToast(`Error: ${err.message}`, 'error'); }
    }
}

export async function handleQuizQuestionSubmit(app, e, quizId) {
    e.preventDefault();
    const quiz = app.state.quizzes.find(q => q.id === quizId);
    if (!quiz) return;

    const formData = new FormData(e.target);
    const questionType = formData.get('type');
    let questionData;

    if (questionType === 'multiple_choice') {
        questionData = {
            id: Date.now().toString(),
            type: 'multiple_choice',
            question: formData.get('question'),
            options: [formData.get('option1'), formData.get('option2'), formData.get('option3'), formData.get('option4')].filter(Boolean),
            answer: formData.get('answer'),
        };
    } else {
        questionData = {
            id: Date.now().toString(),
            type: 'short_answer',
            question: formData.get('question'),
            answer: formData.get('answer') // Optional correct answer for reference
        };
    }
    
    const updatedQuestions = [...(quiz.questions || []), questionData];
    try {
        await updateDoc(doc(app.db, 'schools', app.state.school.id, 'quizzes', quizId), { questions: updatedQuestions });
        e.target.reset();
    } catch (err) { showToast(`Error saving question: ${err.message}`, 'error'); }
}

export async function deleteQuizQuestion(app, quizId, questionId) {
     const quiz = app.state.quizzes.find(q => q.id === quizId);
    if (!quiz) return;
    const updatedQuestions = quiz.questions.filter(q => q.id !== questionId);
     try {
        await updateDoc(doc(app.db, 'schools', app.state.school.id, 'quizzes', quizId), { questions: updatedQuestions });
    } catch (err) { showToast(`Error deleting question: ${err.message}`, 'error'); }
}

export async function addAiQuestionToQuiz(app, quizId, questionIndex) {
    if (!quizId) {
        showToast('Please select a quiz to add this question to.', 'error');
        return;
    }
    const question = window.generatedQuestions[questionIndex];
    const quiz = app.state.quizzes.find(q => q.id === quizId);
    if (!question || !quiz) {
        showToast('Could not find quiz or question data.', 'error');
        return;
    }
    
    const newQuestion = { id: Date.now().toString(), ...question };
    const updatedQuestions = [...(quiz.questions || []), newQuestion];
     try {
        await updateDoc(doc(app.db, 'schools', app.state.school.id, 'quizzes', quizId), { questions: updatedQuestions });
        showToast(`Question added to "${quiz.title}"!`, 'success');
    } catch (err) { showToast(`Error adding question: ${err.message}`, 'error'); }
}

// Quiz Taking and Grading
export async function handleQuizSubmission(app, e, quizId) {
    e.preventDefault();
    const { state, db } = app;
    const quiz = state.quizzes.find(q => q.id === quizId);
    if (!quiz) return;

    const formData = new FormData(e.target);
    const answers = {};
    let score = 0;
    let maxScore = 0;

    quiz.questions.forEach(q => {
        const answer = formData.get(q.id);
        answers[q.id] = answer;
        if (q.type === 'multiple_choice') {
            maxScore += 1;
            if (answer === q.answer) {
                score += 1;
            }
        }
    });

    const submissionData = {
        quizId,
        courseId: quiz.courseId,
        studentId: state.user.id,
        submittedAt: serverTimestamp(),
        answers,
        autoScore: score,
        manualScore: 0,
        maxScore,
        totalScore: score,
        isGraded: quiz.questions.every(q => q.type === 'multiple_choice'),
    };
    
    try {
        await addDoc(collection(db, 'schools', state.school.id, 'quizSubmissions'), submissionData);
        showToast('Quiz submitted successfully!', 'success');
        window.location.hash = `#/courses/${quiz.courseId}?tab=quizzes`;
    } catch(err) {
        showToast(`Error submitting quiz: ${err.message}`, 'error');
    }
}

export async function handleGradeShortAnswer(app, e, submissionId, questionId) {
    e.preventDefault();
    const submission = app.state.quizSubmissions.find(s => s.id === submissionId);
    if (!submission) return;

    const points = Number(e.target.elements.points.value);
    const updatedAnswers = { ...submission.answers, [`${questionId}_grade`]: points };
    
    // Recalculate total score
    const quiz = app.state.quizzes.find(q => q.id === submission.quizId);
    let manualScore = 0;
    quiz.questions.forEach(q => {
        if (q.type === 'short_answer') {
            manualScore += updatedAnswers[`${q.id}_grade`] || 0;
        }
    });
    const totalScore = (submission.autoScore || 0) + manualScore;

    try {
        await updateDoc(doc(app.db, 'schools', app.state.school.id, 'quizSubmissions', submissionId), {
            answers: updatedAnswers,
            manualScore,
            totalScore,
            isGraded: true, // Assuming grading one means the whole thing is graded
        });
        showToast('Grade saved!', 'success');
    } catch(err) {
        showToast(`Error saving grade: ${err.message}`, 'error');
    }
}