// dashboard.js - Mengandung semua fungsionalitas global, autentikasi, dan dashboard.
console.log("dashboard.js loaded");

// --- Global Variables (Product Mock Data & All DOM Elements) ---

// Product Mock Data (Penting: Pastikan ini ada di dashboard.js)
const products = [
    {
        id: 1,
        name: "Beras Premium",
        price: 12000,
        description:
            "Beras kualitas premium 5kg. Beras ini dipilih dari varietas terbaik, diolah dengan teknologi modern untuk menghasilkan bulir beras yang utuh dan bersih. Cocok untuk konsumsi sehari-hari keluarga.",
        category: "Kebutuhan Pokok",
        image: "https://cdn-icons-png.flaticon.com/512/1256/1256425.png",
        stock: 50,
    },
    {
        id: 2,
        name: "Minyak Goreng",
        price: 15000,
        description:
            "Minyak goreng kemasan 1L. Terbuat dari kelapa sawit pilihan, kaya akan Vitamin A dan D. Ideal untuk menggoreng dan menumis, memberikan rasa gurih pada masakan Anda.",
        category: "Kebutuhan Pokok",
        image: "https://cdn-icons-png.flaticon.com/512/2938/2938499.png",
        stock: 30,
    },
    {
        id: 3,
        name: "Susu UHT",
        price: 8000,
        description:
            "Susu UHT rasa coklat 200ml. Susu siap minum dengan rasa coklat yang lezat, diperkaya vitamin dan mineral. Praktis dibawa ke mana saja untuk sumber energi instan.",
        category: "Minuman",
        image: "https://cdn-icons-png.flaticon.com/512/2739/2739178.png",
        stock: 100,
    },
    {
        id: 4,
        name: "Telur Ayam",
        price: 28000,
        description:
            "Telur ayam negeri 1 lusin. Sumber protein hewani yang murah dan mudah didapat. Cocok untuk berbagai olahan masakan.",
        category: "Kebutuhan Pokok",
        image: "https://cdn-icons-png.flaticon.com/512/3209/3209028.png",
        stock: 20,
    },
    {
        id: 5,
        name: "Kopi Instan",
        price: 9500,
        description:
            "Kopi instan sachet. Praktis untuk dinikmati kapan saja. Rasakan sensasi kopi nikmat di setiap tegukan.",
        category: "Minuman",
        image: "https://cdn-icons-png.flaticon.com/512/924/924765.png",
        stock: 75,
    },
    {
        id: 6,
        name: "Sabun Mandi",
        price: 7000,
        description:
            "Sabun mandi batangan dengan aroma lavender. Memberikan keharuman dan kesegaran sepanjang hari. Cocok untuk kulit sensitif.",
        category: "Perlengkapan Mandi",
        image: "https://cdn-icons-png.flaticon.com/512/3035/3035974.png",
        stock: 40,
    },
    {
        id: 7,
        name: "Pasta Gigi",
        price: 12000,
        description:
            "Pasta gigi dengan formula perlindungan total. Melindungi gigi dari gigi berlubang dan bau mulut. Nafas segar sepanjang hari.",
        category: "Perlengkapan Mandi",
        image: "https://cdn-icons-png.flaticon.com/512/575/575314.png",
        stock: 60,
    },
    {
        id: 8,
        name: "Deterjen Pakaian",
        price: 25000,
        description:
            "Deterjen bubuk konsentrat 500g. Membersihkan pakaian lebih bersih dan efektif. Pakaian wangi dan bebas noda membandel.",
        category: "Pembersih Rumah",
        image: "https://cdn-icons-png.flaticon.com/512/2553/2553655.png",
        stock: 25,
    },
    {
        id: 9,
        name: "Obat Nyamuk Semprot",
        price: 18000,
        description:
            "Obat nyamuk semprot efektif usir nyamuk dan serangga. Perlindungan maksimal untuk keluarga. Aman digunakan di dalam ruangan.",
        category: "Pembersih Rumah",
        image: "https://cdn-icons-png.flaticon.com/512/488/488737.png",
        stock: 35,
    },
    {
        id: 10,
        name: "Snack Kentang",
        price: 8500,
        description:
            "Snack kentang renyah dengan rasa balado. Cocok untuk camilan saat bersantai. Teman ngopi yang pas.",
        category: "Camilan",
        image: "https://cdn-icons-png.flaticon.com/512/820/820150.png",
        stock: 80,
    },
];

