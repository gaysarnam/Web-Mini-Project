// --- Mock Database: POSTS (Initial Data) ---
let posts = [
    { 
        id: 101, 
        type: 'Problem', 
        subject: 'Wi-Fi slow in North Dorm', 
        content: 'The campus Wi-Fi speed drops significantly after 7 PM in the North Dorm block. Students cannot attend online classes.', 
        status: 'New', 
        user: 'Aisha K.',
        isFavorite: false,
        comments: [
            { id: 1, user: 'Admin', text: 'Thanks for the report. Escalating to IT.' },
            { id: 2, user: 'Ben J.', text: 'I second this. It\'s unusable.' },
            { id: 3, user: 'User 404', text: 'This is a totally inappropriate comment and should be deleted.' }
        ]
    },
    { 
        id: 102, 
        type: 'Suggestion', 
        subject: 'Add more study pods in the library', 
        content: 'Suggest adding more soundproof study pods on the third floor for group work.', 
        status: 'Resolved', 
        user: 'Chris T.',
        isFavorite: false, 
        comments: []
    },
    { 
        id: 103, 
        type: 'Problem', 
        subject: 'Broken Water Fountain near Gym', 
        content: 'The water fountain has been leaking for a week. Needs urgent repair.', 
        status: 'In Progress', 
        user: 'Dana M.',
        isFavorite: false, 
        comments: [
            { id: 4, user: 'Admin', text: 'Plumbing team is on it.' }
        ]
    }
];

// --- Mock Database: USERS ---
let users = [
    { id: 1, username: 'Aisha K.', email: 'aisha.k@college.edu', role: 'Student', status: 'Active' },
    { id: 2, username: 'Chris T.', email: 'chris.t@college.edu', role: 'Student', status: 'Active' },
    { id: 3, username: 'Prof. Smith', email: 'smith.p@college.edu', role: 'Faculty', status: 'Active' },
    { id: 4, username: 'User 404', email: 'user404@college.edu', role: 'Student', status: 'Banned' }
];

// --- Mock Database: CURRENT ADMIN (Initial Data) ---
let currentAdmin = {
    id: 1001,
    username: 'Moderator_Alpha',
    email: 'admin@collegecentral.edu',
    role: 'Senior Moderator',
    status: 'Active (Full Access)',
    avatarUrl: '' 
};

// --- Mock Database: ADMIN SETTINGS (Initial Data) ---
let adminSettings = {
    darkMode: false,
    highContrast: false,
    defaultPostStatus: 'New',
    rowsPerPage: 10,
    notifyUserStatus: true,
    notifyNewComment: true
};

// --- Mock Notifications ---
let notifications = [
    { id: 1, message: "New Problem posted: 'Wi-Fi slow in North Dorm'", unread: true },
    { id: 2, message: "User 'Ben J.' replied to ticket 101.", unread: true },
    { id: 3, message: "System backup completed successfully.", unread: false }
];


// --- DOM Element Declarations (Partial) ---
const postTableBody = document.querySelector('#post-table tbody');
const userTableBody = document.getElementById('user-table-body');
const postsView = document.getElementById('posts-view');
const usersView = document.getElementById('users-view');
const profileView = document.getElementById('profile-view');
const settingsView = document.getElementById('settings-view'); 
const mainTitle = document.getElementById('main-title');
const mainDescription = document.getElementById('main-description');
const notificationModal = document.getElementById('notification-modal');
const notificationList = document.getElementById('notification-list');
const notificationCount = document.getElementById('notification-count');
const detailsModal = document.getElementById('details-modal');
const commentsList = document.getElementById('comments-list');
const profilePicInput = document.getElementById('profile-pic-input');
const currentProfileAvatar = document.getElementById('current-profile-avatar');
const saveProfileBtn = document.getElementById('save-profile-btn');
const saveSettingsBtn = document.getElementById('save-settings-btn');


