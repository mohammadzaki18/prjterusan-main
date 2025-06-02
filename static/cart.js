// cart.js - This file contains cart-specific logic and relies on dashboard.js for global functions

// DOM Elements specific to Cart page
const cartListContainer = document.getElementById('cartListContainer');
const cartSubtotalElem = document.getElementById('cartSubtotal');
const cartShippingElem = document.getElementById('cartShipping');
const cartTotalElem = document.getElementById('cartTotal');
const cartEmptyMessage = document.getElementById('cartEmptyMessage');
const clearCartBtn = document.getElementById('clearCartBtn');
const checkoutBtn = document.getElementById('checkoutBtn');

const SHIPPING_COST = 15000; // Consistent shipping cost

/**
 * Renders the cart items and updates the summary.
 */
window.renderCart = function() {
    const currentUser = window.loadUserFromLocalStorage();
    if (!currentUser) {
        // If not logged in, show empty cart message and hide controls
        if (cartEmptyMessage) cartEmptyMessage.style.display = 'block';
        if (cartListContainer) cartListContainer.innerHTML = '';
        if (cartListContainer) cartListContainer.style.display = 'none';
        if (document.getElementById('cartSummary')) document.getElementById('cartSummary').style.display = 'none';
        if (clearCartBtn) clearCartBtn.style.display = 'none';
        if (checkoutBtn) checkoutBtn.style.display = 'none';
        return;
    }

    const cartKey = `cart_${currentUser.username}`;
    let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

    if (!cartListContainer) return; // Exit if cart elements are not on the page

    cartListContainer.innerHTML = ''; // Clear existing items

    if (cart.length === 0) {
        if (cartEmptyMessage) cartEmptyMessage.style.display = 'block';
        if (cartListContainer) cartListContainer.style.display = 'none';
        if (document.getElementById('cartSummary')) document.getElementById('cartSummary').style.display = 'none';
        if (clearCartBtn) clearCartBtn.style.display = 'none';
        if (checkoutBtn) checkoutBtn.style.display = 'none';
        return;
    }

    // Hide empty message and show cart content
    if (cartEmptyMessage) cartEmptyMessage.style.display = 'none';
    if (cartListContainer) cartListContainer.style.display = 'block';
    if (document.getElementById('cartSummary')) document.getElementById('cartSummary').style.display = 'block';
    if (clearCartBtn) clearCartBtn.style.display = 'block';
    if (checkoutBtn) checkoutBtn.style.display = 'block';

    let subtotal = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        const cartItemCard = document.createElement('div');
        cartItemCard.classList.add('cart-product-card');
        cartItemCard.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-product-details">
                <h4>${item.name}</h4>
                <p>Harga Satuan: Rp ${item.price.toLocaleString('id-ID')}</p>
                <p class="cart-product-price-total">Total: Rp ${itemTotal.toLocaleString('id-ID')}</p>
                <div class="cart-item-controls">
                    <button class="btn btn-sm btn-secondary decrease-quantity" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="btn btn-sm btn-primary increase-quantity" data-id="${item.id}">+</button>
                    <button class="btn btn-sm btn-danger remove-item" data-id="${item.id}">Hapus</button>
                </div>
            </div>
        `;
        cartListContainer.appendChild(cartItemCard);
    });

    // Update summary elements
    if (cartSubtotalElem) cartSubtotalElem.textContent = `Rp ${subtotal.toLocaleString('id-ID')}`;
    if (cartShippingElem) cartShippingElem.textContent = `Rp ${SHIPPING_COST.toLocaleString('id-ID')}`;
    if (cartTotalElem) cartTotalElem.textContent = `Rp ${(subtotal + SHIPPING_COST).toLocaleString('id-ID')}`;

    attachCartItemListeners();
};

/**
 * Attaches event listeners to cart item control buttons.
 */
function attachCartItemListeners() {
    document.querySelectorAll('.increase-quantity').forEach(button => {
        button.addEventListener('click', (event) => {
            const id = parseInt(event.target.dataset.id);
            updateCartQuantity(id, 1);
        });
    });

    document.querySelectorAll('.decrease-quantity').forEach(button => {
        button.addEventListener('click', (event) => {
            const id = parseInt(event.target.dataset.id);
            updateCartQuantity(id, -1);
        });
    });

    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (event) => {
            const id = parseInt(event.target.dataset.id);
            removeItemFromCart(id);
        });
    });
}

/**
 * Updates the quantity of a product in the cart.
 * @param {number} productId - The ID of the product.
 * @param {number} change - The amount to change the quantity by (+1 or -1).
 */
function updateCartQuantity(productId, change) {
    const currentUser = window.loadUserFromLocalStorage();
    if (!currentUser) {
        window.showToast('Silakan login untuk mengubah keranjang.', 'error');
        return;
    }

    const cartKey = `cart_${currentUser.username}`;
    let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex > -1) {
        const productInCatalog = products.find(p => p.id === productId); // 'products' is global from dashboard.js
        if (!productInCatalog) return; // Should not happen if data is consistent

        const currentQuantity = cart[itemIndex].quantity;
        const newQuantity = currentQuantity + change;

        if (newQuantity > 0 && (productInCatalog.stock === undefined || newQuantity <= productInCatalog.stock)) {
            cart[itemIndex].quantity = newQuantity;
            window.showToast(`Kuantitas ${cart[itemIndex].name} diperbarui.`, 'info');
        } else if (newQuantity <= 0) {
            removeItemFromCart(productId); // Remove item if quantity becomes zero or less
            return;
        } else if (productInCatalog.stock !== undefined && newQuantity > productInCatalog.stock) {
            window.showToast(`Stok ${productInCatalog.name} hanya ${productInCatalog.stock}.`, 'error');
        }
        localStorage.setItem(cartKey, JSON.stringify(cart));
        window.renderCart(); // Re-render cart to update UI
    }
}

/**
 * Removes a product completely from the cart.
 * @param {number} productId - The ID of the product to remove.
 */
function removeItemFromCart(productId) {
    const currentUser = window.loadUserFromLocalStorage();
    if (!currentUser) return; // Should not happen if UI is correctly managed

    const cartKey = `cart_${currentUser.username}`;
    let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

    const initialLength = cart.length;
    cart = cart.filter(item => item.id !== productId);

    if (cart.length < initialLength) {
        localStorage.setItem(cartKey, JSON.stringify(cart));
        window.showToast('Produk berhasil dihapus dari keranjang.');
        window.renderCart(); // Re-render cart to update UI
    }
}

// --- Event Listeners and Initializations ---
document.addEventListener('DOMContentLoaded', () => {
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

    // --- Cart page specific logic ---
    window.renderCart(); // Initial render of the cart

    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', () => {
            if (confirm('Apakah Anda yakin ingin mengosongkan seluruh keranjang?')) {
                const currentUser = window.loadUserFromLocalStorage();
                if (currentUser) {
                    localStorage.removeItem(`cart_${currentUser.username}`);
                    window.showToast('Keranjang telah dikosongkan.', 'info');
                    window.renderCart();
                } else {
                    window.showToast('Anda harus login untuk mengosongkan keranjang.', 'error');
                }
            }
        });
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const currentUser = window.loadUserFromLocalStorage();
            if (!currentUser) {
                window.showToast('Anda harus login untuk checkout.', 'error');
                window.showLoginModal(); // Offer login
                return;
            }

            const cartKey = `cart_${currentUser.username}`;
            let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

            if (cart.length === 0) {
                window.showToast('Keranjang Anda kosong. Tambahkan produk terlebih dahulu!', 'error');
                return;
            }

            // Redirect to checkout page
            window.location.href = "{% url 'checkout' %}"
        });
    }

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
});