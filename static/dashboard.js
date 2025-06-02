// dashboard.js - This file will contain global functions and dashboard specific logic

// Global variables (mock data for products and users)
const products = [
    {
        id: 1,
        name: "Beras Premium",
        price: 12000,
        description: "Beras kualitas premium 5kg. Beras ini dipilih dari varietas terbaik, diolah dengan teknologi modern untuk menghasilkan bulir beras yang utuh dan bersih. Cocok untuk konsumsi sehari-hari keluarga.",
        category: "Kebutuhan Pokok",
        image: "https://cdn-icons-png.flaticon.com/512/1256/1256425.png"
    },
    {
        id: 2,
        name: "Minyak Goreng",
        price: 15000,
        description: "Minyak goreng kemasan 1L. Terbuat dari kelapa sawit pilihan, kaya akan Vitamin A dan D. Ideal untuk menggoreng dan menumis, memberikan rasa gurih pada masakan Anda.",
        category: "Kebutuhan Pokok",
        image: "https://cdn-icons-png.flaticon.com/512/2938/2938499.png"
    },
    {
        id: 3,
        name: "Susu UHT",
        price: 8000,
        description: "Susu UHT rasa coklat 200ml. Susu siap minum dengan rasa coklat yang lezat, diperkaya vitamin dan mineral. Praktis dibawa ke mana saja untuk sumber energi instan.",
        category: "Minuman",
        image: "https://cdn-icons-png.flaticon.com/512/2739/2739178.png"
    },
    {
        id: 4,
        name: "Telur Ayam",
        price: 28000,
        description: "Telur ayam negeri 1 lusin. Sumber protein hewani yang murah dan mudah didapat. Cocok untuk berbagai olahan masakan.",
        category: "Kebutuhan Pokok",
        image: "https://cdn-icons-png.flaticon.com/512/3209/3209028.png"
    },
    {
        id: 5,
        name: "Kopi Instan",
        price: 9500,
        description: "Kopi instan sachet. Praktis untuk dinikmati kapan saja. Rasakan sensasi kopi nikmat di setiap tegukan.",
        category: "Minuman",
        image: "https://cdn-icons-png.flaticon.com/512/924/924765.png"
    },
    {
        id: 6,
        name: "Sabun Mandi",
        price: 7000,
        description: "Sabun mandi batangan dengan aroma lavender. Memberikan keharuman dan kesegaran sepanjang hari. Cocok untuk kulit sensitif.",
        category: "Perlengkapan Mandi",
        image: "https://cdn-icons-png.flaticon.com/512/3035/3035974.png"
    },
    {
        id: 7,
        name: "Pasta Gigi",
        price: 12000,
        description: "Pasta gigi dengan formula perlindungan total. Melindungi gigi dari gigi berlubang dan bau mulut. Nafas segar sepanjang hari.",
        category: "Perlengkapan Mandi",
        image: "https://cdn-icons-png.flaticon.com/512/575/575314.png"
    },
    {
        id: 8,
        name: "Deterjen Pakaian",
        price: 25000,
        description: "Deterjen bubuk konsentrat 500g. Membersihkan pakaian lebih bersih dan efektif. Pakaian wangi dan bebas noda membandel.",
        category: "Pembersih Rumah",
        image: "https://cdn-icons-png.flaticon.com/512/2553/2553655.png"
    },
    {
        id: 9,
        name: "Obat Nyamuk Semprot",
        price: 18000,
        description: "Obat nyamuk semprot efektif usir nyamuk dan serangga. Perlindungan maksimal untuk keluarga. Aman digunakan di dalam ruangan.",
        category: "Pembersih Rumah",
        image: "https://cdn-icons-png.flaticon.com/512/488/488737.png"
    },
    {
        id: 10,
        name: "Snack Kentang",
        price: 8500,
        description: "Snack kentang renyah dengan rasa balado. Cocok untuk camilan saat bersantai. Teman ngopi yang pas.",
        category: "Camilan",
        image: "https://cdn-icons-png.flaticon.com/512/820/820150.png"
    }
];

