// profile.js - This file contains profile-specific logic and relies on dashboard.js for global functions

document.addEventListener('DOMContentLoaded', () => {
    const profileUsernameInput = document.getElementById('profileUsername');
    const profileNameInput = document.getElementById('profileName');
    const profileEmailInput = document.getElementById('profileEmail');
    const profilePhoneInput = document.getElementById('profilePhone');
    const profileAddressInput = document.getElementById('profileAddress');
    const profileForm = document.getElementById('profileForm');

    /**
     * Loads user data into the profile form.
     */
    function loadProfileData() {
        const currentUser = window.loadUserFromLocalStorage();
        if (currentUser) {
            profileUsernameInput.value = currentUser.username || '';
            profileNameInput.value = currentUser.name || '';
            profileEmailInput.value = currentUser.email || '';
            profilePhoneInput.value = currentUser.phone || '';
            profileAddressInput.value = currentUser.address || '';
        } else {
            window.showToast('Anda belum login. Silakan login.', 'error');
            // Optionally redirect to dashboard or login page
            // window.location.href = 'dashboard.html';
        }
    }

    // Handle profile form submission
    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();

            let currentUser = window.loadUserFromLocalStorage();
            if (currentUser) {
                // Update currentUser object with new form values
                currentUser.name = profileNameInput.value.trim();
                currentUser.email = profileEmailInput.value.trim();
                currentUser.phone = profilePhoneInput.value.trim();
                currentUser.address = profileAddressInput.value.trim();

                // Update in the 'users' array in localStorage
                let users = JSON.parse(localStorage.getItem('users')) || [];
                const userIndex = users.findIndex(u => u.username === currentUser.username); // Assuming username is unique

                if (userIndex !== -1) {
                    users[userIndex] = currentUser;
                } else {
                    // This case should ideally not happen if a user is logged in and editing their profile
                    // but as a fallback, add if not found
                    users.push(currentUser);
                }
                localStorage.setItem('users', JSON.stringify(users));

                // Update the 'currentUser' item in localStorage as well
                window.saveUserToLocalStorage(currentUser);

                window.showToast('Profil berhasil diperbarui!', 'success');
                window.updateAuthUI(); // Update username in header in case it was changed
            } else {
                window.showToast('Tidak dapat menyimpan profil. Anda belum login.', 'error');
            }
        });
    }

    // --- Event Listeners and Initializations for shared header/auth ---

    // Initial load of user data and update UI for header
    window.updateAuthUI();

    // Event listeners for header auth buttons (delegated to dashboard.js functions)
    const btnLoginHeader = document.getElementById('btnLogin');
    const btnRegisterHeader = document.getElementById('btnRegister');
    if (btnLoginHeader) btnLoginHeader.addEventListener('click', window.showLoginModal);
    if (btnRegisterHeader) btnRegisterHeader.addEventListener('click', window.showRegisterModal);

    // Event listener for account menu dropdown
    const accountMenu = document.getElementById('accountMenu');
    const accountDropdown = document.getElementById('accountDropdown');
    if (accountMenu && accountDropdown) {
        accountMenu.addEventListener('click', function(e) {
            accountDropdown.style.display = accountDropdown.style.display === 'block' ? 'none' : 'block';
            e.stopPropagation();
        });
        document.addEventListener('click', function(e) {
            if (!accountMenu.contains(e.target) && accountDropdown.style.display === 'block') {
                accountDropdown.style.display = 'none';
            }
        });
    }

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', window.logout);

    // Close auth modal
    const closeAuthModal = document.getElementById('closeAuthModal');
    if (closeAuthModal) {
        closeAuthModal.addEventListener('click', () => {
            const authModal = document.getElementById('authModal');
            if (authModal) authModal.style.display = 'none';
        });
    }

    // Auth form navigation
    const showRegisterLink = document.getElementById('showRegister');
    const showLoginFromRegisterLink = document.getElementById('showLoginFromRegister');
    const showForgotPasswordLink = document.getElementById('showForgotPassword');
    const showLoginFromForgotLink = document.getElementById('showLoginFromForgot');
    if (showRegisterLink) showRegisterLink.addEventListener('click', () => window.showForm('register'));
    if (showLoginFromRegisterLink) showLoginFromRegisterLink.addEventListener('click', () => window.showForm('login'));
    if (showForgotPasswordLink) showForgotPasswordLink.addEventListener('click', () => window.showForm('forgot'));
    if (showLoginFromForgotLink) showLoginFromForgotLink.addEventListener('click', () => window.showForm('login'));

    // Auth form submissions
    const btnLoginSubmit = document.getElementById('btnLoginSubmit');
    const btnRegisterSubmit = document.getElementById('btnRegisterSubmit');
    const btnResetPassword = document.getElementById('btnResetPassword');
    if (btnLoginSubmit) btnLoginSubmit.addEventListener('click', window.login);
    if (btnRegisterSubmit) btnRegisterSubmit.addEventListener('click', window.register);
    if (btnResetPassword) btnResetPassword.addEventListener('click', window.resetPassword);

    // Search functionality in header (re-enable for other pages if needed)
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        // Implement search on other pages if desired,
        // typically this would redirect to dashboard with a search query.
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter' && searchInput.value.trim() !== '') {
                // Redirect to dashboard with search term
                window.location.href = `dashboard.html?search=${encodeURIComponent(searchInput.value.trim())}`;
            }
        });
    }

    // Initial load of profile data when the page loads
    loadProfileData();
});