// ----------------------------------------------------------------------
//                                DATA PERSISTENCE
// ----------------------------------------------------------------------

function loadPersistentData() {
    // 1. Load Admin Profile
    const savedProfile = localStorage.getItem('adminProfile');
    if (savedProfile) {
        currentAdmin = JSON.parse(savedProfile);
    }
    
    // 2. Load Settings
    const savedSettings = localStorage.getItem('adminSettings');
    if (savedSettings) {
        adminSettings = JSON.parse(savedSettings);
    }
}


// ----------------------------------------------------------------------
//                                VIEW SWITCHING
// ----------------------------------------------------------------------

function setActiveLink(clickedLink) {
    document.querySelector('.sidebar a.active')?.classList.remove('active');
    clickedLink.classList.add('active');
}

function showView(viewName) {
    // Hide all views first
    postsView.classList.add('hidden');
    usersView.classList.add('hidden');
    profileView.classList.add('hidden');
    settingsView.classList.add('hidden'); 

    // Show the requested view
    if (viewName === 'posts') {
        postsView.classList.remove('hidden');
        mainTitle.textContent = "Moderation Central";
        mainDescription.textContent = "Review and moderate user-submitted problems and suggestions.";
    } else if (viewName === 'users') {
        usersView.classList.remove('hidden');
        mainTitle.textContent = "User Management Console";
        mainDescription.textContent = "View, search, and manage user accounts and statuses.";
        renderUsers(users); 
    } else if (viewName === 'profile') {
        profileView.classList.remove('hidden');
        mainTitle.textContent = "Edit Administrator Profile";
        mainDescription.textContent = "Update your credentials and account settings.";
        renderProfile(currentAdmin);
    } else if (viewName === 'settings') { 
        settingsView.classList.remove('hidden');
        mainTitle.textContent = "Application Settings";
        mainDescription.textContent = "Manage dashboard display and application defaults.";
        loadAdminSettings(); 
    }
}


// ----------------------------------------------------------------------
//                             PROFILE & SIDEBAR RENDERING
// ----------------------------------------------------------------------

function renderSidebarProfile(admin) {
    const sidebarUserCard = document.getElementById('sidebar-user-card');
    const sidebarAdminName = document.getElementById('sidebar-admin-name');
    
    sidebarAdminName.textContent = admin.username.toUpperCase();
    
    let avatarImg = sidebarUserCard.querySelector('.user-avatar img');

    if (admin.avatarUrl) {
        if (!avatarImg) {
            const avatarDiv = sidebarUserCard.querySelector('.user-avatar');
            avatarImg = document.createElement('img');
            avatarImg.setAttribute('alt', 'Admin Avatar');
            avatarDiv.innerHTML = ''; 
            avatarDiv.appendChild(avatarImg);
        }
        avatarImg.src = admin.avatarUrl;
    } else {
         sidebarUserCard.querySelector('.user-avatar').innerHTML = 
            `<img src="https://via.placeholder.com/60/3498db/FFFFFF?text=AD" alt="Admin Avatar">`;
    }
}

function renderProfile(admin) {
    // Update Form fields
    document.getElementById('profile-name').value = admin.username; 
    document.getElementById('profile-username').value = admin.username;
    document.getElementById('profile-role').value = admin.role;
    document.getElementById('profile-email').value = admin.email;
    
    // Update Profile View Avatar
    if (admin.avatarUrl) {
        currentProfileAvatar.innerHTML = `<img src="${admin.avatarUrl}" alt="Admin Avatar">`;
    } else {
        currentProfileAvatar.innerHTML = '👤'; 
    }
}

function handleProfilePictureChange(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            currentAdmin.avatarUrl = e.target.result; 
            renderProfile(currentAdmin);
            alert('New profile picture loaded! Click "Save Changes" to finalize.');
        };
        reader.readAsDataURL(file);
    }
}