// Auth related DOM elements
const authButtons = document.getElementById('authButtons');
const accountMenu = document.getElementById('accountMenu');
const accountUsername = document.getElementById('accountUsername');
const logoutBtn = document.getElementById('logoutBtn');
const authModal = document.getElementById('authModal');
const closeAuthModal = document.getElementById('closeAuthModal');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const forgotPasswordForm = document.getElementById('forgotPasswordForm');
const showRegisterLink = document.getElementById('showRegister');
const showLoginFromRegisterLink = document.getElementById('showLoginFromRegister');
const showForgotPasswordLink = document.getElementById('showForgotPassword');
const showLoginFromForgotLink = document.getElementById('showLoginFromForgot');
const btnLoginSubmit = document.getElementById('btnLoginSubmit');
const btnRegisterSubmit = document.getElementById('btnRegisterSubmit');
const btnResetPassword = document.getElementById('btnResetPassword');
const loginIdInput = document.getElementById('loginId');
const loginPasswordInput = document.getElementById('loginPassword');
const regUsernameInput = document.getElementById('regUsername');
const regNameInput = document.getElementById('regName');
const regEmailInput = document.getElementById('regEmail');
const regPhoneInput = document.getElementById('regPhone');
const regPasswordInput = document.getElementById('regPassword');
const forgotIdInput = document.getElementById('forgotId');
const loginError = document.getElementById('loginError');
const registerError = document.getElementById('registerError');
const forgotError = document.getElementById('forgotError');
const toast = document.getElementById('toast');

// Product Detail Modal DOM elements
const productDetailModal = document.getElementById('productDetailModal');
const closeDetailModal = document.getElementById('closeDetailModal');
const modalProductImage = document.getElementById('modalProductImage');
const modalProductName = document.getElementById('modalProductName');
const modalProductDescription = document.getElementById('modalProductDescription');
const modalProductPrice = document.getElementById('modalProductPrice');
const modalProductStock = document.getElementById('modalProductStock');
const modalAddToCartBtn = document.getElementById('modalAddToCartBtn');

// Dashboard specific DOM elements
const catalogContainer = document.getElementById('catalog');
const categoryFilter = document.getElementById('categoryFilter');
const searchInput = document.getElementById('searchInput');

// --- Global Utility Functions ---

/**
 * Displays a toast notification.
 * @param {string} message - The message to display.
 * @param {string} type - 'success', 'error', or 'info'.
 */
window.showToast = function(message, type = 'info') {
    if (!toast) return; // Ensure toast element exists
    toast.textContent = message;
    toast.className = 'toast show ' + type;
    setTimeout(() => {
        toast.className = toast.className.replace('show', '');
    }, 3000);
};

/**
 * Loads the current user from Local Storage.
 * @returns {object|null} The current user object or null if not logged in.
 */
window.loadUserFromLocalStorage = function() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
};

/**
 * Saves the current user to Local Storage.
 * @param {object|null} user - The user object to save, or null to clear.
 */
window.saveUserToLocalStorage = function(user) {
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
        localStorage.removeItem('currentUser');
    }
};

/**
 * Updates the authentication UI based on current user status.
 */
window.updateAuthUI = function() {
    const currentUser = window.loadUserFromLocalStorage();
    if (authButtons && accountMenu && accountUsername) {
        if (currentUser) {
            authButtons.style.display = 'none';
            accountMenu.style.display = 'flex';
            accountUsername.textContent = currentUser.username; // Or currentUser.name
            updateAddToCartButtonsVisibility(true); // Show add to cart buttons
        } else {
            authButtons.style.display = 'flex';
            accountMenu.style.display = 'none';
            accountUsername.textContent = '';
            updateAddToCartButtonsVisibility(false); // Hide add to cart buttons
        }
    }
};

function updateAddToCartButtonsVisibility(isLoggedIn) {
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.style.display = isLoggedIn ? 'block' : 'none';
    });
    if (modalAddToCartBtn) {
        modalAddToCartBtn.style.display = isLoggedIn ? 'block' : 'none';
    }
}


