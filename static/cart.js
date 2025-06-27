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
window.renderCart = function() {
    const currentUser = window.loadUserFromLocalStorage(); // Use the global function
    const cartKey = currentUser ? `cart_${currentUser.username}` : null;
    
    // Ambil keranjang dari localStorage. Jika tidak ada pengguna login atau tidak ada data keranjang, default ke array kosong.
    const cart = cartKey ? JSON.parse(localStorage.getItem(cartKey)) || [] : [];

    cartListContainer.innerHTML = ''; // Clear previous items

    if (cart.length === 0) {
        cartEmptyMessage.style.display = 'block';
        cartSummaryElement.style.display = 'none';
        checkoutBtn.disabled = true; // Nonaktifkan tombol checkout jika keranjang kosong
        clearCartBtn.disabled = true; // Nonaktifkan tombol clear cart
        // Ensure cart icon count is updated to 0
        if (typeof window.updateCartIconCount === 'function') {
            window.updateCartIconCount();
        }
        return;
    } else {
        cartEmptyMessage.style.display = 'none';
        cartSummaryElement.style.display = 'block';
        checkoutBtn.disabled = false; // Aktifkan kembali
        clearCartBtn.disabled = false; // Aktifkan kembali
    }

    let subtotal = 0;

    cart.forEach(item => {
        // PENTING: Gunakan properti langsung dari 'item' di keranjang
        // Ini berasumsi bahwa 'name', 'price', dan 'image' sudah disimpan saat produk ditambahkan/diperbarui.
        // Fallback ke window.products jika properti tidak ada (untuk kompatibilitas data lama atau jika addToCart tidak menyimpannya)
        const productName = item.name || (window.products ? window.products.find(p => p.id === item.id)?.name : `Produk ID ${item.id}`);
        const productPrice = item.price || (window.products ? window.products.find(p => p.id === item.id)?.price : 0);
        const productImage = item.image || (window.products ? window.products.find(p => p.id === item.id)?.image : 'https://via.placeholder.com/50'); // Default image

        const currentItemPrice = parseFloat(productPrice) || 0; // Pastikan harga adalah angka sebelum melakukan perhitungan
        const itemTotal = currentItemPrice * item.quantity;
        subtotal += itemTotal;

        const cartItemDiv = document.createElement('div');
        cartItemDiv.classList.add('cart-item');
        cartItemDiv.innerHTML = `
            <div class="item-info">
                <img src="${productImage}" alt="${productName}" class="item-image">
                <div>
                    <h4>${productName}</h4>
                    <p>Harga: Rp ${currentItemPrice.toLocaleString('id-ID')}</p>
                    <div class="item-quantity-control">
                        <button class="btn-quantity" data-id="${item.id}" data-action="decrease">-</button>
                        <span>${item.quantity}</span>
                        <button class="btn-quantity" data-id="${item.id}" data-action="increase">+</button>
                    </div>
                </div>
            </div>
            <div class="item-actions">
                <p class="item-total">Rp ${itemTotal.toLocaleString('id-ID')}</p>
                <button class="btn btn-remove" data-id="${item.id}">Hapus</button>
            </div>
        `;
        cartListContainer.appendChild(cartItemDiv);
    });

    const total = subtotal + SHIPPING_COST;

    cartSubtotalElem.textContent = `Rp ${subtotal.toLocaleString('id-ID')}`;
    cartShippingElem.textContent = `Rp ${SHIPPING_COST.toLocaleString('id-ID')}`;
    cartTotalElem.textContent = `Rp ${total.toLocaleString('id-ID')}`;

    // Attach event listeners for quantity control and remove buttons
    cartListContainer.querySelectorAll('.btn-quantity').forEach(button => {
        button.addEventListener('click', handleQuantityChange);
    });

    cartListContainer.querySelectorAll('.btn-remove').forEach(button => {
        button.addEventListener('click', handleRemoveItem);
    });

    // Update login status display in header (if checkLoginStatus exists globally)
    if (typeof window.checkLoginStatus === 'function') {
        window.checkLoginStatus();
    }
    // Update cart icon count in header (assuming dashboard.js defines this)
    if (typeof window.updateCartIconCount === 'function') {
        window.updateCartIconCount();
    }
};

/**
 * Mengelola perubahan jumlah item di keranjang.
 */
