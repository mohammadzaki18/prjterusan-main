// checkout.js - File ini berisi logika spesifik untuk halaman checkout
// dan bergantung pada dashboard.js untuk fungsi-fungsi global seperti loadUserFromLocalStorage dan showToast.

document.addEventListener('DOMContentLoaded', () => {
    // --- Elemen DOM ---
    // Mendapatkan referensi ke semua elemen HTML yang dibutuhkan di halaman checkout
    const receiverNameInput = document.getElementById('receiverName');
    const receiverPhoneInput = document.getElementById('receiverPhone');
    const addressInput = document.getElementById('address');
    const cityInput = document.getElementById('city');
    const kabupatenInput = document.getElementById('kabupaten');
    const provinceInput = document.getElementById('province');
    const postalCodeInput = document.getElementById('postalCode');
    const rtRwInput = document.getElementById('rtRw');
    const locationDetailsInput = document.getElementById('locationDetails');
    const namalamatInput = document.getElementById('namalamatInput'); // Get the new input for 'Nama Alamat'

    const checkoutItemsContainer = document.getElementById('checkoutItems');
    const checkoutSubtotalElem = document.getElementById('checkoutSubtotal');
    const checkoutShippingElem = document.getElementById('checkoutShipping');
    const checkoutTotalElem = document.getElementById('checkoutTotal');
    const paymentMethodSelect = document.getElementById('paymentMethod');
    const placeOrderBtn = document.getElementById('placeOrderBtn');

    // Biaya pengiriman yang konsisten, diasumsikan dalam IDR
    const SHIPPING_COST = 15000;

    // Data produk dari window.products (disediakan oleh dashboard.js)
    // PENTING: Menambahkan kembali fallback produk jika window.products belum tersedia.
    const products = window.products || [
        { id: 1, name: 'Beras Premium', price: 12000, image: 'https://cdn-icons-png.flaticon.com/512/1256/1256425.png' },
        { id: 2, name: 'Minyak Goreng', price: 15000, image: 'https://cdn-icons-png.flaticon.com/512/2938/2938499.png' },
        { id: 3, name: 'Gula Pasir', price: 13500, image: 'https://cdn-icons-png.flaticon.com/512/2938/2938531.png' },
        { id: 4, name: "Telur Ayam", price: 2500, image: "https://cdn-icons-png.flaticon.com/512/1792/1792750.png" },
        { id: 5, name: "Mie Instan", price: 3000, image: "https://cdn-icons-png.flaticon.com/512/3233/3233917.png" },
        { id: 6, name: "Sabun Mandi", price: 7000, image: "https://cdn-icons-png.flaticon.com/512/2938/2938507.png" },
        { id: 7, name: "Shampo Anti Ketombe", price: 20000, image: "https://cdn-icons-png.flaticon.com/512/2938/2938503.png" },
        { id: 8, name: "Pasta Gigi", price: 10000, image: "https://cdn-icons-png.flaticon.com/512/2938/2938515.png" },
        { id: 9, name: "Kopi Hitam", price: 18000, image: "https://cdn-icons-png.flaticon.com/512/2938/2938497.png" },
        { id: 10, name: "Teh Celup", price: 10000, image: "https://cdn-icons-png.flaticon.com/512/2938/2938505.png" },
    ];


    /**
     * Merender item-item keranjang untuk ringkasan checkout dan memperbarui total biaya.
     * Fungsi ini menangani tampilan berdasarkan status login pengguna dan isi keranjang.
     */
    function renderCheckoutSummary() {
        const currentUser = window.loadUserFromLocalStorage(); // Memuat data pengguna dari localStorage

        // --- Penanganan Jika Pengguna Belum Login ---
        if (!currentUser) {
            // Tampilkan pesan bahwa pengguna harus login
            if (checkoutItemsContainer) {
                checkoutItemsContainer.innerHTML = '<p class="text-secondary text-center">Anda harus login untuk melanjutkan ke pembayaran. Kembali ke <a href="/">Dashboard</a>.</p>';
            }
            // Atur semua total menjadi nol dan nonaktifkan tombol "Place Order"
            if (checkoutSubtotalElem) checkoutSubtotalElem.textContent = 'Rp 0';
            if (checkoutShippingElem) checkoutShippingElem.textContent = 'Rp 0';
            if (checkoutTotalElem) checkoutTotalElem.textContent = 'Rp 0';
            if (placeOrderBtn) placeOrderBtn.disabled = true;
            return; // Hentikan eksekusi fungsi
        }

        const cartKey = `cart_${currentUser.username}`;
        let cart = JSON.parse(localStorage.getItem(cartKey)) || []; // Memuat keranjang spesifik pengguna

        // Periksa apakah semua elemen DOM yang diperlukan ada sebelum melanjutkan
        if (!checkoutItemsContainer || !checkoutSubtotalElem || !checkoutShippingElem || !checkoutTotalElem || !placeOrderBtn) {
            console.warn('Satu atau lebih elemen DOM checkout tidak ditemukan. Ringkasan checkout mungkin tidak lengkap.');
            return;
        }

        checkoutItemsContainer.innerHTML = ''; // Bersihkan item yang sudah ada di kontainer
        let subtotal = 0;

        // --- Penanganan Jika Keranjang Kosong ---
        if (cart.length === 0) {
            checkoutItemsContainer.innerHTML = '<p class="text-secondary text-center">Keranjang Anda kosong. Kembali ke <a href="/">Dashboard</a>.</p>';
            // Atur semua total menjadi nol dan nonaktifkan tombol "Place Order"
            checkoutSubtotalElem.textContent = 'Rp 0';
            checkoutShippingElem.textContent = 'Rp 0';
            checkoutTotalElem.textContent = 'Rp 0';
            placeOrderBtn.disabled = true;
            return; // Hentikan eksekusi fungsi
        } else {
            // Jika keranjang tidak kosong, aktifkan tombol "Place Order"
            placeOrderBtn.disabled = false;
        }

        // --- Rendering Item Keranjang ---
        cart.forEach(item => {
            // Cari detail produk dari array `products` yang tersedia
            const productDetail = products.find(p => p.id === item.id);
            if (!productDetail) {
                console.warn(`Produk dengan ID ${item.id} tidak ditemukan dalam daftar produk.`);
                // Anda bisa memilih untuk melewati item ini atau menampilkannya dengan info terbatas
                return;
            }

            const itemTotal = productDetail.price * item.quantity; // Gunakan harga dari productDetail
            subtotal += itemTotal;

            const itemDiv = document.createElement('div');
            itemDiv.classList.add('summary-item'); // Tambahkan kelas CSS untuk styling
            itemDiv.innerHTML = `
                <img src="${productDetail.image}" alt="${productDetail.name}" style="width: 50px; height: 50px; margin-right: 10px;">
                <p><strong>${productDetail.name}</strong> x ${item.quantity}</p>
                <span>Rp ${itemTotal.toLocaleString('id-ID')}</span>
            `;
            checkoutItemsContainer.appendChild(itemDiv);
        });

        // --- Memperbarui Ringkasan Total ---
        const totalAmount = subtotal + SHIPPING_COST;
        checkoutSubtotalElem.textContent = `Rp ${subtotal.toLocaleString('id-ID')}`;
        checkoutShippingElem.textContent = `Rp ${SHIPPING_COST.toLocaleString('id-ID')}`;
        checkoutTotalElem.textContent = `Rp ${totalAmount.toLocaleString('id-ID')}`;

        // Simpan total ke localStorage, bersih dari format Rp dan titik ribuan, untuk digunakan di halaman sukses
        // Ini akan digunakan di order_success.js
        localStorage.setItem('lastOrderTotal', totalAmount);
    }

    // Panggil fungsi render ringkasan saat halaman dimuat pertama kali
    renderCheckoutSummary();

    // --- Event Listener untuk Tombol "Konfirmasi Pembayaran" ---
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', () => {
            // Dapatkan nilai dari input alamat dan metode pembayaran
            const receiverName = receiverNameInput ? receiverNameInput.value.trim() : '';
            const receiverPhone = receiverPhoneInput ? receiverPhoneInput.value.trim() : '';
            const address = addressInput ? addressInput.value.trim() : '';
            const city = cityInput ? cityInput.value.trim() : '';
            const kabupaten = kabupatenInput ? kabupatenInput.value.trim() : '';
            const province = provinceInput ? provinceInput.value.trim() : '';
            const postalCode = postalCodeInput ? postalCodeInput.value.trim() : '';
            const rtRw = rtRwInput ? rtRwInput.value.trim() : '';
            const locationDetails = locationDetailsInput ? locationDetailsInput.value.trim() : '';
            const namalamat = namalamatInput ? namalamatInput.value.trim() : ''; // Retrieve the value for 'Nama Alamat'
            const paymentMethod = paymentMethodSelect ? paymentMethodSelect.value : '';

            // --- Validasi Input Alamat ---
            // Include namalamat in the validation
            if (!receiverName || !receiverPhone || !address || !city || !kabupaten || !province || !postalCode || !rtRw || !locationDetails || !namalamat) {
                window.showToast('Mohon lengkapi semua detail alamat pengiriman.', 'error');
                return; // Hentikan proses jika ada input yang kosong
            }
            if (!paymentMethod || paymentMethod === "") {
                window.showToast('Harap pilih metode pembayaran.', 'error');
                return;
            }


            const currentUser = window.loadUserFromLocalStorage();
            // Periksa kembali keranjang sebelum menempatkan pesanan
            const cartKey = `cart_${currentUser.username}`;
            let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

            if (cart.length === 0) {
                window.showToast('Keranjang Anda kosong, tidak ada yang bisa dibayar.', 'error');
                return; // Hentikan proses jika keranjang kosong
            }

            // --- Log Informasi Pesanan (untuk debugging/pengembangan) ---
            console.log('Pesanan ditempatkan untuk:', currentUser.username);
            console.log('Alamat Pengiriman:', {
                receiverName,
                receiverPhone,
                address,
                city,
                kabupaten,
                province,
                postalCode,
                rtRw,
                locationDetails,
                namalamat
            });
            console.log('Metode Pembayaran:', paymentMethod);
            console.log('Item Pesanan:', cart);
            console.log('Jumlah Total (dari elemen DOM):', checkoutTotalElem ? checkoutTotalElem.textContent : 'N/A');

            // --- Proses Setelah Pesanan Ditempatkan (Simulasi) ---
            // Dalam aplikasi nyata, di sini Anda akan mengirim data pesanan ke backend
            // menggunakan Fetch API atau XMLHttpRequest.
            // Setelah backend merespons sukses, barulah Anda mengarahkan pengguna.

            // Tampilkan notifikasi sukses terlebih dahulu
            window.showToast('Pembayaran berhasil dikonfirmasi! Pesanan Anda sedang diproses.', 'success');

            // Hapus item keranjang setelah pesanan berhasil ditempatkan
            localStorage.removeItem(cartKey);
            window.updateCartItemCount(); // Perbarui jumlah item di header/keranjang setelah checkout

            // Arahkan pengguna ke halaman sukses pembayaran setelah jeda singkat
            setTimeout(() => {
                window.location.href = placeOrderBtn.dataset.successUrl || '/order-success/';
            }, 1500); // Tunda 1.5 detik agar toast bisa terlihat
        });
    }

    // PENTING: Perbarui UI otentikasi di header saat halaman checkout dimuat.
    // Ini memastikan tombol login/register atau menu akun pengguna ditampilkan dengan benar.
    if (window.updateAuthUI) {
        window.updateAuthUI();
    }
});