/**
 * Shows a specific authentication form (login, register, forgot password) in the modal.
 * @param {string} formName - 'login', 'register', or 'forgot'.
 */
window.showForm = function(formName) {
    if (loginForm) loginForm.style.display = 'none';
    if (registerForm) registerForm.style.display = 'none';
    if (forgotPasswordForm) forgotPasswordForm.style.display = 'none';
    if (loginError) loginError.textContent = '';
    if (registerError) registerError.textContent = '';
    if (forgotError) forgotError.textContent = '';

    if (formName === 'login' && loginForm) {
        loginForm.style.display = 'block';
    } else if (formName === 'register' && registerForm) {
        registerForm.style.display = 'block';
    } else if (formName === 'forgot' && forgotPasswordForm) {
        forgotPasswordForm.style.display = 'block';
    }
};

/**
 * Shows the login modal.
 */
window.showLoginModal = function() {
    if (authModal) authModal.style.display = 'flex';
    window.showForm('login');
};

/**
 * Shows the register modal.
 */
window.showRegisterModal = function() {
    if (authModal) authModal.style.display = 'flex';
    window.showForm('register');
};

/**
 * Shows the forgot password modal.
 */
window.showForgotPasswordModal = function() {
    if (authModal) authModal.style.display = 'flex';
    window.showForm('forgot');
};

/**
 * Handles user logout.
 */
window.logout = function() {
    window.saveUserToLocalStorage(null); // Clear current user
    window.updateAuthUI(); // Update UI
    window.showToast('Anda telah logout.', 'info');
    // Clear the specific user's cart on logout
    // Note: You might want to keep the cart for when they log back in
    // For now, let's clear it completely if a user logs out
    const currentUser = window.loadUserFromLocalStorage();
    if (currentUser) {
        localStorage.removeItem(`cart_${currentUser.username}`);
    }
};

/**
 * Handles user login.
 */
window.login = function() {
    const id = loginIdInput.value;
    const password = loginPasswordInput.value;

    let users = JSON.parse(localStorage.getItem('users')) || [];
    const foundUser = users.find(u =>
        (u.username === id || u.email === id || u.phone === id) && u.password === password
    );

    if (foundUser) {
        window.saveUserToLocalStorage(foundUser);
        window.updateAuthUI();
        if (authModal) authModal.style.display = 'none';
        window.showToast('Login berhasil!', 'success');
        // Refresh products to show/hide add to cart buttons
        renderProducts(products); // Assuming products are always available globally
    } else {
        if (loginError) loginError.textContent = 'ID atau kata sandi salah.';
        window.showToast('Login gagal!', 'error');
    }
};

/**
 * Handles user registration.
 */
window.register = function() {
    const username = regUsernameInput.value.trim();
    const name = regNameInput.value.trim();
    const email = regEmailInput.value.trim();
    const phone = regPhoneInput.value.trim();
    const password = regPasswordInput.value.trim();

    if (!username || !name || !email || !phone || !password) {
        if (registerError) registerError.textContent = 'Semua field harus diisi.';
        window.showToast('Pendaftaran gagal!', 'error');
        return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];

    // Simple validation for unique username/email/phone
    if (users.some(u => u.username === username)) {
        if (registerError) registerError.textContent = 'Username sudah digunakan.';
        return;
    }
    if (users.some(u => u.email === email)) {
        if (registerError) registerError.textContent = 'Email sudah digunakan.';
        return;
    }
    if (users.some(u => u.phone === phone)) {
        if (registerError) registerError.textContent = 'Nomor telepon sudah digunakan.';
        return;
    }

    const newUser = { username, name, email, phone, password, address: '' };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    window.showToast('Pendaftaran berhasil! Silakan login.', 'success');
    window.showForm('login');
    // Clear registration form fields
    regUsernameInput.value = '';
    regNameInput.value = '';
    regEmailInput.value = '';
    regPhoneInput.value = '';
    regPasswordInput.value = '';
};

/**
 * Handles forgot password request.
 */
