// dashboard.js - This file will contain global functions and dashboard specific logic
console.log("dashboard.js loaded");

// Global variables (mock data for products - still used for frontend display)
// NOTE: In a real e-commerce app, products would ideally be fetched from backend API
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

// Forms
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const forgotPasswordForm = document.getElementById("forgotPasswordForm");
const otpVerificationForm = document.getElementById("otpVerificationForm");

// Form inputs
const loginUsernameInput = document.getElementById("loginUsername");
const loginPasswordInput = document.getElementById("loginPassword");
const regUsernameInput = document.getElementById("regUsername");
const regNameInput = document.getElementById("regName");
const regEmailInput = document.getElementById("regEmail");
const regPhoneInput = document.getElementById("regPhone");
const regPasswordInput = document.getElementById("regPassword");
const forgotIdInput = document.getElementById("forgotId"); // for email/username/phone in forgot password
const otpInput = document.getElementById("otpInput"); // General OTP input field

// Error/Message displays
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
const showLoginFromOtpLink = document.getElementById("showLoginFromOtp");

// Buttons for form submissions (re-declared for clarity inside DOMContentLoaded)
let btnLoginSubmit;
let btnRegisterSubmit;
let btnResetPassword; // For sending OTP in forgot password flow
let btnVerifyOtp;
let btnResendOtp;

// Product Detail Modal DOM elements
const productDetailModal = document.getElementById("productDetailModal");
const closeDetailModal = document.getElementById("closeDetailModal");
const modalProductImage = document.getElementById("modalProductImage");
const modalProductName = document.getElementById("modalProductName");
const modalProductDescription = document.getElementById(
  "modalProductDescription"
);
const modalProductPrice = document.getElementById("modalProductPrice");
const modalProductStock = document.getElementById("modalProductStock");
const modalAddToCartBtn = document.getElementById("modalAddToCartBtn");

// Dashboard specific DOM elements
const catalogContainer = document.getElementById("catalog");
const categoryFilter = document.getElementById("categoryFilter");
const searchInput = document.getElementById("searchInput");
const accountDropdown = document.getElementById("accountDropdown");

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
 * Shows a specific authentication form (login, register, forgot password, otp verification) in the modal.
 * Clears previous error/info messages.
 * @param {HTMLElement} formElement - The DOM element of the form to show.
 */
function showForm(formElement) {
  const allForms = document.querySelectorAll(".auth-form");
  allForms.forEach((form) => {
    form.style.display = "none";
  });
  if (formElement) {
    formElement.style.display = "block";
  }

  // Clear all error/info messages
  if (loginError) loginError.textContent = "";
  if (registerError) registerError.textContent = "";
  if (forgotError) forgotError.textContent = "";
  if (otpMessage) otpMessage.textContent = "";
  if (otpError) otpError.textContent = "";
}

/**
 * Shows the login modal.
 */
window.showLoginModal = function () {
  if (authModal) authModal.style.display = "flex";
  showForm(loginForm);
};

/**
 * Shows the register modal.
 */
window.showRegisterModal = function () {
  if (authModal) authModal.style.display = "flex";
  showForm(registerForm);
};

/**
 * Shows the forgot password modal.
 */
window.showForgotPasswordModal = function () {
  if (authModal) authModal.style.display = "flex";
  showForm(forgotPasswordForm);
};

/**
 * CSRF token retrieval for Django POST requests.
 */
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// Global variable to store the identifier for OTP re-sending
let currentOtpUserIdentifier = null;

// --- Authentication and User Management (Django Backend) ---

/**
 * Checks login status with backend and updates UI.
 */
async function checkLoginStatus() {
  try {
    const response = await fetch("/api/get_current_user/", {
      method: "GET",
      credentials: "include", // Essential for sending session cookies
    });
    const data = await response.json();

    if (data.is_authenticated) {
      if (authButtons) authButtons.style.display = "none";
      if (accountMenu) accountMenu.style.display = "block";
      if (accountUsername) accountUsername.textContent = data.username;
      updateAddToCartButtonsVisibility(true);
    } else {
      if (authButtons) authButtons.style.display = "block";
      if (accountMenu) accountMenu.style.display = "none";
      updateAddToCartButtonsVisibility(false);
    }
  } catch (error) {
    console.error("Failed to check login status:", error);
    // Even if error, assume not logged in to hide sensitive UI elements
    if (authButtons) authButtons.style.display = "block";
    if (accountMenu) accountMenu.style.display = "none";
    updateAddToCartButtonsVisibility(false);
  }
}