// Auth related DOM elements
const authButtons = document.getElementById("authButtons");
const accountMenu = document.getElementById("accountMenu");
const accountUsername = document.getElementById("accountUsername");
const logoutBtn = document.getElementById("logoutBtn");
const authModal = document.getElementById("authModal");
const closeAuthModal = document.getElementById("closeAuthModal");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const forgotPasswordForm = document.getElementById("forgotPasswordForm");
const otpVerificationForm = document.getElementById("otpVerificationForm");

// Input fields
const loginUsernameInput = document.getElementById("loginUsername");
const loginPasswordInput = document.getElementById("loginPassword");
const regUsernameInput = document.getElementById("regUsername");
const regNameInput = document.getElementById("regName");
const regEmailInput = document.getElementById("regEmail");
const regPhoneInput = document.getElementById("regPhone");
const regPasswordInput = document.getElementById("regPassword");
const forgotIdInput = document.getElementById("forgotId");
const otpInput = document.getElementById("otpInput");

// Messages/Errors
const loginError = document.getElementById("loginError");
const registerError = document.getElementById("registerError");
const forgotError = document.getElementById("forgotError");
const otpMessage = document.getElementById("otpMessage");
const otpError = document.getElementById("otpError");
const toast = document.getElementById("toast");

// Buttons to switch forms
const showRegisterFromLogin = document.getElementById("showRegisterFromLogin");
const showLoginFromRegister = document.getElementById("showLoginFromRegister");
const showForgotFromLogin = document.getElementById("showForgotFromLogin");
const showLoginFromForgot = document.getElementById("showLoginFromForgot");
const showLoginFromOtp = document.getElementById("showLoginFromOtp");

// Buttons for form submission
const btnLoginSubmit = document.getElementById("btnLoginSubmit");
const btnRegisterSubmit = document.getElementById("btnRegisterSubmit");
const btnResetPassword = document.getElementById("btnResetPassword");
const btnVerifyOtp = document.getElementById("btnVerifyOtp");
const btnResendOtp = document.getElementById("btnResendOtp");

// Temporary storage for user identifier during OTP flow
let currentOtpUserIdentifier = null;

// Product Detail Modal DOM elements
const productDetailModal = document.getElementById("productDetailModal");
const closeDetailModal = document.getElementById("closeDetailModal");
const modalProductImage = document.getElementById("modalProductImage");
const modalProductName = document.getElementById("modalProductName");
const modalProductDescription = document.getElementById("modalProductDescription");
const modalProductPrice = document.getElementById("modalProductPrice");
const modalProductStock = document.getElementById("modalProductStock");
const modalAddToCartBtn = document.getElementById("modalAddToCartBtn");

// Dashboard specific DOM elements (hanya akan ada di dashboard.html)
const catalogContainer = document.getElementById("catalog");
const categoryFilter = document.getElementById("categoryFilter");
const searchInput = document.getElementById("searchInput");


// --- Global Utility Functions ---

/**
 * Displays a toast notification.
 * @param {string} message - The message to display.
 * @param {string} type - 'success', 'error', or 'info'.
 */
window.showToast = function (message, type = "info") {
    if (!toast) return;
    toast.textContent = message;
    toast.className = "toast show " + type;
    setTimeout(() => {
        toast.className = toast.className.replace("show", "");
    }, 3000);
};

/**
 * Retrieves the CSRF token from cookies.
 * @returns {string} The CSRF token.
 */
window.getCsrfToken = function () {
    const name = "csrftoken";
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
        const [key, value] = cookie.trim().split("=");
        if (key === name) return value;
    }
    return "";
};

/**
 * Shows a specific authentication form (login, register, forgot password, otp verification) in the modal.
 * @param {string} formName - 'login', 'register', 'forgot', or 'otp'.
 */
