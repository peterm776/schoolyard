import { signOut, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { doc, updateDoc, addDoc, collection, setDoc, deleteDoc, writeBatch, query, where, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { showToast, openModal, closeModal } from './utils.js';
import { renderPrintableSchedule, renderReportCardModalContent, renderParentStatementModalContent } from './views.js';

// This function makes class methods available on the window object for inline event handlers.
export function attachHandlersToWindow(app) {
    const handlers = {
        openUserModal: (userId = null) => openUserModal(app, userId),
        handleUserFormSubmit: (e) => handleUserFormSubmit(app, e),
        deleteUser: (userId) => deleteUser(app, userId),
        handleAttendanceNoteSubmit: (e) => handleAttendanceNoteSubmit(app, e),
        handleScheduleFormSubmit: (e, studentId) => handleScheduleFormSubmit(app, e, studentId),
        openCourseModal: (courseId = null, event) => openCourseModal(app, courseId, event),
        handleCourseFormSubmit: (e) => handleCourseFormSubmit(app, e),
        deleteCourse: (courseId, event) => deleteCourse(app, courseId, event),
        handleGeneralSettingsSubmit: (e) => handleGeneralSettingsSubmit(app, e),
        handleAnnouncementSubmit: (e, courseId) => handleAnnouncementSubmit(app, e, courseId),
        openAssignmentModal: (assignmentId, courseId) => openAssignmentModal(app, assignmentId, courseId),
        handleAssignmentFormSubmit: (e) => handleAssignmentFormSubmit(app, e),
        deleteAssignment: (assignmentId) => deleteAssignment(app, assignmentId),
        updateGrade: (element, studentId, assignmentId, courseId, score, gradeId) => updateGrade(app, element, studentId, assignmentId, courseId, score, gradeId),
        handleAttendanceSubmit: (courseId, date, attendanceId) => handleAttendanceSubmit(app, courseId, date, attendanceId),
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
        openGradingPeriodModal: (periodId=null) => openGradingPeriodModal(app, periodId),
        handleGradingPeriodSubmit: (e) => handleGradingPeriodSubmit(app, e),
        deleteGradingPeriod: (id) => deleteGradingPeriod(app, id),
        handleReportCardTemplateSave: () => handleReportCardTemplateSave(app),
        deleteReportCard: (rcId) => deleteReportCard(app, rcId),
        generateReportCardsForPeriod: (periodId) => generateReportCardsForPeriod(app, periodId),
        openReportCardModal: (rcId) => openReportCardModal(app, rcId),
        generatePdfFromHtml: (elementId, pdfTitle) => generatePdfFromHtml(app, elementId, pdfTitle),
        openPaymentModal: () => openPaymentModal(app),
        openParentStatementModal: (parentId = null) => openParentStatementModal(app, parentId),
        openPrintableScheduleModal: (studentId) => openPrintableScheduleModal(app, studentId),
        handleProfileUpdate: (e) => handleProfileUpdate(app, e),
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
    if (btn) { btn.disabled = true; btn.textContent = '...'; }
    const { state, db } = app;
    const period = state.gradingPeriods.find(p => p.id === periodId);
    const template = state.reportCardTemplates[0] || {};
    const layout = template.layout || [
        { type: 'schoolHeader' }, { type: 'studentInfo' }, { type: 'gradesTable' }, { type: 'attendanceSummary' }
    ];
    const batch = writeBatch(db);

    for (const student of state.students) {
        const studentData = {};
        
        for (const component of layout) {
            if (component.type === 'gradesTable') {
                const enrolledCourses = state.courses.filter(c => app.getEnrolledStudentIds(c.id).includes(student.id));
                const coursesData = enrolledCourses.map(course => {
                    const assignments = state.assignments.filter(a => a.courseId === course.id && new Date(a.dueDate) >= new Date(period.startDate) && new Date(a.dueDate) <= new Date(period.endDate));
                    const grades = assignments.map(a => {
                        const grade = state.grades.find(g => g.studentId === student.id && g.assignmentId === a.id);
                        return { title: a.title, score: grade?.score, maxPoints: a.maxPoints };
                    });
                    return { name: course.name, grades };
                });
                studentData.courses = coursesData;
            }
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
        if (btn) { btn.disabled = false; btn.textContent = 'Generate'; }
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
    const { jsPDF } = jspdf;
    const source = document.getElementById(elementId);
    if (!source) {
        console.error('Element not found for PDF generation');
        return;
    }
    showToast('Generating PDF...', 'success');
    html2canvas(source).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'p',
            unit: 'px',
            format: [canvas.width, canvas.height]
        });
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(`${pdfTitle}.pdf`);
    });
}