/**
 * Handles user logout.
 */
window.logout = async function () {
  try {
    const response = await fetch("/api/logout/", {
      method: "POST", // Use POST for logout for security reasons
      headers: {
        "X-CSRFToken": getCookie("csrftoken"),
      },
      credentials: "include",
    });

    const data = await response.json();
    if (response.ok && data.success) {
      window.showToast("Anda telah logout.", "info");
      // Redirect or reload to reflect logout state
      window.location.reload();
    } else {
      window.showToast(data.message || "Gagal logout.", "error");
    }
  } catch (error) {
    console.error("Logout error:", error);
    window.showToast("Terjadi kesalahan saat logout.", "error");
  }
};

/**
 * Sends OTP to the specified email/username.
 * @param {string} emailOrUsername - The identifier for sending OTP.
 */
async function sendOtp(emailOrUsername) {
  // Store the identifier globally for potential resend
  currentOtpUserIdentifier = emailOrUsername;

  if (otpMessage) otpMessage.textContent = "";
  if (otpError) otpError.textContent = "";

  try {
    const response = await fetch("/api/send_otp/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
      },
      body: JSON.stringify({ email_or_username: emailOrUsername }),
    });

    const result = await response.json();
    if (response.ok && result.success) {
      window.showToast(result.message || "OTP berhasil dikirim.", "success");
      // Set message in OTP form, e.g., "OTP sent to your_email@example.com"
      if (otpMessage)
        otpMessage.textContent = `OTP telah dikirim ke ${emailOrUsername}.`;
      showForm(otpVerificationForm); // Show OTP form
    } else {
      window.showToast(result.message || "Gagal mengirim OTP.", "error");
      if (otpError) otpError.textContent = result.message || "Gagal mengirim OTP.";
    }
  } catch (error) {
    console.error("Error sending OTP:", error);
    window.showToast("Terjadi kesalahan saat mengirim OTP.", "error");
    if (otpError) otpError.textContent = "Terjadi kesalahan koneksi saat mengirim OTP.";
  }
}

/**
 * Verifies the entered OTP code.
 */
async function verifyOtp() {
  const enteredOtp = otpInput.value.trim();
  const identifier = currentOtpUserIdentifier; // Use the globally stored identifier

  if (otpError) otpError.textContent = "";

  if (!enteredOtp) {
    if (otpError) otpError.textContent = "Mohon masukkan OTP.";
    return;
  }

  if (!identifier) {
    if (otpError) otpError.textContent = "Identitas pengguna untuk OTP tidak ditemukan.";
    window.showToast("Identitas pengguna tidak ditemukan, coba lagi dari awal.", "error");
    return;
  }

  try {
    const response = await fetch("/api/verify_otp/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
      },
      body: JSON.stringify({
        email_or_username: identifier,
        otp_code: enteredOtp,
      }),
    });

    const result = await response.json();

    if (response.ok && result.success) {
      window.showToast(result.message, "success");
      // If OTP for registration, redirect to login.
      // If OTP for password reset, you might redirect to a reset password page or show new password form.
      // For simplicity, let's assume both redirect to login for now.
      showForm(loginForm);
      // Clear OTP input and stored identifier
      otpInput.value = "";
      currentOtpUserIdentifier = null;
      if (authModal) authModal.style.display = "none";
    } else {
      if (otpError) otpError.textContent = result.message || "OTP tidak valid.";
      window.showToast(result.message || "Verifikasi OTP gagal.", "error");
    }
  } catch (err) {
    console.error("OTP verification error:", err);
    if (otpError) otpError.textContent = "Terjadi kesalahan saat memverifikasi OTP.";
    window.showToast("Kesalahan sistem saat verifikasi.", "error");
  }
}

// --- Product Catalog and Detail Functions ---

/**
 * Renders products into the catalog container.
 * @param {Array<object>} filteredProducts - Products to render.
 */