window.showForm = function (formName) {
    if (loginForm) loginForm.style.display = "none";
    if (registerForm) registerForm.style.display = "none";
    if (forgotPasswordForm) forgotPasswordForm.style.display = "none";
    if (otpVerificationForm) otpVerificationForm.style.display = "none";

    // Clear all error/info messages
    if (loginError) loginError.textContent = "";
    if (registerError) registerError.textContent = "";
    if (forgotError) forgotError.textContent = "";
    if (otpMessage) otpMessage.textContent = "";
    if (otpError) otpError.textContent = "";

    if (formName === "login" && loginForm) {
        loginForm.style.display = "block";
    } else if (formName === "register" && registerForm) {
        registerForm.style.display = "block";
    } else if (formName === "forgot" && forgotPasswordForm) {
        forgotPasswordForm.style.display = "block";
    } else if (formName === "otp" && otpVerificationForm) {
        otpVerificationForm.style.display = "block";
    }
};

/**
 * Shows the login modal.
 */
window.showLoginModal = function () {
    if (authModal) authModal.style.display = "flex";
    window.showForm("login");
};

/**
 * Updates UI elements related to login status.
 * @param {boolean} isAuthenticated - True if user is authenticated, false otherwise.
 * @param {object|null} userData - The user object if authenticated, null otherwise.
 */
function updateLoginUI(isAuthenticated, userData = null) {
    if (authButtons) {
        authButtons.style.display = isAuthenticated ? "none" : "flex";
    }
    if (accountMenu) {
        accountMenu.style.display = isAuthenticated ? "flex" : "none";
    }
    if (accountUsername) {
        accountUsername.textContent = userData ? userData.username || userData.name || "Pengguna" : "";
    }
    updateAddToCartButtonsVisibility(isAuthenticated);
}

/**
 * Checks login status with the backend and updates the UI.
 * This is the primary way to determine user's login state.
 */
window.checkLoginStatus = async function () {
    try {
        const response = await fetch("/api/get_current_user/", {
            method: "GET",
            credentials: "include", // Essential for sending session cookies
        });
        const data = await response.json();

        if (data.is_authenticated) {
            updateLoginUI(true, data); // Pass entire user data
        } else {
            updateLoginUI(false);
        }
        
        // Trigger re-render of cart, profile, and order history if functions exist
        // These checks prevent errors if scripts are not loaded on a particular page
        if (typeof window.renderCart === 'function') {
            window.renderCart();
        }
        if (typeof window.loadUserProfile === 'function') {
            window.loadUserProfile();
        }
        if (typeof window.loadOrderHistory === 'function') {
            window.loadOrderHistory();
        }

    } catch (error) {
        console.error("Error checking login status:", error);
        window.showToast("Gagal memeriksa status login.", "error");
        updateLoginUI(false); // Assume logged out on error
    }
};

/**
 * Sends OTP to the provided identifier (email/username).
 * @param {string} emailOrUsername - The user's email or username.
 */
async function sendOtpToBackend(emailOrUsername) {
    currentOtpUserIdentifier = emailOrUsername;

    try {
        const response = await fetch("/api/send_otp/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": window.getCsrfToken(),
            },
            body: JSON.stringify({ email_or_username: emailOrUsername }),
        });

        const result = await response.json();
        if (response.ok && result.success) {
            window.showToast(result.message || "OTP berhasil dikirim.", "success");
            window.showForm("otp");
            if (otpMessage) otpMessage.textContent = `OTP telah dikirim ke ${emailOrUsername}. Silakan cek.`;
        } else {
            window.showToast(result.message || "Gagal mengirim OTP.", "error");
            if (otpError) otpError.textContent = result.message || "Gagal mengirim OTP.";
        }
    } catch (error) {
        console.error("Error sending OTP:", error);
        window.showToast("Terjadi kesalahan saat mengirim OTP.", "error");
    }
}

/**
 * Verifies the entered OTP with the backend.
 */
