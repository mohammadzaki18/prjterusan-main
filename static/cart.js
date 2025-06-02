// cart.js - This file contains cart-specific logic and relies on dashboard.js for global functions

// ========================
// DOM Elements
// ========================
const cartListContainer = document.getElementById('cartListContainer');
const cartSubtotalElem = document.getElementById('cartSubtotal');
const cartShippingElem = document.getElementById('cartShipping');
const cartTotalElem = document.getElementById('cartTotal');
const cartEmptyMessage = document.getElementById('cartEmptyMessage');
const clearCartBtn = document.getElementById('clearCartBtn');
const checkoutBtn = document.getElementById('checkoutBtn');

const SHIPPING_COST = 15000; // Flat shipping rate

// ========================
// Render Cart
// ========================
window.renderCart = function () {
    const currentUser = window.loadUserFromLocalStorage();

    if (!currentUser) {
        if (cartEmptyMessage) cartEmptyMessage.style.display = 'block';
        if (cartListContainer) {
            cartListContainer.innerHTML = '';
            cartListContainer.style.display = 'none';
        }
        document.getElementById('cartSummary')?.style.display = 'none';
        if (clearCartBtn) clearCartBtn.style.display = 'none';
        if (checkoutBtn) checkoutBtn.style.display = 'none';
        return;
    }

    const cartKey = `cart_${currentUser.username}`;
    let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

    if (!cartListContainer) return;
    cartListContainer.innerHTML = '';

    if (cart.length === 0) {
        if (cartEmptyMessage) cartEmptyMessage.style.display = 'block';
        cartListContainer.style.display = 'none';
        document.getElementById('cartSummary')?.style.display = 'none';
        if (clearCartBtn) clearCartBtn.style.display = 'none';
        if (checkoutBtn) checkoutBtn.style.display = 'none';
        return;
    }

    if (cartEmptyMessage) cartEmptyMessage.style.display = 'none';
    cartListContainer.style.display = 'block';
    document.getElementById('cartSummary')?.style.display = 'block';
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

    cartSubtotalElem.textContent = `Rp ${subtotal.toLocaleString('id-ID')}`;
    cartShippingElem.textContent = `Rp ${SHIPPING_COST.toLocaleString('id-ID')}`;
    cartTotalElem.textContent = `Rp ${(subtotal + SHIPPING_COST).toLocaleString('id-ID')}`;

    attachCartItemListeners();
};

// ========================
// Attach Listeners to Cart Item Buttons
// ========================
function attachCartItemListeners() {
    document.querySelectorAll('.increase-quantity').forEach(button =>
        button.addEventListener('click', e => {
            const id = parseInt(e.target.dataset.id);
            updateCartQuantity(id, 1);
        })
    );

    document.querySelectorAll('.decrease-quantity').forEach(button =>
        button.addEventListener('click', e => {
            const id = parseInt(e.target.dataset.id);
            updateCartQuantity(id, -1);
        })
    );

    document.querySelectorAll('.remove-item').forEach(button =>
        button.addEventListener('click', e => {
            const id = parseInt(e.target.dataset.id);
            removeItemFromCart(id);
        })
    );
}

// ========================
// Update Cart Quantity
// ========================
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
        const productInCatalog = products.find(p => p.id === productId);
        if (!productInCatalog) return;

        const newQuantity = cart[itemIndex].quantity + change;

        if (newQuantity > 0 && (!productInCatalog.stock || newQuantity <= productInCatalog.stock)) {
            cart[itemIndex].quantity = newQuantity;
            window.showToast(`Kuantitas ${cart[itemIndex].name} diperbarui.`, 'info');
        } else if (newQuantity <= 0) {
            removeItemFromCart(productId);
            return;
        } else {
            window.showToast(`Stok ${productInCatalog.name} hanya ${productInCatalog.stock}.`, 'error');
        }

        localStorage.setItem(cartKey, JSON.stringify(cart));
        window.renderCart();
    }
}

// ========================
// Remove Item from Cart
// ========================
function removeItemFromCart(productId) {
    const currentUser = window.loadUserFromLocalStorage();
    if (!currentUser) return;

    const cartKey = `cart_${currentUser.username}`;
    let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

    const newCart = cart.filter(item => item.id !== productId);
    if (newCart.length !== cart.length) {
        localStorage.setItem(cartKey, JSON.stringify(newCart));
        window.showToast('Produk berhasil dihapus dari keranjang.');
        window.renderCart();
    }
}

// ========================
// DOMContentLoaded Handler
// ========================
document.addEventListener('DOMContentLoaded', () => {
    window.updateAuthUI();

    // Header auth buttons
    document.getElementById('btnLogin')?.addEventListener('click', window.showLoginModal);
    document.getElementById('btnRegister')?.addEventListener('click', window.showRegisterModal);

    // Account menu
    const accountMenu = document.getElementById('accountMenu');
    const accountDropdown = document.getElementById('accountDropdown');
    if (accountMenu && accountDropdown) {
        accountMenu.addEventListener('click', e => {
            accountDropdown.style.display = accountDropdown.style.display === 'block' ? 'none' : 'block';
            e.stopPropagation();
        });
        document.addEventListener('click', e => {
            if (!accountMenu.contains(e.target)) accountDropdown.style.display = 'none';
        });
    }

    document.getElementById('logoutBtn')?.addEventListener('click', window.logout);

    // Close auth modal
    document.getElementById('closeAuthModal')?.addEventListener('click', () => {
        const modal = document.getElementById('authModal');
        if (modal) modal.style.display = 'none';
    });

    // Auth form navigation
    document.getElementById('showRegister')?.addEventListener('click', () => window.showForm('register'));
    document.getElementById('showLoginFromRegister')?.addEventListener('click', () => window.showForm('login'));
    document.getElementById('showForgotPassword')?.addEventListener('click', () => window.showForm('forgot'));
    document.getElementById('showLoginFromForgot')?.addEventListener('click', () => window.showForm('login'));

    // Auth form actions
    document.getElementById('btnLoginSubmit')?.addEventListener('click', window.login);
    document.getElementById('btnRegisterSubmit')?.addEventListener('click', window.register);
    document.getElementById('btnResetPassword')?.addEventListener('click', window.resetPassword);

    // Initial cart rendering
    window.renderCart();

    // Clear cart
    clearCartBtn?.addEventListener('click', () => {
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

    // Checkout
    checkoutBtn?.addEventListener('click', e => {
        e.preventDefault();
        const currentUser = window.loadUserFromLocalStorage();
        if (!currentUser) {
            window.showToast('Anda harus login untuk checkout.', 'error');
            window.showLoginModal();
            return;
        }

        const cartKey = `cart_${currentUser.username}`;
        const cart = JSON.parse(localStorage.getItem(cartKey)) || [];

        if (cart.length === 0) {
            window.showToast('Keranjang Anda kosong. Tambahkan produk terlebih dahulu!', 'error');
            return;
        }

        const checkoutUrl = checkoutBtn.getAttribute('data-checkout-url');
        if (checkoutUrl) {
            window.location.href = checkoutUrl;
        } else {
            window.showToast('URL checkout tidak tersedia.', 'error');
        }
    });

    // Search bar
    const searchInput = document.getElementById('searchInput');
    searchInput?.addEventListener('keyup', e => {
        if (e.key === 'Enter' && searchInput.value.trim() !== '') {
            window.location.href = `dashboard.html?search=${encodeURIComponent(searchInput.value.trim())}`;
        }
    });
});