function saveProfileChanges() {
    const newName = document.getElementById('profile-name').value.trim();
    const newUsername = document.getElementById('profile-username').value.trim();
    const newEmail = document.getElementById('profile-email').value.trim();

    if (!newName || !newUsername || !newEmail) {
        alert("Please fill out all required fields.");
        return;
    }

    currentAdmin.username = newUsername; 
    currentAdmin.email = newEmail;
    
    // Save to Local Storage for persistence
    localStorage.setItem('adminProfile', JSON.stringify(currentAdmin));

    // Update UI elements
    renderSidebarProfile(currentAdmin); 
    renderProfile(currentAdmin); 
    
    alert(`Profile updated successfully! New Username: ${newUsername}`);
}


// ----------------------------------------------------------------------
//                              SETTINGS FUNCTIONS
// ----------------------------------------------------------------------

function loadAdminSettings() {
    // System & Display
    document.getElementById('dark-mode-toggle').checked = adminSettings.darkMode;
    document.getElementById('high-contrast-toggle').checked = adminSettings.highContrast;
    
    // Moderation Defaults
    document.getElementById('default-status').value = adminSettings.defaultPostStatus;
    document.getElementById('rows-per-page').value = adminSettings.rowsPerPage;

    // Notification Settings
    document.getElementById('notify-user-status').checked = adminSettings.notifyUserStatus;
    document.getElementById('notify-new-comment').checked = adminSettings.notifyNewComment;
}

function saveAdminSettings() {
    // 1. Gather values
    const darkMode = document.getElementById('dark-mode-toggle').checked;
    const highContrast = document.getElementById('high-contrast-toggle').checked;
    const defaultStatus = document.getElementById('default-status').value;
    const rowsPerPage = parseInt(document.getElementById('rows-per-page').value, 10);
    const notifyUserStatus = document.getElementById('notify-user-status').checked;
    const notifyNewComment = document.getElementById('notify-new-comment').checked;
    
    if (rowsPerPage < 5 || rowsPerPage > 50 || isNaN(rowsPerPage)) {
        alert("Tickets per page must be between 5 and 50.");
        document.getElementById('rows-per-page').value = adminSettings.rowsPerPage;
        return;
    }

    // 2. Update the mock data object
    adminSettings.darkMode = darkMode;
    adminSettings.highContrast = highContrast;
    adminSettings.defaultPostStatus = defaultStatus;
    adminSettings.rowsPerPage = rowsPerPage;
    adminSettings.notifyUserStatus = notifyUserStatus;
    adminSettings.notifyNewComment = notifyNewComment;

    // 3. Save to Local Storage
    localStorage.setItem('adminSettings', JSON.stringify(adminSettings));

    // 4. Provide feedback
    alert('Application Settings saved successfully!');
}

// ----------------------------------------------------------------------
//                              OTHER DASHBOARD FUNCTIONS
// ----------------------------------------------------------------------