async function verifyOtpWithBackend() {
    const enteredOtp = otpInput?.value.trim();
    const userIdentifier = currentOtpUserIdentifier;

    if (otpError) otpError.textContent = "";

    if (!enteredOtp || !userIdentifier) {
        if (otpError) otpError.textContent = "Mohon masukkan OTP dan identitas pengguna.";
        return;
    }

    try {
        const response = await fetch("/api/verify_otp/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": window.getCsrfToken(),
            },
            body: JSON.stringify({
                email_or_username: userIdentifier,
                otp_code: enteredOtp,
            }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
            window.showToast(data.message, "success");
            if (authModal) authModal.style.display = "none";
            window.showForm("login"); // Assume successful verification means user can now log in
            otpInput.value = "";
            currentOtpUserIdentifier = null;
            await window.checkLoginStatus(); // Re-check login status
        } else {
            if (otpError) otpError.textContent = data.message || "OTP tidak valid.";
            window.showToast(data.message || "Verifikasi OTP gagal.", "error");
        }
    } catch (err) {
        console.error("OTP verification error:", err);
        if (otpError) otpError.textContent = "Terjadi kesalahan. Coba lagi.";
        window.showToast("Terjadi kesalahan saat memverifikasi OTP.", "error");
    }
}

/**
 * Updates visibility of "Add to Cart" buttons based on login status.
 * This needs to query the *actual* login status, not just rely on local storage.
 */
async function updateAddToCartButtonsVisibility(isLoggedIn) {
    document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
        btn.style.display = isLoggedIn ? "block" : "none";
    });
    if (modalAddToCartBtn) {
        modalAddToCartBtn.style.display = isLoggedIn ? "block" : "none";
    }
}


// --- Product Catalog and Detail Functions (Dashboard Specific) ---

/**
 * Renders products into the catalog container.
 * @param {Array<object>} filteredProducts - Products to render.
 */