window.resetPassword = function() {
    const id = forgotIdInput.value.trim();
    if (!id) {
        if (forgotError) forgotError.textContent = 'Masukkan Username / Email / No. Telepon Anda.';
        return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];
    const foundUser = users.find(u => u.username === id || u.email === id || u.phone === id);

    if (foundUser) {
        // In a real application, you would send a reset link to their email/phone
        window.showToast('Instruksi reset kata sandi telah dikirim.', 'info');
        if (authModal) authModal.style.display = 'none';
        forgotIdInput.value = '';
    } else {
        if (forgotError) forgotError.textContent = 'Akun tidak ditemukan.';
        window.showToast('Reset kata sandi gagal!', 'error');
    }
};

// --- Product Catalog and Detail Functions ---

/**
 * Renders products into the catalog container.
 * @param {Array<object>} filteredProducts - Products to render.
 */
function renderProducts(filteredProducts) {
    if (!catalogContainer) return;

    catalogContainer.innerHTML = '';
    if (filteredProducts.length === 0) {
        catalogContainer.innerHTML = '<p style="text-align: center; color: #6c757d; font-size: 1.1em; padding: 50px;">Tidak ada produk yang ditemukan.</p>';
        return;
    }

    const currentUser = window.loadUserFromLocalStorage();

    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';

        const truncatedDescription = product.description.length > 70
            ? product.description.substring(0, 70) + '...'
            : product.description;

        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" />
            <h4>${product.name}</h4>
            <p class="product-price">Rp ${product.price.toLocaleString('id-ID')}</p>
            <p>${truncatedDescription}</p>
            <button class="btn btn-primary add-to-cart-btn" data-id="${product.id}" ${currentUser ? '' : 'style="display: none;"'}>+ Keranjang</button>
        `;
        catalogContainer.appendChild(productCard);

        const elementsToClickForDetail = productCard.querySelectorAll('img, h4, p:not(.product-price), .product-badge');
        elementsToClickForDetail.forEach(el => {
            el.addEventListener('click', () => showProductDetail(product.id));
        });

        const addToCartBtn = productCard.querySelector('.add-to-cart-btn');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent product detail modal from opening
                addToCart(parseInt(e.target.dataset.id));
            });
        }
    });
}

/**
 * Shows the product detail modal.
 * @param {number} productId - The ID of the product to display.
 */
function showProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    if (!product || !productDetailModal) return;

    modalProductImage.src = product.image;
    modalProductName.textContent = product.name;
    modalProductDescription.textContent = product.description;
    modalProductPrice.textContent = `Rp ${product.price.toLocaleString('id-ID')}`;
    modalProductStock.textContent = product.stock !== undefined ? product.stock : 'N/A'; // Assuming stock can be undefined
    modalAddToCartBtn.dataset.productId = product.id; // Set ID for add to cart button

    const currentUser = window.loadUserFromLocalStorage();
    modalAddToCartBtn.style.display = currentUser ? 'block' : 'none'; // Show/hide button based on login

    productDetailModal.style.display = 'flex'; // Use 'flex' for centering with CSS
}

// Close product detail modal
if (closeDetailModal) {
    closeDetailModal.addEventListener('click', () => {
        if (productDetailModal) productDetailModal.style.display = 'none';
    });
}

// Add to cart from modal
if (modalAddToCartBtn) {
    modalAddToCartBtn.addEventListener('click', (event) => {
        const productId = parseInt(event.target.dataset.productId);
        addToCart(productId);
        if (productDetailModal) productDetailModal.style.display = 'none'; // Close modal after adding
    });
}

// --- Cart Management Functions (Globalized for use across pages) ---

/**
 * Adds a product to the user's cart.
 * @param {number} productId - The ID of the product to add.
 */
window.addToCart = function(productId) {
    const currentUser = window.loadUserFromLocalStorage();
    if (!currentUser) {
        window.showToast('Silakan login untuk menambahkan produk ke keranjang.', 'error');
        window.showLoginModal();
        return;
    }

    const product = products.find(p => p.id === productId);
    if (!product) {
        window.showToast('Produk tidak ditemukan.', 'error');
        return;
    }

    const cartKey = `cart_${currentUser.username}`;
    let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

    const existingCartItem = cart.find(item => item.id === productId);

    // Assuming a 'stock' property in your products array for this logic
    const productStock = product.stock !== undefined ? product.stock : 1000; // Default large stock if not specified

    if (existingCartItem) {
        if (existingCartItem.quantity < productStock) {
            existingCartItem.quantity++;
            window.showToast(`Menambahkan ${product.name} ke keranjang.`, 'success');
        } else {
            window.showToast(`Stok ${product.name} terbatas.`, 'error');
        }
    } else {
        if (productStock > 0) {
            cart.push({ ...product, quantity: 1 });
            window.showToast(`${product.name} ditambahkan ke keranjang.`, 'success');
        } else {
            window.showToast(`${product.name} sedang tidak tersedia.`, 'error');
        }
    }
    localStorage.setItem(cartKey, JSON.stringify(cart));
    // Optionally, update a cart count icon in the header if you have one
};


// --- Event Listeners and Initializations ---

document.addEventListener('DOMContentLoaded', () => {
    // Initial load of user data and update UI
    window.updateAuthUI();

    // Event listeners for auth buttons in header
    const btnLoginHeader = document.getElementById('btnLogin');
    const btnRegisterHeader = document.getElementById('btnRegister');
    if (btnLoginHeader) btnLoginHeader.addEventListener('click', window.showLoginModal);
    if (btnRegisterHeader) btnRegisterHeader.addEventListener('click', window.showRegisterModal);

    // Event listener for account menu dropdown
    if (accountMenu && accountDropdown) {
        accountMenu.addEventListener('click', function(e) {
            accountDropdown.style.display = accountDropdown.style.display === 'block' ? 'none' : 'block';
            e.stopPropagation(); // Prevent document click from closing it immediately
        });

        // Close dropdown if clicked outside
        document.addEventListener('click', function(e) {
            if (!accountMenu.contains(e.target) && accountDropdown.style.display === 'block') {
                accountDropdown.style.display = 'none';
            }
        });
    }

    // Logout button
    if (logoutBtn) logoutBtn.addEventListener('click', window.logout);

    // Close auth modal
    if (closeAuthModal) {
        closeAuthModal.addEventListener('click', () => {
            if (authModal) authModal.style.display = 'none';
        });
    }

    // Auth form navigation
    if (showRegisterLink) showRegisterLink.addEventListener('click', () => window.showForm('register'));
    if (showLoginFromRegisterLink) showLoginFromRegisterLink.addEventListener('click', () => window.showForm('login'));
    if (showForgotPasswordLink) showForgotPasswordLink.addEventListener('click', () => window.showForm('forgot'));
    if (showLoginFromForgotLink) showLoginFromForgotLink.addEventListener('click', () => window.showForm('login'));

    // Auth form submissions
    if (btnLoginSubmit) btnLoginSubmit.addEventListener('click', window.login);
    if (btnRegisterSubmit) btnRegisterSubmit.addEventListener('click', window.register);
    if (btnResetPassword) btnResetPassword.addEventListener('click', window.resetPassword);


    // --- Dashboard Specific Logic ---

    // Populate categories in the filter dropdown
    if (categoryFilter) {
        const categories = [...new Set(products.map(p => p.category))];
        categoryFilter.innerHTML = '<option value="all">Semua Kategori</option>';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });

        // Filter products when category changes
        categoryFilter.addEventListener('change', () => filterAndSearchProducts());
    }

    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', () => filterAndSearchProducts());
    }

    // Combined filter and search function
    function filterAndSearchProducts() {
        const selectedCategory = categoryFilter ? categoryFilter.value : 'all';
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';

        let filtered = products;

        if (selectedCategory !== 'all') {
            filtered = filtered.filter(product => product.category === selectedCategory);
        }

        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm) ||
                product.category.toLowerCase().includes(searchTerm)
            );
        }
        renderProducts(filtered);
    }

    // Initial product rendering on dashboard load
    renderProducts(products);
});