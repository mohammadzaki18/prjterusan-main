// order_history.js
document.addEventListener('DOMContentLoaded', () => {
    // Memastikan fungsi-fungsi global dari dashboard.js dimuat
    window.updateAuthUI();
    // Jika perlu, Anda bisa memanggil `window.setupAuthModals()` di sini
    // jika halaman riwayat pesanan juga memiliki modal login/register yang perlu diinisialisasi.

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
    let ordersPerPage = 5;
    let currentPage = 0;
    let currentOrderForReturn = null; // To store the order being returned

    /**
     * Mengambil data pesanan dari localStorage berdasarkan pengguna yang login.
     * Dalam aplikasi nyata, ini akan menjadi panggilan API ke backend.
     */
    function fetchUserOrders() {
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
        // Ambil data pesanan dari localStorage. Jika tidak ada, kembalikan array kosong.
        // Data pesanan dummy di sini untuk demonstrasi
        let userOrders = JSON.parse(localStorage.getItem(ordersKey)) || generateDummyOrders(15);
        
        // Simpan kembali dummy data ke localStorage jika belum ada, agar konsisten
        if (!localStorage.getItem(ordersKey)) {
            localStorage.setItem(ordersKey, JSON.stringify(userOrders));
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

            let itemsHtml = order.items.map((item, index) => `
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
        document.querySelectorAll('.btn-return').forEach(button => {
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

            currentOrderForReturn.items.forEach((item, index) => {
                if (!item.returned) { // Only show items that haven't been returned
                    const checkboxDiv = document.createElement('div');
                    checkboxDiv.innerHTML = `
                        <label>
                            <input type="checkbox" name="returnItem" value="${index}">
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
    closeReturnModalBtn.addEventListener('click', () => {
        returnModal.style.display = 'none';
    });

    // Close modal when clicking outside of it
    window.addEventListener('click', (event) => {
        if (event.target === returnModal) {
            returnModal.style.display = 'none';
        }
    });

    // Handle return form submission
    returnForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const reason = returnReasonInput.value.trim();
        const selectedItems = Array.from(returnItemsList.querySelectorAll('input[name="returnItem"]:checked'))
                               .map(checkbox => parseInt(checkbox.value));

        if (!reason) {
            returnMessage.textContent = 'Alasan pengembalian tidak boleh kosong.';
            returnMessage.style.display = 'block';
            returnMessage.style.color = 'red';
            return;
        }

        if (selectedItems.length === 0) {
            returnMessage.textContent = 'Pilih setidaknya satu item untuk dikembalikan.';
            returnMessage.style.display = 'block';
            returnMessage.style.color = 'red';
            return;
        }

        // Simulate API call for return request
        console.log(`Return request for Order ID: ${currentOrderForReturn.orderId}`);
        console.log(`Reason: ${reason}`);
        console.log('Selected Items:', selectedItems.map(index => currentOrderForReturn.items[index].name));

        // Mark items as returned (for demonstration purposes in localStorage)
        selectedItems.forEach(index => {
            currentOrderForReturn.items[index].returned = true;
        });

        // Update the order's status if all items are returned
        const allItemsReturned = currentOrderForReturn.items.every(item => item.returned);
        if (allItemsReturned) {
            currentOrderForReturn.status = 'Dikembalikan'; // New status for fully returned orders
        }

        // Save updated orders data to localStorage
        const currentUser = window.loadUserFromLocalStorage();
        if (currentUser) {
            const ordersKey = `orders_${currentUser.username}`;
            localStorage.setItem(ordersKey, JSON.stringify(ordersData));
        }

        returnMessage.textContent = 'Permintaan pengembalian Anda telah diajukan. Kami akan segera memprosesnya.';
        returnMessage.style.display = 'block';
        returnMessage.style.color = 'green';

        // Clear and re-render orders after a short delay to show changes
        setTimeout(() => {
            returnModal.style.display = 'none';
            orderListDiv.innerHTML = ''; // Clear current display
            currentPage = 0; // Reset pagination
            ordersData = fetchUserOrders(); // Re-fetch updated data
            renderOrders(); // Render with updated data
            window.showToast('Permintaan pengembalian berhasil diajukan!', 'success');
        }, 1500); // Simulate processing time
    });

    // Event listener untuk tombol "Muat Lebih Banyak"
    loadMoreBtn.addEventListener('click', () => {
        currentPage++;
        renderOrders();
    });

    // Inisialisasi halaman saat DOM selesai dimuat
    ordersData = fetchUserOrders();
    renderOrders();
});