function renderProducts(filteredProducts) {
  if (!catalogContainer) return;

  catalogContainer.innerHTML = "";
  if (filteredProducts.length === 0) {
    catalogContainer.innerHTML =
      '<p style="text-align: center; color: #6c757d; font-size: 1.1em; padding: 50px;">Tidak ada produk yang ditemukan.</p>';
    return;
  }

  // No longer rely on localStorage for currentUser here.
  // The visibility of "Add to Cart" buttons is handled by `updateAddToCartButtonsVisibility`.

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
            <p class="product-price">Rp ${product.price.toLocaleString(
              "id-ID"
            )}</p>
            <p>${truncatedDescription}</p>
            <button class="btn btn-primary add-to-cart-btn" data-id="${
              product.id
            }">+ Keranjang</button>
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
        e.stopPropagation(); // Prevent product detail modal from opening
        window.addToCart(parseInt(e.target.dataset.id));
      });
    }
  });
  // After rendering, ensure button visibility is correct based on global login state
  checkLoginStatus(); // Re-check after products are rendered
}

/**
 * Shows/hides "Add to Cart" buttons globally.
 * This function is called by checkLoginStatus and updateAuthUI.
 * @param {boolean} isLoggedIn - True if user is logged in, false otherwise.
 */
function updateAddToCartButtonsVisibility(isLoggedIn) {
  document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
    btn.style.display = isLoggedIn ? "block" : "none";
  });
  if (modalAddToCartBtn) {
    modalAddToCartBtn.style.display = isLoggedIn ? "block" : "none";
  }
}

/**
 * Shows the product detail modal.
 * @param {number} productId - The ID of the product to display.
 */
function showProductDetail(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product || !productDetailModal) return;

  modalProductImage.src = product.image;
  modalProductName.textContent = product.name;
  modalProductDescription.textContent = product.description;
  modalProductPrice.textContent = `Rp ${product.price.toLocaleString("id-ID")}`;
  modalProductStock.textContent =
    product.stock !== undefined ? product.stock : "N/A";
  modalAddToCartBtn.dataset.productId = product.id;

  // The visibility of this button will be managed by updateAddToCartButtonsVisibility
  // after a login status check.
  // modalAddToCartBtn.style.display = 'block'; // This was previously hardcoded.
  // Now it will be correctly set by checkLoginStatus which calls updateAddToCartButtonsVisibility

  productDetailModal.style.display = "flex";
  checkLoginStatus(); // Re-check status to correctly show/hide modalAddToCartBtn
}

// Close product detail modal
if (closeDetailModal) {
  closeDetailModal.addEventListener("click", () => {
    if (productDetailModal) productDetailModal.style.display = "none";
  });
}

// Add to cart from modal
if (modalAddToCartBtn) {
  modalAddToCartBtn.addEventListener("click", (event) => {
    const productId = parseInt(event.target.dataset.productId);
    window.addToCart(productId);
    if (productDetailModal) productDetailModal.style.display = "none"; // Close modal after adding
  });
}

// --- Cart Management Functions ---

/**
 * Adds a product to the user's cart (localStorage for simplicity, but ideally backend).
 * @param {number} productId - The ID of the product to add.
 */