async function renderProducts(filteredProducts) {
    if (!catalogContainer) return; // Only execute if on dashboard page

    catalogContainer.innerHTML = "";
    if (filteredProducts.length === 0) {
        catalogContainer.innerHTML =
            '<p style="text-align: center; color: #6c757d; font-size: 1.1em; padding: 50px;">Tidak ada produk yang ditemukan.</p>';
        return;
    }

    // Get current login status dynamically for button visibility
    const response = await fetch("/api/get_current_user/", { method: "GET", credentials: "include" });
    const userData = await response.json();
    const isLoggedIn = userData.is_authenticated;

    filteredProducts.forEach((product) => {
        const productCard = document.createElement("div");
        productCard.className = "product-card";

        const truncatedDescription =
            product.description.length > 70
                ? product.description.substring(0, 70) + "..."
                : product.description;

        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" />
            <h4>${product.name}</h4>
            <p class="product-price">Rp ${product.price.toLocaleString("id-ID")}</p>
            <p>${truncatedDescription}</p>
            <button class="btn btn-primary add-to-cart-btn" data-id="${product.id}" style="display: ${isLoggedIn ? 'block' : 'none'};">+ Keranjang</button>
        `;
        catalogContainer.appendChild(productCard);

        const elementsToClickForDetail = productCard.querySelectorAll(
            "img, h4, p:not(.product-price), .product-badge"
        );
        elementsToClickForDetail.forEach((el) => {
            el.addEventListener("click", () => showProductDetail(product.id));
        });

        const addToCartBtn = productCard.querySelector(".add-to-cart-btn");
        if (addToCartBtn) {
            addToCartBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                window.addToCart(parseInt(e.target.dataset.id));
            });
        }
    });
}

/**
 * Shows the product detail modal.
 * @param {number} productId - The ID of the product to display.
 */
async function showProductDetail(productId) {
    const product = products.find((p) => p.id === productId);
    if (!product || !productDetailModal) return;

    modalProductImage.src = product.image;
    modalProductName.textContent = product.name;
    modalProductDescription.textContent = product.description;
    modalProductPrice.textContent = `Rp ${product.price.toLocaleString("id-ID")}`;
    modalProductStock.textContent =
        product.stock !== undefined ? product.stock : "N/A";
    modalAddToCartBtn.dataset.productId = product.id;

    // Check login status for modal button visibility
    const response = await fetch("/api/get_current_user/", { method: "GET", credentials: "include" });
    const userData = await response.json();
    modalAddToCartBtn.style.display = userData.is_authenticated ? "block" : "none";

    productDetailModal.style.display = "flex";
}

// Close product detail modal
if (closeDetailModal) {
    closeDetailModal.addEventListener("click", () => {
        if (productDetailModal) productDetailModal.style.display = "none";
    });
}

// Add to cart from modal
if (modalAddToCartBtn) {
    modalAddToCartBtn.addEventListener("click", async (event) => {
        const productId = parseInt(event.target.dataset.productId);
        await window.addToCart(productId);
        if (productDetailModal) productDetailModal.style.display = "none";
    });
}

// --- Cart Management Functions (Globalized for use across pages) ---
// Note: Cart items themselves are still in LocalStorage as per previous design.
// If you want cart to also be in DB, that requires significant backend work.
// This example keeps cart in LocalStorage for simplicity on frontend,
// but ensures login status check before allowing cart operations.

/**
 * Adds a product to the user's cart in LocalStorage.
 * Requires user to be logged in.
 * @param {number} productId - The ID of the product to add.
 */
window.addToCart = async function (productId) {
    const response = await fetch("/api/get_current_user/", { method: "GET", credentials: "include" });
    const userData = await response.json();

    if (!userData.is_authenticated) {
        window.showToast(
            "Silakan login untuk menambahkan produk ke keranjang.",
            "error"
        );
        window.showLoginModal();
        return;
    }

    const product = products.find((p) => p.id === productId);
    if (!product) {
        window.showToast("Produk tidak ditemukan.", "error");
        return;
    }

    // Use the actual username from the backend response for the cart key
    const username = userData.username;
    const cartKey = `cart_${username}`;
    let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

    const existingCartItem = cart.find((item) => item.id === productId);

    const productStock = product.stock !== undefined ? product.stock : 1000;

    if (existingCartItem) {
        if (existingCartItem.quantity < productStock) {
            existingCartItem.quantity++;
            window.showToast(`Menambahkan ${product.name} ke keranjang.`, "success");
        } else {
            window.showToast(`Stok ${product.name} terbatas.`, "error");
        }
    } else {
        if (productStock > 0) {
            cart.push({ ...product, quantity: 1 });
            window.showToast(`${product.name} ditambahkan ke keranjang.`, "success");
        } else {
            window.showToast(`${product.name} sedang tidak tersedia.`, "error");
        }
    }
    localStorage.setItem(cartKey, JSON.stringify(cart));
    
    // Optionally, trigger a cart re-render if on the cart page
    if (typeof window.renderCart === 'function') {
        window.renderCart();
    }
};

// Expose products globally for other scripts like cart.js
window.products = products;


// --- Event Listeners and Initializations ---

document.addEventListener("DOMContentLoaded", function () {
    // Initial check of login status from backend and update UI
    window.checkLoginStatus();

    // Show login form by default when modal is opened
    window.showForm("login");

    // Event listeners for auth buttons in header
    const btnLoginHeader = document.getElementById("btnLogin");
    const btnRegisterHeader = document.getElementById("btnRegister");
    if (btnLoginHeader)
        btnLoginHeader.addEventListener("click", window.showLoginModal);
    if (btnRegisterHeader)
        btnRegisterHeader.addEventListener("click", () => {
            window.showLoginModal(); // Tetap panggil showLoginModal dulu
            window.showForm("register"); // Lalu ganti ke form register
        });

    // Event listeners for form switching within the modal
    if (showRegisterFromLogin)
        showRegisterFromLogin.addEventListener("click", (e) => { e.preventDefault(); window.showForm("register"); });
    if (showLoginFromRegister)
        showLoginFromRegister.addEventListener("click", (e) => { e.preventDefault(); window.showForm("login"); });
    if (showForgotFromLogin)
        showForgotFromLogin.addEventListener("click", (e) => { e.preventDefault(); window.showForm("forgot"); });
    if (showLoginFromForgot)
        showLoginFromForgot.addEventListener("click", (e) => { e.preventDefault(); window.showForm("login"); });
    if (showLoginFromOtp)
        showLoginFromOtp.addEventListener("click", (e) => { e.preventDefault(); window.showForm("login"); });

    // Event listener for account menu dropdown
    const accountDropdown = document.getElementById("accountDropdown");
    if (accountMenu && accountDropdown) {
        accountMenu.addEventListener("click", function (e) {
            accountDropdown.style.display =
                accountDropdown.style.display === "block" ? "none" : "block";
            e.stopPropagation();
        });

        // Close dropdown if clicked outside
        document.addEventListener("click", function (e) {
            if (
                !accountMenu.contains(e.target) &&
                accountDropdown.style.display === "block"
            ) {
                accountDropdown.style.display = "none";
            }
        });
    }

    // Logout button (Delegated to Django logout endpoint)
    if (logoutBtn) {
        logoutBtn.addEventListener("click", async () => {
            try {
                const response = await fetch("/api/logout/", {
                    method: "POST", // Django logout is typically POST for security
                    headers: {
                        "X-CSRFToken": window.getCsrfToken(),
                    },
                    credentials: "include",
                });
                const data = await response.json();
                if (response.ok && data.success) {
                    window.showToast(data.message || "Anda telah logout.", "info");
                    
                    // Clear all user-specific cart data from local storage on logout
                    // This is important because the cart is still localStorage-based
                    for (let i = 0; i < localStorage.length; i++) {
                        const key = localStorage.key(i);
                        if (key.startsWith("cart_")) {
                            localStorage.removeItem(key);
                        }
                    }

                    await window.checkLoginStatus(); // Update UI based on logged-out state, and trigger other renders
                    // Optionally redirect
                    // window.location.href = "/"; // Redirect to home/dashboard
                } else {
                    window.showToast(data.message || "Gagal logout.", "error");
                }
            } catch (error) {
                console.error("Logout error:", error);
                window.showToast("Terjadi kesalahan saat logout.", "error");
            }
        });
    }


    // Close auth modal
    if (closeAuthModal) {
        closeAuthModal.addEventListener("click", () => {
            if (authModal) authModal.style.display = "none";
            // Clear temporary OTP data when modal is closed manually
            currentOtpUserIdentifier = null;
            if (otpInput) otpInput.value = "";
            if (otpMessage) otpMessage.textContent = "";
            if (otpError) otpError.textContent = "";
        });
    }

    // Auth form submissions
    if (btnLoginSubmit) {
        btnLoginSubmit.addEventListener("click", async (e) => {
            e.preventDefault();
            const username = loginUsernameInput.value.trim();
            const password = loginPasswordInput.value;

            if (!username || !password) {
                if (loginError) loginError.textContent = "Username/Email/Phone dan password harus diisi.";
                window.showToast("Login gagal!", "error");
                return;
            }

            try {
                const response = await fetch("/api/login/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": window.getCsrfToken(),
                    },
                    credentials: "include",
                    body: JSON.stringify({ username, password }),
                });
                const data = await response.json();

                if (response.ok && data.success) {
                    if (loginError) loginError.textContent = "";
                    window.showToast(data.message || "Login berhasil!", "success");
                    if (authModal) authModal.style.display = "none";
                    // After successful login, trigger checkLoginStatus to update UI and fetch profile/cart
                    await window.checkLoginStatus();
                } else {
                    if (loginError) loginError.textContent = data.message;
                    window.showToast("Login gagal!", "error");
                    if (data.message && data.message.includes("Account not activated")) {
                        currentOtpUserIdentifier = username; // Use login username as identifier for OTP
                        if (otpMessage) otpMessage.textContent = "Akun belum diaktivasi. Mohon verifikasi email/telepon Anda dengan OTP.";
                        window.showForm("otp");
                    }
                }
            } catch (error) {
                console.error("Login error:", error);
                if (loginError) loginError.textContent = "Terjadi kesalahan saat login.";
                window.showToast("Terjadi kesalahan saat login.", "error");
            }
        });
    }

    if (btnRegisterSubmit) {
        btnRegisterSubmit.addEventListener("click", async (e) => {
            e.preventDefault();
            const username = regUsernameInput.value.trim();
            const name = regNameInput.value.trim();
            const email = regEmailInput.value.trim();
            const phone = regPhoneInput.value.trim();
            const password = regPasswordInput.value;

            if (!username || !name || !email || !phone || !password) {
                if (registerError) registerError.textContent = "Semua field harus diisi.";
                window.showToast("Pendaftaran gagal!", "error");
                return;
            }

            try {
                const response = await fetch("/api/register/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": window.getCsrfToken(),
                    },
                    body: JSON.stringify({ username, email, password, phone, name }),
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    if (registerError) registerError.textContent = "";
                    window.showToast(data.message || "Pendaftaran berhasil! Silakan verifikasi akun Anda dengan OTP.", "success");
                    // Set the identifier for OTP verification to the registered email
                    currentOtpUserIdentifier = email;
                    if (otpMessage) otpMessage.textContent = data.message;
                    window.showForm("otp"); // Show OTP form immediately after successful registration
                } else {
                    if (registerError) registerError.textContent = data.message;
                    window.showToast("Pendaftaran gagal!", "error");
                }
            } catch (error) {
                console.error("Registration error:", error);
                if (registerError) registerError.textContent = "Terjadi kesalahan saat pendaftaran.";
                window.showToast("Terjadi kesalahan saat pendaftaran.", "error");
            }
        });
    }

    if (btnResetPassword) {
        btnResetPassword.addEventListener("click", async (e) => {
            e.preventDefault();
            const emailOrUsername = forgotIdInput.value.trim();

            if (!emailOrUsername) {
                if (forgotError) forgotError.textContent = "Masukkan Username / Email / No. Telepon Anda.";
                return;
            }
            sendOtpToBackend(emailOrUsername); // Use the dedicated function for sending OTP
        });
    }

    if (btnVerifyOtp) {
        btnVerifyOtp.addEventListener("click", async (e) => {
            e.preventDefault();
            verifyOtpWithBackend(); // Use the dedicated function for verifying OTP
        });
    }

    if (btnResendOtp) {
        btnResendOtp.addEventListener("click", () => {
            if (currentOtpUserIdentifier) {
                sendOtpToBackend(currentOtpUserIdentifier);
            } else {
                if (otpError) otpError.textContent = "Tidak ada identitas pengguna yang tersimpan untuk mengirim ulang OTP.";
                window.showToast("Gagal mengirim ulang OTP.", "error");
            }
        });
    }

    // --- Dashboard Specific Logic (only if elements exist) ---

    // Populate categories in the filter dropdown
    if (categoryFilter) {
        const categories = [...new Set(products.map((p) => p.category))];
        categoryFilter.innerHTML = '<option value="all">Semua Kategori</option>';
        categories.forEach((category) => {
            const option = document.createElement("option");
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });

        // Filter products when category changes
        categoryFilter.addEventListener("change", () => filterAndSearchProducts());
    }

    // Search functionality in header
    if (searchInput) {
        const urlParams = new URLSearchParams(window.location.search);
        const initialSearchTerm = urlParams.get('search');
        if (initialSearchTerm) {
            searchInput.value = initialSearchTerm;
        }

        searchInput.addEventListener("input", () => {
            if (catalogContainer) { // Only filter in place if on the dashboard page
                filterAndSearchProducts();
            }
        });

        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                const term = searchInput.value.trim();
                if (term) {
                    window.location.href = `/?search=${encodeURIComponent(term)}`;
                } else {
                    window.location.href = `/`;
                }
            }
        });
    }

    // Combined filter and search function
    function filterAndSearchProducts() {
        const selectedCategory = categoryFilter ? categoryFilter.value : "all";
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : "";

        let filtered = products;

        if (selectedCategory !== "all") {
            filtered = filtered.filter(
                (product) => product.category === selectedCategory
            );
        }

        if (searchTerm) {
            filtered = filtered.filter(
                (product) =>
                    product.name.toLowerCase().includes(searchTerm) ||
                    product.description.toLowerCase().includes(searchTerm) ||
                    product.category.toLowerCase().includes(searchTerm)
            );
        }
        renderProducts(filtered);
    }

    // Initial product rendering on dashboard load
    if (catalogContainer) {
        const urlParams = new URLSearchParams(window.location.search);
        const initialSearchTerm = urlParams.get('search');
        if (initialSearchTerm) {
            const selectedCategory = categoryFilter ? categoryFilter.value : "all";
            let filtered = products;
            if (selectedCategory !== "all") {
                filtered = filtered.filter(
                    (product) => product.category === selectedCategory
                );
            }
            filtered = filtered.filter(
                (product) =>
                    product.name.toLowerCase().includes(initialSearchTerm.toLowerCase()) ||
                    product.description.toLowerCase().includes(initialSearchTerm.toLowerCase()) ||
                    product.category.toLowerCase().includes(initialSearchTerm.toLowerCase())
            );
            renderProducts(filtered);
        } else {
            renderProducts(products);
        }
    }
});