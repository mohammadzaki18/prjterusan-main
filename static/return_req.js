// return_req.js

document.addEventListener('DOMContentLoaded', () => {
    const returnRequestForm = document.getElementById('returnRequestForm');
    const returnReasonSelect = document.getElementById('returnReason');
    const otherReasonGroup = document.getElementById('otherReasonGroup');
    const otherReasonTextarea = document.getElementById('otherReason');
    const productImageInput = document.getElementById('productImage');
    const imagePreviewDiv = document.getElementById('imagePreview');
    const returnMessageArea = document.getElementById('returnMessage');

    // Show/hide "other reason" textarea based on selection
    if (returnReasonSelect) {
        returnReasonSelect.addEventListener('change', () => {
            if (returnReasonSelect.value === 'lainnya') {
                otherReasonGroup.style.display = 'block';
                otherReasonTextarea.setAttribute('required', 'true');
            } else {
                otherReasonGroup.style.display = 'none';
                otherReasonTextarea.removeAttribute('required');
                otherReasonTextarea.value = ''; // Clear content if hidden
            }
            // Clear any previous error messages related to this field
            displayMessage(returnMessageArea, '', '');
        });
    }

    // Image preview functionality
    if (productImageInput) {
        productImageInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                // Check file size (max 5MB)
                const maxSize = 5 * 1024 * 1024; // 5MB in bytes
                if (file.size > maxSize) {
                    displayMessage(returnMessageArea, 'Ukuran file terlalu besar. Maksimal 5MB.', 'error');
                    productImageInput.value = ''; // Clear the input
                    imagePreviewDiv.innerHTML = 'Pilih gambar produk (Opsional)';
                    return;
                }

                // Check file type
                const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
                if (!allowedTypes.includes(file.type)) {
                    displayMessage(returnMessageArea, 'Format file tidak didukung. Mohon gunakan JPG, PNG, atau GIF.', 'error');
                    productImageInput.value = ''; // Clear the input
                    imagePreviewDiv.innerHTML = 'Pilih gambar produk (Opsional)';
                    return;
                }


                const reader = new FileReader();
                reader.onload = (e) => {
                    imagePreviewDiv.innerHTML = `<img src="${e.target.result}" alt="Product Image Preview">`;
                };
                reader.readAsDataURL(file);
            } else {
                imagePreviewDiv.innerHTML = 'Pilih gambar produk (Opsional)';
            }
            // Clear previous messages after successful file selection or clearing
            displayMessage(returnMessageArea, '', '');
        });
    }

    // Handle form submission
    if (returnRequestForm) {
        returnRequestForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent default form submission

            // Clear previous messages
            displayMessage(returnMessageArea, '', '');

            const orderId = document.getElementById('orderId').value.trim();
            const productName = document.getElementById('productName').value.trim();
            const returnReason = returnReasonSelect.value;
            const otherReason = otherReasonTextarea.value.trim();
            const returnDetails = document.getElementById('returnDetails').value.trim();
            const productImage = productImageInput.files[0];

            // Basic validation
            if (!orderId || !productName || !returnReason) {
                displayMessage(returnMessageArea, 'Mohon lengkapi semua kolom yang wajib diisi (*).', 'error');
                return;
            }

            if (returnReason === 'lainnya' && !otherReason) {
                displayMessage(returnMessageArea, 'Mohon jelaskan alasan pengembalian Anda pada kolom "Jelaskan Alasan Lainnya".', 'error');
                return;
            }

            // Simulate form submission (replace with actual API call)
            console.log('Mengirim pengajuan pengembalian:');
            console.log('Nomor Pesanan:', orderId);
            console.log('Nama Produk:', productName);
            console.log('Alasan Pengembalian:', returnReason);
            if (returnReason === 'lainnya') {
                console.log('Alasan Lainnya:', otherReason);
            }
            console.log('Detail Pengembalian:', returnDetails);
            if (productImage) {
                console.log('Gambar Produk:', productImage.name, `(${productImage.size} bytes)`);
            } else {
                console.log('Tidak ada gambar produk diunggah.');
            }

            // In a real application, you would send this data to a server using fetch or XMLHttpRequest.
            // Example of a mock successful submission:
            displayMessage(returnMessageArea, 'Mengirim pengajuan...', ''); // Indicate submission is in progress
            setTimeout(() => {
                displayMessage(returnMessageArea, 'Pengajuan pengembalian Anda berhasil dikirim! Kami akan segera memprosesnya.', 'success');
                returnRequestForm.reset(); // Clear the form
                otherReasonGroup.style.display = 'none'; // Hide "other reason" field
                imagePreviewDiv.innerHTML = 'Pilih gambar produk (Opsional)'; // Clear image preview
                // Optionally scroll to top or message area for better UX
                returnMessageArea.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 1500); // Simulate network delay
        });
    }

    function displayMessage(element, message, type) {
        element.textContent = message;
        element.className = 'message-area'; // Reset classes
        if (type === 'success') {
            element.classList.add('success');
        } else if (type === 'error') {
            element.classList.add('error');
        }
        // Set aria-live for screen readers
        if (message) {
            element.setAttribute('aria-live', 'assertive');
        } else {
            element.removeAttribute('aria-live');
        }
    }

    // Add search functionality (similar to dashboard.js)
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                const query = searchInput.value;
                if (query) {
                    alert(`Mencari produk: ${query}`);
                    // In a real application, you would redirect to a search results page
                    // window.location.href = `/search?q=${encodeURIComponent(query)}`;
                }
            }
        });
    }
});