window.addToCart = function (productId) {
  // Instead of localStorage.getItem("currentUser"), check live status
  // or rely on the UI already hiding the button if not logged in.
  // For robustness, you might want to call checkLoginStatus here again.
  // Or, when a user clicks, if not logged in, prompt login.

  // Since we rely on the button being hidden if not logged in,
  // this function assumes the user IS logged in if they can click.
  // However, for API calls, the backend will verify authentication.

  // This part of cart logic still uses localStorage as per your original code.
  // If your Django backend also manages the cart, this needs to be an API call.
  // For this fix, I'm keeping the localStorage cart logic as it was.
  // If you have a Django cart API, replace this with an AJAX call.

  // Dummy user for local storage cart if not using backend cart
  // You might want to make this dynamic from Django's current user
  const currentUserDummy = { username: "guest" }; // Fallback
  // If you have `data.username` from `checkLoginStatus`, use that.
  // For now, let's just make sure the UI part is correct.

  // Check login status explicitly for cart operation
  fetch("/api/get_current_user/")
    .then((res) => res.json())
    .then((data) => {
      if (!data.is_authenticated) {
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

      const cartKey = `cart_${data.username}`; // Use actual username from backend
      let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

      const existingCartItem = cart.find((item) => item.id === productId);

      const productStock = product.stock !== undefined ? product.stock : 1000;

      if (existingCartItem) {
        if (existingCartItem.quantity < productStock) {
          existingCartItem.quantity++;
          window.showToast(
            `Menambahkan ${product.name} ke keranjang.`,
            "success"
          );
        } else {
          window.showToast(`Stok ${product.name} terbatas.`, "error");
        }
      } else {
        if (productStock > 0) {
          cart.push({ ...product, quantity: 1 });
          window.showToast(
            `${product.name} ditambahkan ke keranjang.`,
            "success"
          );
        } else {
          window.showToast(`${product.name} sedang tidak tersedia.`, "error");
        }
      }
      localStorage.setItem(cartKey, JSON.stringify(cart));
      // Optionally, update a cart count icon in the header if you have one
    })
    .catch((error) => {
      console.error("Error checking login status for cart:", error);
      window.showToast(
        "Terjadi kesalahan. Silakan coba lagi.",
        "error"
      );
    });
};

// --- Event Listeners and Initializations ---

document.addEventListener("DOMContentLoaded", function () {
  // Ensure all DOM elements are loaded before attaching listeners
  btnLoginSubmit = document.getElementById("btnLoginSubmit");
  btnRegisterSubmit = document.getElementById("btnRegisterSubmit");
  btnResetPassword = document.getElementById("btnResetPassword");
  btnVerifyOtp = document.getElementById("btnVerifyOtp");
  btnResendOtp = document.getElementById("btnResendOtp");

  // Initial load of user data and update UI
  checkLoginStatus(); // Call this once on page load

  // Event listeners for auth buttons in header
  const btnLoginHeader = document.getElementById("btnLogin");
  const btnRegisterHeader = document.getElementById("btnRegister");
  if (btnLoginHeader)
    btnLoginHeader.addEventListener("click", window.showLoginModal);
  if (btnRegisterHeader)
    btnRegisterHeader.addEventListener("click", window.showRegisterModal);

  // Event listeners for form switching
  if (showRegisterFromLogin)
    showRegisterFromLogin.addEventListener("click", () =>
      showForm(registerForm)
    );
  if (showLoginFromRegister)
    showLoginFromRegister.addEventListener("click", () => showForm(loginForm));
  if (showForgotFromLogin)
    showForgotFromLogin.addEventListener("click", () =>
      showForm(forgotPasswordForm)
    );
  if (showLoginFromForgot)
    showLoginFromForgot.addEventListener("click", () => showForm(loginForm));
  if (showLoginFromOtpLink)
    showLoginFromOtpLink.addEventListener("click", () => showForm(loginForm));

  // Event listener for account menu dropdown
  if (accountMenu && accountDropdown) {
    accountMenu.addEventListener("click", function (e) {
      accountDropdown.style.display =
        accountDropdown.style.display === "block" ? "none" : "block";
      e.stopPropagation(); // Prevent document click from closing it immediately
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

  // Logout button (now correctly calls the global window.logout)
  if (logoutBtn) logoutBtn.addEventListener("click", window.logout);

  // Close auth modal
  if (closeAuthModal) {
    closeAuthModal.addEventListener("click", () => {
      if (authModal) authModal.style.display = "none";
      // Clear OTP-related data when modal is closed
      currentOtpUserIdentifier = null;
      otpInput.value = "";
      if (otpMessage) otpMessage.textContent = "";
      if (otpError) otpError.textContent = "";
    });
  }

  // Initial form display (e.g., show login by default)
  if (loginForm) showForm(loginForm);

  // --- Login Logic (Django Backend) ---
  if (btnLoginSubmit) {
    btnLoginSubmit.addEventListener("click", async (e) => {
      e.preventDefault();
      const username = loginUsernameInput.value.trim();
      const password = loginPasswordInput.value.trim();

      if (!username || !password) {
        if (loginError) loginError.textContent = "Username/Email/Phone dan password harus diisi.";
        window.showToast("Login gagal: Data tidak lengkap!", "error");
        return;
      }

      try {
        const response = await fetch("/api/login/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCookie("csrftoken"), // Important for Django POST
          },
          credentials: "include", // Important to receive session cookie
          body: JSON.stringify({ username, password }),
        });
        const data = await response.json();

        if (response.ok && data.success) {
          if (loginError) loginError.textContent = "";
          window.showToast(data.message, "success");
          if (authModal) authModal.style.display = "none";
          checkLoginStatus(); // Update UI after successful login
          // No need for window.location.href = "/" if using SPA-like updates,
          // but if you expect a full page reload, keep it.
          // For now, let's rely on checkLoginStatus to update UI.
        } else {
          if (loginError) loginError.textContent = data.message;
          window.showToast(data.message || "Login gagal!", "error");
          if (data.message && data.message.includes("not activated")) {
            // If account not activated, show OTP form and pre-fill identifier
            currentOtpUserIdentifier = username; // Use username as identifier for resending
            if (otpMessage) otpMessage.textContent = "Akun belum aktif. Mohon verifikasi email/telepon Anda dengan OTP.";
            showForm(otpVerificationForm);
          }
        }
      } catch (error) {
        console.error("Login error:", error);
        if (loginError) loginError.textContent = "Terjadi kesalahan saat login.";
        window.showToast("Terjadi kesalahan sistem saat login.", "error");
      }
    });
  }

  // --- Registration Logic (Django Backend) ---
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
        window.showToast("Pendaftaran gagal: Data tidak lengkap!", "error");
        return;
      }

      try {
        const response = await fetch("/api/register/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCookie("csrftoken"),
          },
          body: JSON.stringify({ username, email, password, phone, name }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          if (registerError) registerError.textContent = "";
          window.showToast(data.message, "success");
          currentOtpUserIdentifier = email; // Store email for OTP verification
          if (otpMessage) otpMessage.textContent = data.message;
          showForm(otpVerificationForm); // Show OTP form immediately after successful registration request
          // Clear registration fields
          regUsernameInput.value = '';
          regNameInput.value = '';
          regEmailInput.value = '';
          regPhoneInput.value = '';
          regPasswordInput.value = '';
        } else {
          if (registerError) registerError.textContent = data.message;
          window.showToast(data.message || "Pendaftaran gagal!", "error");
        }
      } catch (error) {
        console.error("Registration error:", error);
        if (registerError) registerError.textContent = "Terjadi kesalahan saat pendaftaran.";
        window.showToast("Terjadi kesalahan sistem saat pendaftaran.", "error");
      }
    });
  }

  // --- Forgot Password / Send OTP Logic (Django Backend) ---
  if (btnResetPassword) {
    btnResetPassword.addEventListener("click", async (e) => {
      e.preventDefault();
      const emailOrUsername = forgotIdInput.value.trim();

      if (!emailOrUsername) {
        if (forgotError) forgotError.textContent = "Masukkan Username / Email / No. Telepon Anda.";
        return;
      }
      sendOtp(emailOrUsername); // Use the unified sendOtp function
    });
  }

  // --- OTP Verification Logic (Django Backend) ---
  if (btnVerifyOtp) {
    btnVerifyOtp.addEventListener("click", async (e) => {
      e.preventDefault();
      verifyOtp(); // Use the unified verifyOtp function
    });
  }

  // --- Resend OTP Logic ---
  if (btnResendOtp) {
    btnResendOtp.addEventListener("click", async (e) => {
      e.preventDefault();
      if (currentOtpUserIdentifier) {
        sendOtp(currentOtpUserIdentifier); // Resend to the last identifier used
        window.showToast("Mengirim ulang OTP...", "info");
      } else {
        if (otpError) otpError.textContent = "Tidak ada tujuan OTP yang tersimpan untuk dikirim ulang.";
        window.showToast("Tidak dapat mengirim ulang OTP. Silakan mulai dari awal.", "error");
      }
    });
  }

  // --- Dashboard Specific Logic (Product Catalog) ---

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

  // Search functionality
  if (searchInput) {
    searchInput.addEventListener("input", () => filterAndSearchProducts());
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
  renderProducts(products);
});