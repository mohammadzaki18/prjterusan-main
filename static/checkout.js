// checkout.js - This file contains checkout-specific logic and relies on dashboard.js for global functions

document.addEventListener('DOMContentLoaded', () => {
    const addressInput = document.getElementById('address');
    const cityInput = document.getElementById('city');
    const postalCodeInput = document.getElementById('postalCode');
    const checkoutItemsContainer = document.getElementById('checkoutItems');
    const checkoutSubtotalElem = document.getElementById('checkoutSubtotal');
    const checkoutShippingElem = document.getElementById('checkoutShipping');
    const checkoutTotalElem = document.getElementById('checkoutTotal');
    const paymentMethodSelect = document.getElementById('paymentMethod');
    const placeOrderBtn = document.getElementById('placeOrderBtn');

    const SHIPPING_COST = 15000; // Consistent shipping cost

    /**
     * Renders the checkout items and summary.
     */
    function renderCheckoutSummary() {
        const currentUser = window.loadUserFromLocalStorage(); //
        if (!currentUser) {
            // Handle case where user is not logged in on checkout page
            if (checkoutItemsContainer) {
                checkoutItemsContainer.innerHTML = '<p class="text-secondary text-center">Anda harus login untuk melanjutkan ke pembayaran. Kembali ke <a href="dashboard.html">Dashboard</a>.</p>';
            }
            if (checkoutSubtotalElem) checkoutSubtotalElem.textContent = 'Rp 0';
            if (checkoutShippingElem) checkoutShippingElem.textContent = 'Rp 0';
            if (checkoutTotalElem) checkoutTotalElem.textContent = 'Rp 0';
            if (placeOrderBtn) placeOrderBtn.disabled = true;
            return;
        }

        const cartKey = `cart_${currentUser.username}`;
        let cart = JSON.parse(localStorage.getItem(cartKey)) || []; //

        if (!checkoutItemsContainer) return;

        checkoutItemsContainer.innerHTML = '';
        let subtotal = 0;

        if (cart.length === 0) {
            checkoutItemsContainer.innerHTML = '<p class="text-secondary text-center">Keranjang Anda kosong. Kembali ke <a href="dashboard.html">Dashboard</a>.</p>';
            if (checkoutSubtotalElem) checkoutSubtotalElem.textContent = 'Rp 0';
            if (checkoutShippingElem) checkoutShippingElem.textContent = 'Rp 0';
            if (checkoutTotalElem) checkoutTotalElem.textContent = 'Rp 0';
            if (placeOrderBtn) placeOrderBtn.disabled = true; // Disable checkout button if cart is empty
            return;
        } else {
            if (placeOrderBtn) placeOrderBtn.disabled = false;
        }

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;

            const itemDiv = document.createElement('div');
            itemDiv.classList.add('summary-item'); // Assuming .summary-item is styled for checkout summary
            itemDiv.innerHTML = `
                <p><strong>${item.name}</strong> x ${item.quantity}</p>
                <span>Rp ${itemTotal.toLocaleString('id-ID')}</span>
            `;
            checkoutItemsContainer.appendChild(itemDiv);
        });

        if (checkoutSubtotalElem) checkoutSubtotalElem.textContent = `Rp ${subtotal.toLocaleString('id-ID')}`;
        if (checkoutShippingElem) checkoutShippingElem.textContent = `Rp ${SHIPPING_COST.toLocaleString('id-ID')}`; //
        if (checkoutTotalElem) checkoutTotalElem.textContent = `Rp ${(subtotal + SHIPPING_COST).toLocaleString('id-ID')}`; //
    }

    // Call renderCheckoutSummary on page load
    renderCheckoutSummary();

    // Handle place order button click
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', () => {
            const address = addressInput ? addressInput.value.trim() : '';
            const city = cityInput ? cityInput.value.trim() : '';
            const postalCode = postalCodeInput ? postalCodeInput.value.trim() : '';
            const paymentMethod = paymentMethodSelect ? paymentMethodSelect.value : '';

            if (!address || !city || !postalCode) {
                window.showToast('Mohon lengkapi semua detail alamat pengiriman.', 'error');
                return;
            }

            const currentUser = window.loadUserFromLocalStorage(); //
            const cartKey = `cart_${currentUser.username}`;
            let cart = JSON.parse(localStorage.getItem(cartKey)) || []; //

            if (cart.length === 0) {
                window.showToast('Keranjang Anda kosong, tidak ada yang bisa dibayar.', 'error');
                return;
            }

            // Simulate order placement
            console.log('Order placed for:', currentUser.username);
            console.log('Shipping Address:', { address, city, postalCode });
            console.log('Payment Method:', paymentMethod);
            console.log('Items:', cart);
            console.log('Total Amount:', checkoutTotalElem ? checkoutTotalElem.textContent : 'N/A');

            // Clear the cart after successful checkout
            localStorage.removeItem(cartKey); //
            window.showToast('Pesanan Anda berhasil ditempatkan!', 'success');

            // Optionally redirect to a confirmation page or dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 2000);
        });
    }
});