function handleQuantityChange(event) {
    const productId = parseInt(event.target.dataset.id);
    const action = event.target.dataset.action;

    const currentUser = window.loadUserFromLocalStorage();
    if (!currentUser) {
        window.showToast("Anda harus login untuk mengelola keranjang.", "error");
        return;
    }

    const cartKey = `cart_${currentUser.username}`;
    let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

    const itemIndex = cart.findIndex(item => item.id === productId);

    if (itemIndex > -1) {
        // PENTING: Perbarui detail produk (nama, harga, gambar) di item keranjang sebelum menyimpan
        // Ini memastikan data lengkap tersimpan di localStorage dan dapat diakses checkout.js
        const productData = window.products ? window.products.find(p => p.id === productId) : null;
        if (productData) {
            cart[itemIndex].name = productData.name;
            cart[itemIndex].price = productData.price;
            cart[itemIndex].image = productData.image;
        } else {
            // Fallback jika window.products tidak tersedia, setidaknya pastikan properti ada
            // Ini bisa terjadi jika item ditambahkan tanpa window.products di halaman dashboard
            if (cart[itemIndex].name === undefined) cart[itemIndex].name = `Produk ID ${productId}`;
            if (cart[itemIndex].price === undefined) cart[itemIndex].price = 0;
            if (cart[itemIndex].image === undefined) cart[itemIndex].image = 'https://via.placeholder.com/50';
        }


        if (action === 'increase') {
            cart[itemIndex].quantity++;
            window.showToast("Jumlah produk diperbarui di keranjang.", "info");
        } else if (action === 'decrease') {
            cart[itemIndex].quantity--;
            if (cart[itemIndex].quantity <= 0) {
                cart.splice(itemIndex, 1); // Hapus jika jumlahnya 0 atau kurang
                window.showToast("Produk dihapus dari keranjang.", "info");
            } else {
                window.showToast("Jumlah produk diperbarui di keranjang.", "info");
            }
        }
        localStorage.setItem(cartKey, JSON.stringify(cart));
        window.renderCart(); // Re-render the cart to reflect changes
    } else {
        window.showToast("Produk tidak ditemukan di keranjang.", "warning");
    }
}

/**
 * Mengelola penghapusan item dari keranjang.
 */
function handleRemoveItem(event) {
    const productId = parseInt(event.target.dataset.id);

    const currentUser = window.loadUserFromLocalStorage();
    if (!currentUser) {
        window.showToast("Anda harus login untuk mengelola keranjang.", "error");
        return;
    }

    const cartKey = `cart_${currentUser.username}`;
    let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

    cart = cart.filter(item => item.id !== productId); // Hapus item yang sesuai

    localStorage.setItem(cartKey, JSON.stringify(cart));
    window.showToast("Produk dihapus dari keranjang.", "info");
    window.renderCart(); // Re-render the cart
}

/**
 * Mengosongkan seluruh keranjang.
 */
function handleClearCart() {
    const currentUser = window.loadUserFromLocalStorage();
    if (!currentUser) {
        window.showToast("Anda harus login untuk mengosongkan keranjang.", "error");
        return;
    }

    const cartKey = `cart_${currentUser.username}`;
    localStorage.removeItem(cartKey); // Hapus kunci keranjang dari localStorage
    window.showToast("Keranjang Anda telah dikosongkan.", "info");
    window.renderCart(); // Re-render the cart
}

/**
 * Mensimulasikan proses checkout.
 * Dalam aplikasi nyata, ini akan mengirim data keranjang ke backend.
 */
async function handleCheckout() {
    const currentUser = window.loadUserFromLocalStorage();
    if (!currentUser) {
        window.showToast("Anda harus login untuk melakukan checkout.", "error");
        return;
    }

    const cartKey = `cart_${currentUser.username}`;
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];

    if (cart.length === 0) {
        window.showToast("Keranjang Anda kosong. Tambahkan produk sebelum checkout.", "warning");
        return;
    }

    const totalOrder = calculateTotal(cart) + SHIPPING_COST;

    // Simulate API call to backend for checkout
    console.log("Simulating checkout for user:", currentUser.username);
    console.log("Cart contents:", cart);
    console.log("Total order amount (including shipping):", totalOrder);

    // Simulate backend response
    try {
        const orderData = {
            success: true,
            message: "Checkout berhasil! Pesanan Anda sedang diproses.",
            orderId: `ORD-${Date.now()}`,
            date: new Date().toLocaleString(),
            items: cart.map(item => {
                // PENTING: Gunakan properti item langsung dari cart, karena sekarang sudah diperbarui oleh handleQuantityChange (atau addToCart)
                return {
                    id: item.id, // Pastikan ID produk disertakan
                    name: item.name || `Produk ID ${item.id}`, // Fallback jika nama hilang
                    quantity: item.quantity,
                    price: item.price || 0, // Fallback jika harga hilang
                    image: item.image || '', // Fallback jika gambar hilang
                    returned: false // Tambahkan status pengembalian untuk riwayat
                };
            }),
            total: totalOrder,
            status: 'Diproses', // Status awal
            // redirect_url akan diambil dari data-checkout-url tombol
        };

        // --- Save order to localStorage for history (simulation) ---
        const ordersKey = `orders_${currentUser.username}`;
        let orders = JSON.parse(localStorage.getItem(ordersKey)) || [];
        orders.push(orderData); // Add the new order
        localStorage.setItem(ordersKey, JSON.stringify(orders));
        // --- End simulation save ---

        if (orderData.success) {
            window.showToast("Checkout berhasil! Pesanan Anda sedang diproses.", "success");
            handleClearCart(); // Clear cart after successful checkout

            // Redirect ke halaman sukses checkout/order history
            const checkoutUrl = checkoutBtn.getAttribute("data-checkout-url");
            if (checkoutUrl) {
                window.location.href = checkoutUrl;
            } else {
                window.location.href = '/orders'; // Default redirect jika atribut tidak ada
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
        // Gunakan item.price langsung dari objek item
        if (item && item.price && item.quantity) {
            total += (parseFloat(item.price) || 0) * item.quantity; // Pastikan harga adalah angka
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