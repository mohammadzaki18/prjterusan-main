// cart.js - This file contains cart-specific logic and relies on dashboard.js for global functions

// --- DOM Elements ---
const cartListContainer = document.getElementById('cartListContainer');
const cartSubtotalElem = document.getElementById('cartSubtotal');
const cartShippingElem = document.getElementById('cartShipping');
const cartTotalElem = document.getElementById('cartTotal');
const cartEmptyMessage = document.getElementById('cartEmptyMessage');
const clearCartBtn = document.getElementById('clearCartBtn');
const checkoutBtn = document.getElementById('checkoutBtn');
const cartSummaryElement = document.getElementById('cartSummary');

// Biaya pengiriman yang konsisten, diasumsikan dalam IDR
const SHIPPING_COST = 15000;

// Catatan: Variabel 'products' diasumsikan tersedia secara global dari dashboard.js
//           karena dashboard.js akan dimuat sebelum cart.js.


/**
 * Merender item-item di keranjang dan memperbarui ringkasan total.
 * Fungsi ini diekspos secara global (melalui `window`) agar bisa dipanggil dari skrip lain (misalnya setelah login atau tambah ke keranjang).
 */
window.renderCart = async function() {
    const response = await fetch("/api/get_current_user/", { method: "GET", credentials: "include" });
    const userData = await response.json();

    const cartKey = userData.is_authenticated ? `cart_${userData.username}` : null;
    const cart = cartKey ? JSON.parse(localStorage.getItem(cartKey)) || [] : [];

    if (!cartListContainer) return; // Pastikan elemen ada di halaman

    cartListContainer.innerHTML = '';
    let subtotal = 0;

    if (cart.length === 0) {
        if (cartEmptyMessage) cartEmptyMessage.style.display = 'block';
        if (cartSummaryElement) cartSummaryElement.style.display = 'none'; // Sembunyikan ringkasan jika keranjang kosong
    } else {
        if (cartEmptyMessage) cartEmptyMessage.style.display = 'none';
        if (cartSummaryElement) cartSummaryElement.style.display = 'block'; // Tampilkan ringkasan jika ada item
        cart.forEach(item => {
            const product = window.products ? window.products.find(p => p.id === item.id) : null;
            if (!product) {
                console.warn(`Product with ID ${item.id} not found in global products list.`);
                return; // Skip if product not found
            }

            const cartItemElem = document.createElement('div');
            cartItemElem.className = 'cart-item';
            cartItemElem.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h4>${product.name}</h4>
                    <p>Harga: Rp ${product.price.toLocaleString('id-ID')}</p>
                    <div class="quantity-control">
                        <button class="decrease-quantity-btn" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="increase-quantity-btn" data-id="${item.id}">+</button>
                    </div>
                    <p>Total: Rp ${(product.price * item.quantity).toLocaleString('id-ID')}</p>
                    <button class="remove-item-btn" data-id="${item.id}">Hapus</button>
                </div>
            `;
            cartListContainer.appendChild(cartItemElem);
            subtotal += product.price * item.quantity;
        });
    }

    // Update summary
    if (cartSubtotalElem) cartSubtotalElem.textContent = `Rp ${subtotal.toLocaleString('id-ID')}`;
    if (cartShippingElem) cartShippingElem.textContent = `Rp ${SHIPPING_COST.toLocaleString('id-ID')}`;
    const total = subtotal + SHIPPING_COST;
    if (cartTotalElem) cartTotalElem.textContent = `Rp ${total.toLocaleString('id-ID')}`;

    // Attach event listeners for quantity control and remove buttons
    document.querySelectorAll('.decrease-quantity-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            updateCartItemQuantity(parseInt(e.target.dataset.id), -1);
        });
    });

    document.querySelectorAll('.increase-quantity-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            updateCartItemQuantity(parseInt(e.target.dataset.id), 1);
        });
    });

    document.querySelectorAll('.remove-item-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            removeCartItem(parseInt(e.target.dataset.id));
        });
    });
};

/**
 * Mengupdate jumlah kuantitas item dalam keranjang.
 * @param {number} productId - ID produk yang akan diupdate.
 * @param {number} change - Perubahan kuantitas (+1 atau -1).
 */
async function updateCartItemQuantity(productId, change) {
    const response = await fetch("/api/get_current_user/", { method: "GET", credentials: "include" });
    const userData = await response.json();

    if (!userData.is_authenticated) {
        window.showToast("Anda harus login untuk mengubah keranjang.", "error");
        window.showLoginModal();
        return;
    }

    const cartKey = `cart_${userData.username}`;
    let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

    const itemIndex = cart.findIndex(item => item.id === productId);

    if (itemIndex > -1) {
        const product = window.products ? window.products.find(p => p.id === productId) : null;
        const productStock = product ? product.stock : 1000; // Default to high stock if not found

        if (change > 0) { // Increase quantity
            if (cart[itemIndex].quantity < productStock) {
                cart[itemIndex].quantity += change;
                window.showToast(`Kuantitas ${product.name} diperbarui.`, "success");
            } else {
                window.showToast(`Stok ${product.name} terbatas.`, "error");
            }
        } else { // Decrease quantity
            cart[itemIndex].quantity += change;
            if (cart[itemIndex].quantity <= 0) {
                cart.splice(itemIndex, 1); // Remove item if quantity is 0 or less
                window.showToast(`${product.name} dihapus dari keranjang.`, "info");
            } else {
                window.showToast(`Kuantitas ${product.name} diperbarui.`, "success");
            }
        }
        localStorage.setItem(cartKey, JSON.stringify(cart));
        window.renderCart(); // Re-render cart after update
    }
}

/**
 * Menghapus item dari keranjang.
 * @param {number} productId - ID produk yang akan dihapus.
 */
async function removeCartItem(productId) {
    const response = await fetch("/api/get_current_user/", { method: "GET", credentials: "include" });
    const userData = await response.json();

    if (!userData.is_authenticated) {
        window.showToast("Anda harus login untuk mengubah keranjang.", "error");
        window.showLoginModal();
        return;
    }

    const cartKey = `cart_${userData.username}`;
    let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

    const initialLength = cart.length;
    cart = cart.filter(item => item.id !== productId);

    if (cart.length < initialLength) {
        localStorage.setItem(cartKey, JSON.stringify(cart));
        window.showToast("Produk berhasil dihapus dari keranjang.", "success");
        window.renderCart(); // Re-render cart after removal
    } else {
        window.showToast("Produk tidak ditemukan di keranjang.", "error");
    }
}

/**
 * Menghapus semua item dari keranjang.
 */
async function handleClearCart() {
    const response = await fetch("/api/get_current_user/", { method: "GET", credentials: "include" });
    const userData = await response.json();

    if (!userData.is_authenticated) {
        window.showToast("Anda harus login untuk menghapus keranjang.", "error");
        window.showLoginModal();
        return;
    }

    const cartKey = `cart_${userData.username}`;
    localStorage.removeItem(cartKey);
    window.showToast("Keranjang berhasil dikosongkan.", "info");
    window.renderCart(); // Re-render cart after clearing
}

/**
 * Menangani proses checkout.
 */
async function handleCheckout() {
    const response = await fetch("/api/get_current_user/", { method: "GET", credentials: "include" });
    const userData = await response.json();

    if (!userData.is_authenticated) {
        window.showToast("Anda harus login untuk melakukan checkout.", "error");
        window.showLoginModal();
        return;
    }

    const cartKey = `cart_${userData.username}`;
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];

    if (cart.length === 0) {
        window.showToast("Keranjang Anda kosong. Tambahkan produk terlebih dahulu.", "error");
        return;
    }

    // Prepare order data for backend
    const orderItems = cart.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        price_at_order: item.price // Store price at the time of order
    }));

    try {
        const orderResponse = await fetch("/api/checkout/", { // Assuming a /api/checkout/ endpoint
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": window.getCsrfToken(),
            },
            credentials: "include",
            body: JSON.stringify({ items: orderItems, total_amount: calculateTotal(cart) + SHIPPING_COST }),
        });

        const orderData = await orderResponse.json();

        if (orderResponse.ok && orderData.success) {
            window.showToast(orderData.message || "Checkout berhasil! Pesanan Anda sedang diproses.", "success");
            handleClearCart(); // Clear cart after successful checkout

            // Redirect to order history or a confirmation page
            if (orderData.redirect_url) {
                window.location.href = orderData.redirect_url;
            } else {
                window.location.href = '/orders'; // Default redirect
            }
        } else {
            window.showToast(orderData.message || "Checkout gagal.", "error");
        }
    } catch (error) {
        console.error("Checkout error:", error);
        window.showToast("Terjadi kesalahan saat checkout.", "error");
    }
}

function calculateTotal(cart) {
    let total = 0;
    cart.forEach(item => {
        const product = window.products ? window.products.find(p => p.id === item.id) : null;
        if (product) {
            total += product.price * item.quantity;
        }
    });
    return total;
}


// --- Event Listeners and Initializations for Cart Page ---
document.addEventListener("DOMContentLoaded", function() {
    // Initial rendering of the cart when the page loads
    window.renderCart();

    // Attach event listener to the 'Clear Cart' button
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', handleClearCart);
    }

    // Attach event listener to the 'Checkout' button
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', handleCheckout);
    }
});