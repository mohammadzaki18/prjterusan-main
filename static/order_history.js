document.addEventListener('DOMContentLoaded', () => {
    // Memastikan fungsi-fungsi global dari dashboard.js tersedia dan UI autentikasi diperbarui.
    // checkLoginStatus akan memperbarui UI header (tombol login/daftar vs menu akun)
    if (typeof window.checkLoginStatus === 'function') {
        window.checkLoginStatus();
    }

    const orderListDiv = document.getElementById('order-list');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const noOrdersMessage = document.getElementById('noOrdersMessage');

    const returnModal = document.getElementById('returnModal');
    const closeReturnModalBtn = document.getElementById('closeReturnModal');
    const returnOrderIdDisplay = document.getElementById('returnOrderIdDisplay');
    const returnItemsList = document.getElementById('returnItemsList');
    const returnReasonInput = document.getElementById('returnReason');
    const returnForm = document.getElementById('returnForm');
    const returnMessage = document.getElementById('returnMessage');

    let ordersData = []; // Akan diisi dengan data pesanan pengguna
    const ordersPerPage = 5;
    let currentPage = 0;
    let currentOrderForReturn = null; // To store the order being returned

    /**
     * Mengambil data pesanan dari localStorage berdasarkan pengguna yang login.
     * Dalam aplikasi nyata, ini akan menjadi panggilan API ke backend.
     */
    function fetchUserOrders() {
        if (typeof window.loadUserFromLocalStorage !== 'function') {
            console.error("window.loadUserFromLocalStorage is not defined. Please ensure dashboard.js is loaded correctly.");
            noOrdersMessage.style.display = 'block';
            noOrdersMessage.innerHTML = '<p class="text-danger text-center">Kesalahan: Fungsi autentikasi tidak ditemukan. Kembali ke <a href="/">Dashboard</a>.</p>';
            orderListDiv.innerHTML = '';
            loadMoreBtn.style.display = 'none';
            return [];
        }

        const currentUser = window.loadUserFromLocalStorage(); // Fungsi dari dashboard.js
        if (!currentUser) {
            // Pengguna belum login, tampilkan pesan dan sembunyikan elemen terkait
            noOrdersMessage.style.display = 'block';
            noOrdersMessage.innerHTML = '<p class="text-secondary text-center">Anda harus login untuk melihat riwayat pesanan. Kembali ke <a href="/">Dashboard</a>.</p>';
            orderListDiv.innerHTML = ''; // Pastikan tidak ada konten sebelumnya
            loadMoreBtn.style.display = 'none';
            return [];
        }

        const ordersKey = `orders_${currentUser.username}`;
        let userOrders = JSON.parse(localStorage.getItem(ordersKey)); // Parse langsung tanpa OR

        // Logic PERBAIKAN: Jika userOrders null (belum ada di localStorage) atau array kosong,
        // maka generate dummy data dan simpan ke localStorage.
        if (!userOrders || userOrders.length === 0) {
            userOrders = generateDummyOrders(15);
            localStorage.setItem(ordersKey, JSON.stringify(userOrders)); // Simpan data dummy yang baru dibuat
        }
        
        // Urutkan pesanan terbaru lebih dulu (opsional, tapi bagus untuk riwayat)
        userOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
        return userOrders;
    }

    // Fungsi dummy untuk menghasilkan data pesanan palsu (mirip dengan yang di awal)
    function generateDummyOrders(count) {
        const dummyOrders = [];
        const productNames = [
            "Beras Premium", "Minyak Goreng", "Susu UHT", "Telur Ayam", "Kopi Instan",
            "Sabun Mandi", "Pasta Gigi", "Deterjen Pakaian", "Obat Nyamuk Semprot", "Snack Kentang"
        ];
        const statusOptions = ['Selesai', 'Diproses', 'Dikirim', 'Dibatalkan', 'Pending'];

        for (let i = 0; i < count; i++) {
            const orderId = `TRSMK-${Math.floor(Math.random() * 1000000000).toString(36).substring(0, 8).toUpperCase()}`;
            const date = new Date(Date.now() - (i * (2 + Math.random()) * 24 * 60 * 60 * 1000)); // Pesanan lebih lama
            const orderDateFormatted = date.toLocaleDateString('id-ID', {
                year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
            });
            const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];

            const numItems = Math.floor(Math.random() * 3) + 1; // 1 to 3 items per order
            const items = [];
            let total = 0;

            for (let j = 0; j < numItems; j++) {
                const randomProduct = productNames[Math.floor(Math.random() * productNames.length)];
                const price = Math.floor(Math.random() * 50000) + 5000; // Harga acak
                const quantity = Math.floor(Math.random() * 3) + 1; // Jumlah acak
                items.push({ name: randomProduct, price: price, quantity: quantity, returned: false }); // Add 'returned' status
                total += price * quantity;
            }

            dummyOrders.push({ orderId, date: orderDateFormatted, status, items, total });
        }
        return dummyOrders;
    }

    /**
     * Merender daftar pesanan ke DOM.
     * Menampilkan sejumlah pesanan per halaman dan mengelola tombol "Muat Lebih Banyak".
     */
    function renderOrders() {
        const startIndex = currentPage * ordersPerPage;
        const endIndex = startIndex + ordersPerPage;
        const ordersToDisplay = ordersData.slice(startIndex, endIndex);

        if (ordersToDisplay.length === 0 && currentPage === 0) {
            noOrdersMessage.style.display = 'block';
            loadMoreBtn.style.display = 'none';
            return;
        } else {
            noOrdersMessage.style.display = 'none';
        }

        ordersToDisplay.forEach(order => {
            const orderCard = document.createElement('div');
            orderCard.classList.add('order-card');

            const itemsHtml = order.items.map((item) => `
                <div class="item">
                    <span>${item.name} (${item.quantity}x)</span>
                    <span>Rp ${item.price.toLocaleString('id-ID')}</span>
                </div>
            `).join('');

            // Only show return button for 'Selesai' (Completed) orders and if not all items are returned
            const allItemsReturned = order.items.every(item => item.returned);
            const returnButtonHtml = (order.status === 'Selesai' && !allItemsReturned) ?
                `<button class="btn btn-return" data-order-id="${order.orderId}">Ajukan Pengembalian</button>` : '';

            orderCard.innerHTML = `
                <h3>Pesanan #${order.orderId}</h3>
                <p><strong>Tanggal Pesanan:</strong> ${order.date}</p>
                <p><strong>Status:</strong> <span class="status-badge ${order.status.toLowerCase()}">${order.status}</span></p>
                <div class="items-list">
                    <h4>Detail Item:</h4>
                    ${itemsHtml}
                </div>
                <p class="total">Total Pesanan: Rp ${order.total.toLocaleString('id-ID')}</p>
                ${returnButtonHtml}
            `;
            orderListDiv.appendChild(orderCard);
        });

        // Add event listeners to newly created return buttons
        // Use event delegation for more efficient handling of dynamically added buttons
        orderListDiv.querySelectorAll('.btn-return').forEach(button => {
            button.removeEventListener('click', handleReturnButtonClick); // Prevent duplicate listeners
            button.addEventListener('click', handleReturnButtonClick);
        });
        
        // Tampilkan/Sembunyikan tombol "Muat Lebih Banyak"
        if (endIndex >= ordersData.length) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'block';
        }
    }

    function handleReturnButtonClick(event) {
        const orderId = event.target.dataset.orderId;
        currentOrderForReturn = ordersData.find(order => order.orderId === orderId);

        if (currentOrderForReturn) {
            returnOrderIdDisplay.textContent = currentOrderForReturn.orderId;
            returnItemsList.innerHTML = ''; // Clear previous items

            const itemsToDisplayForReturn = currentOrderForReturn.items.filter(item => !item.returned);

            if (itemsToDisplayForReturn.length === 0) {
                returnMessage.textContent = 'Semua item dalam pesanan ini sudah dikembalikan.';
                returnMessage.style.display = 'block';
                returnMessage.style.color = 'orange';
                // Optionally, hide the modal or disable submit if nothing to return
                return;
            }

            itemsToDisplayForReturn.forEach((item, index) => {
                // Find original index to mark 'returned' status correctly in ordersData
                // This logic needs to be careful if duplicate items exist and some are already returned.
                // For simplicity, we just take the first unreturned instance that matches.
                const originalIndex = currentOrderForReturn.items.findIndex(originalItem => 
                    originalItem.name === item.name && 
                    originalItem.price === item.price && 
                    originalItem.quantity === item.quantity &&
                    !originalItem.returned // Ensure we target the specific unreturned item instance if duplicates exist
                );
                
                if (originalIndex !== -1) {
                    const checkboxDiv = document.createElement('div');
                    checkboxDiv.innerHTML = `
                        <label>
                            <input type="checkbox" name="returnItem" value="${originalIndex}">
                            ${item.name} (${item.quantity}x) - Rp ${item.price.toLocaleString('id-ID')}
                        </label>
                    `;
                    returnItemsList.appendChild(checkboxDiv);
                }
            });

            returnReasonInput.value = ''; // Clear previous reason
            returnMessage.style.display = 'none'; // Hide any previous messages
            returnModal.style.display = 'flex'; // Use flex to center the modal
        }
    }

    // Event listener for closing the return modal
    if (closeReturnModalBtn) {
        closeReturnModalBtn.addEventListener('click', () => {
            if (returnModal) returnModal.style.display = 'none';
        });
    }

    // Close modal when clicking outside of it
    window.addEventListener('click', (event) => {
        if (event.target === returnModal) {
            returnModal.style.display = 'none';
        }
    });

    // Handle return form submission
    if (returnForm) {
        returnForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const reason = returnReasonInput.value.trim();
            const selectedItemsCheckboxes = returnItemsList.querySelectorAll('input[name="returnItem"]:checked');
            const selectedItemsIndices = Array.from(selectedItemsCheckboxes).map(checkbox => parseInt(checkbox.value));

            if (!reason) {
                returnMessage.textContent = 'Alasan pengembalian tidak boleh kosong.';
                returnMessage.style.display = 'block';
                returnMessage.style.color = 'red';
                return;
            }

            if (selectedItemsIndices.length === 0) {
                returnMessage.textContent = 'Pilih setidaknya satu item untuk dikembalikan.';
                returnMessage.style.display = 'block';
                returnMessage.style.color = 'red';
                return;
            }

            // Simulate API call for return request
            console.log(`Return request for Order ID: ${currentOrderForReturn.orderId}`);
            console.log(`Reason: ${reason}`);
            console.log('Selected Items:', selectedItemsIndices.map(index => currentOrderForReturn.items[index].name));

            // Mark items as returned (for demonstration purposes in localStorage)
            selectedItemsIndices.forEach(index => {
                if (currentOrderForReturn && currentOrderForReturn.items[index]) {
                    currentOrderForReturn.items[index].returned = true;
                }
            });

            // Update the order's status if all items in the original order are returned
            const allItemsInOrderReturned = currentOrderForReturn.items.every(item => item.returned);
            if (allItemsInOrderReturned) {
                currentOrderForReturn.status = 'Dikembalikan'; // New status for fully returned orders
            }

            // Save updated orders data to localStorage
            if (typeof window.loadUserFromLocalStorage === 'function') {
                const currentUser = window.loadUserFromLocalStorage();
                if (currentUser) {
                    const ordersKey = `orders_${currentUser.username}`;
                    localStorage.setItem(ordersKey, JSON.stringify(ordersData));
                }
            } else {
                 console.error("Cannot save order history: window.loadUserFromLocalStorage is not defined.");
            }

            returnMessage.textContent = 'Permintaan pengembalian Anda telah diajukan. Kami akan segera memprosesnya.';
            returnMessage.style.display = 'block';
            returnMessage.style.color = 'green';

            // Clear and re-render orders after a short delay to show changes
            setTimeout(() => {
                if (returnModal) returnModal.style.display = 'none';
                if (orderListDiv) orderListDiv.innerHTML = ''; // Clear current display
                currentPage = 0; // Reset pagination
                ordersData = fetchUserOrders(); // Re-fetch updated data
                renderOrders(); // Render with updated data
                if (typeof window.showToast === 'function') {
                    window.showToast('Permintaan pengembalian berhasil diajukan!', 'success');
                }
            }, 1500); // Simulate processing time
        });
    }

    // Event listener untuk tombol "Muat Lebih Banyak"
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            currentPage++;
            renderOrders();
        });
    }

    // Inisialisasi halaman saat DOM selesai dimuat
    ordersData = fetchUserOrders();
    renderOrders();
});