function renderPosts(data) {
    postTableBody.innerHTML = '';
    const favCount = posts.filter(p => p.isFavorite && p.status !== 'Deleted').length;
    document.getElementById('fav-count').textContent = favCount;
    
    data.forEach(post => {
        if (post.status !== 'Deleted') { 
            const row = postTableBody.insertRow();
            let statusClass = `status-${post.status.toLowerCase().replace(' ', '-')}`;
            let typeClass = `tag tag-${post.type.toLowerCase()}`;
            const starIcon = post.isFavorite ? '★' : '☆'; 
            const favClass = post.isFavorite ? 'is-favorited' : '';

            row.innerHTML = `
                <td>${post.id}</td>
                <td><span class="${typeClass}">${post.type}</span></td>
                <td>${post.subject}</td>
                <td><span class="${statusClass}">${post.status}</span></td>
                <td>${post.user}</td>
                <td>
                    <button class="action-btn btn-view" onclick="openDetailsModal(${post.id})">View</button>
                    <button class="action-btn btn-delete" onclick="deletePost(${post.id})">Delete</button>
                    <button class="btn-favorite ${favClass}" onclick="toggleFavorite(${post.id})">${starIcon}</button>
                </td>
            `;
        }
    });
}
window.toggleFavorite = function(postId) {
    const post = posts.find(p => p.id === postId);
    if (post) {
        post.isFavorite = !post.isFavorite; 
        renderPosts(posts); 
    }
}
window.deletePost = function(postId) {
    if (!confirm('DANGER: Are you sure you want to delete this entire post? This action is not reversible.')) return;
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex !== -1) {
        posts[postIndex].status = 'Deleted'; 
        renderPosts(posts); 
        alert(`Post ${postId} has been marked as Deleted.`);
    }
}
window.filterPosts = function() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const filteredPosts = posts.filter(post => 
        (post.status !== 'Deleted') && (
        post.subject.toLowerCase().includes(searchTerm) ||
        post.content.toLowerCase().includes(searchTerm) ||
        post.type.toLowerCase().includes(searchTerm)
        )
    );
    renderPosts(filteredPosts);
}
function renderUsers(data) {
    userTableBody.innerHTML = '';
    data.forEach(user => {
        const row = userTableBody.insertRow();
        const statusClass = user.status.toLowerCase() === 'active' ? 'status-active' : 'status-banned';
        const actionText = user.status === 'Active' ? 'Ban User' : 'Unban User';
        const actionClass = user.status === 'Active' ? 'btn-ban' : 'btn-unban';

        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td class="${statusClass}">${user.status}</td>
            <td>
                <button class="btn-toggle-status ${actionClass}" onclick="toggleUserStatus(${user.id})">${actionText}</button>
            </td>
        `;
    });
}
window.toggleUserStatus = function(userId) {
    const user = users.find(u => u.id === userId);
    if (user) {
        if (user.status === 'Active') {
            user.status = 'Banned';
            alert(`User ${user.username} has been BANNED.`);
        } else {
            user.status = 'Active';
            alert(`User ${user.username} has been UNBANNED.`);
        }
        renderUsers(users);
    }
}
window.filterUsers = function() {
    const searchTerm = document.getElementById('user-search-input').value.toLowerCase();
    const filteredUsers = users.filter(user => 
        user.username.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.role.toLowerCase().includes(searchTerm)
    );
    renderUsers(filteredUsers);
}
function renderNotifications() {
    notificationList.innerHTML = '';
    const unreadCount = notifications.filter(n => n.unread).length;
    
    notificationCount.textContent = unreadCount > 0 ? unreadCount : ''; 
    notificationCount.style.display = unreadCount > 0 ? 'block' : 'none';

    if (notifications.length === 0) {
           notificationList.innerHTML = '<li>No new notifications.</li>';
           return;
    }

    notifications.forEach(notification => {
        const li = document.createElement('li');
        li.textContent = notification.message;
        
        if (notification.unread) {
            li.classList.add('unread');
        }

        li.onclick = () => markAsRead(notification.id);
        notificationList.appendChild(li);
    });
}
window.openNotificationModal = function() { notificationModal.style.display = 'block'; }
window.closeNotificationModal = function() { notificationModal.style.display = 'none'; }
function markAsRead(id) {
    const notification = notifications.find(n => n.id === id);
    if (notification) {
        notification.unread = false;
        renderNotifications();
    }
}
window.openDetailsModal = function(postId) {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    document.getElementById('modal-id').textContent = post.id;
    document.getElementById('modal-subject').textContent = post.subject;
    document.getElementById('modal-content').textContent = post.content;
    document.getElementById('modal-title').textContent = `${post.type} - ID: ${post.id}`;
    
    commentsList.innerHTML = '';
    document.getElementById('comment-count').textContent = post.comments.length;

    post.comments.forEach(comment => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div><strong>${comment.user}:</strong> ${comment.text}</div>
            <button class="action-btn btn-delete-comment" onclick="deleteComment(${post.id}, ${comment.id})">Delete</button>
        `;
        commentsList.appendChild(li);
    });
    detailsModal.style.display = 'block';
}
window.deleteComment = function(postId, commentId) {
    if (!confirm('WARNING: Are you sure you want to delete this comment?')) return;
    const post = posts.find(p => p.id === postId);
    if (post) {
        post.comments = post.comments.filter(c => c.id !== commentId);
        openDetailsModal(postId); 
        alert(`Comment ${commentId} has been removed.`);
    }
}
window.closeDetailsModal = function() { detailsModal.style.display = 'none'; }
window.onclick = function(event) {
    if (event.target === detailsModal || event.target === notificationModal) {
        event.target.style.display = 'none';
    }
}
window.archiveOldData = function() {
    if (confirm("Are you sure you want to mock-archive resolved tickets? This will remove them from the dashboard view.")) {
        const resolvedCount = posts.filter(p => p.status === 'Resolved').length;
        if (resolvedCount === 0) {
            alert("No resolved tickets found to archive.");
            return;
        }
        posts = posts.filter(p => p.status !== 'Resolved');
        renderPosts(posts);
        alert(`${resolvedCount} ticket(s) have been successfully archived and removed from the dashboard.`);
    }
}
window.clearReadNotifications = function() {
    const readCount = notifications.filter(n => !n.unread).length;
    if (readCount === 0) {
        alert("No read notifications to clear.");
        return;
    }
    notifications = notifications.filter(n => n.unread);
    renderNotifications();
    alert(`${readCount} read notification(s) cleared.`);
}


// ----------------------------------------------------------------------
//                        INITIALIZATION & EVENT LISTENERS
// ----------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. LOAD PERSISTENT DATA FIRST
    loadPersistentData(); 

    // Attach Sidebar Handlers
    document.getElementById('dashboard-link').onclick = function(e) {
        e.preventDefault();
        setActiveLink(e.target);
        showView('posts');
        renderPosts(posts);
    };

    document.getElementById('favorites-link').onclick = function(e) {
        e.preventDefault();
        setActiveLink(e.target);
        const favoritePosts = posts.filter(p => p.isFavorite);
        showView('posts');
        renderPosts(favoritePosts);
        mainTitle.textContent = "My Favorite Tickets ⭐";
    };

    document.getElementById('users-link').onclick = function(e) {
        e.preventDefault();
        setActiveLink(e.target);
        showView('users');
    };
    
    document.getElementById('profile-link').onclick = function(e) {
        e.preventDefault();
        setActiveLink(e.target);
        showView('profile');
    };
    
    document.getElementById('settings-link').onclick = function(e) {
        e.preventDefault();
        setActiveLink(e.target);
        showView('settings'); 
    };
    
    document.getElementById('logout-btn').onclick = function() {
        alert('Logging out... Thank you for your service!');
    };

    document.getElementById('notification-bell').onclick = openNotificationModal;
    
    // --- PROFILE FUNCTIONALITY LISTENERS ---
    profilePicInput.addEventListener('change', handleProfilePictureChange);
    saveProfileBtn.addEventListener('click', saveProfileChanges);
    
    // --- SETTINGS FUNCTIONALITY LISTENERS ---
    saveSettingsBtn.addEventListener('click', saveAdminSettings);
    document.getElementById('archive-old-data-btn').addEventListener('click', archiveOldData);
    document.getElementById('clear-notifications-btn').addEventListener('click', clearReadNotifications);
    
    
    // --- Initial Render ---
    renderPosts(posts);
    renderNotifications();
    loadAdminSettings(); 
    showView('posts'); 
    
    // Render profile and sidebar using the loaded persistent data
    renderSidebarProfile(currentAdmin);
    renderProfile(currentAdmin);
});