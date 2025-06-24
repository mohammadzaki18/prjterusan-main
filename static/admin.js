// admin.js

document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    const currentSectionTitle = document.getElementById('currentSectionTitle');
    const headerActionsContainer = document.querySelector('.admin-header .header-actions');

    // Function to show the active section and update active link
    function showSection(sectionId) {
        // Hide all content sections
        contentSections.forEach(section => {
            section.classList.remove('active');
            // Also hide any active forms within sections when switching sections
            if (section.id !== sectionId) {
                const formsInside = section.querySelectorAll('.content-section[id$="-form"]');
                formsInside.forEach(form => form.style.display = 'none');
            }
        });

        // Show the target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Deactivate all nav links
        navLinks.forEach(link => {
            link.classList.remove('active');
        });

        // Activate the clicked nav link
        const activeLink = document.querySelector(`.nav-link[data-section="${sectionId}"]`);
        if (activeLink) {
            currentSectionTitle.textContent = activeLink.textContent.trim(); // Update header title
            activeLink.classList.add('active');
        } else if (sectionId === 'home') { // Special handling for 'Kembali ke Toko'
             currentSectionTitle.textContent = "TerusanMinimarket"; // Or hide title
        }

        // Update header action buttons
        updateHeaderActions(sectionId);

        // --- Handle specific section behaviors here ---
        // For Analytics: if you integrate a charting library,
        // you'd typically initialize/update charts when the analytics section becomes active.
        if (sectionId === 'analytics') {
            // Example for Chart.js (if you include it in HTML):
            // const ctxSales = document.getElementById('monthlySalesChart').getContext('2d');
            // if (!window.monthlySalesChartInstance) {
            //     window.monthlySalesChartInstance = new Chart(ctxSales, {
            //         type: 'bar',
            //         data: {
            //             labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'],
            //             datasets: [{
            //                 label: 'Penjualan Bulanan (Rp)',
            //                 data: [1500000, 1800000, 2200000, 1900000, 2500000, 2800000],
            //                 backgroundColor: 'rgba(41, 128, 185, 0.7)',
            //                 borderColor: 'rgba(41, 128, 185, 1)',
            //                 borderWidth: 1
            //             }]
            //         },
            //         options: {
            //             responsive: true,
            //             scales: {
            //                 y: {
            //                     beginAtZero: true
            //                 }
            //             }
            //         }
            //     });
            // } else {
            //     window.monthlySalesChartInstance.update();
            // }

            // const ctxProducts = document.getElementById('topProductsChart').getContext('2d');
            // if (!window.topProductsChartInstance) {
            //     window.topProductsChartInstance = new Chart(ctxProducts, {
            //         type: 'pie',
            //         data: {
            //             labels: ['Kopi Robusta', 'Mie Instan', 'Susu UHT', 'Lainnya'],
            //             datasets: [{
            //                 label: 'Produk Terlaris',
            //                 data: [1500, 1200, 900, 800],
            //                 backgroundColor: [
            //                     'rgba(231, 76, 60, 0.7)',
            //                     'rgba(46, 204, 113, 0.7)',
            //                     'rgba(52, 152, 219, 0.7)',
            //                     'rgba(149, 165, 166, 0.7)'
            //                 ],
            //                 borderColor: [
            //                     'rgba(231, 76, 60, 1)',
            //                     'rgba(46, 204, 113, 1)',
            //                     'rgba(52, 152, 219, 1)',
            //                     'rgba(149, 165, 166, 1)'
            //                 ],
            //                 borderWidth: 1
            //             }]
            //         },
            //         options: {
            //             responsive: true,
            //         }
            //     });
            // } else {
            //     window.topProductsChartInstance.update();
            // }
        }
    }

    // Function to update header actions dynamically
    function updateHeaderActions(sectionId) {
        headerActionsContainer.innerHTML = ''; // Clear previous buttons
        if (sectionId === 'products') {
            headerActionsContainer.innerHTML = `
                <button class="btn btn-success add-new-btn" data-target-form="add-product-form"><i class="fas fa-plus"></i> Tambah Produk</button>
                <button class="btn btn-outline-secondary"><i class="fas fa-filter"></i> Filter</button>
            `;
        } else if (sectionId === 'categories') {
            headerActionsContainer.innerHTML = `
                <button class="btn btn-success add-new-btn" data-target-form="add-category-form"><i class="fas fa-plus"></i> Tambah Kategori</button>
            `;
        } else if (sectionId === 'orders') {
            headerActionsContainer.innerHTML = `
                <button class="btn btn-outline-secondary"><i class="fas fa-filter"></i> Filter Status</button>
                <button class="btn btn-outline-secondary"><i class="fas fa-calendar-alt"></i> Filter Tanggal</button>
            `;
        } else if (sectionId === 'users') {
            headerActionsContainer.innerHTML = `
                <button class="btn btn-success add-new-btn" data-target-form="add-user-form"><i class="fas fa-user-plus"></i> Tambah Pengguna</button>
                <button class="btn btn-outline-secondary"><i class="fas fa-filter"></i> Filter Role</button>
            `;
        } else if (sectionId === 'analytics') {
             headerActionsContainer.innerHTML = `
                <button class="btn btn-primary"><i class="fas fa-download"></i> Unduh Laporan</button>
            `;
        } else if (sectionId === 'settings') {
             headerActionsContainer.innerHTML = `
                <button type="submit" form="settings-form-id" class="btn btn-primary"><i class="fas fa-save"></i> Simpan Pengaturan</button>
            `;
            // Note: For settings, you'd typically have the save button inside the form,
            // or explicitly link it to the form using `form="form-id"` attribute.
            // I've added a dummy form-id in the HTML for clarity here if you choose this path.
        }
    }


    // Event listener for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default anchor link behavior
            const sectionId = this.dataset.section;
            if (sectionId) {
                showSection(sectionId);
            } else if (this.classList.contains('logout-link')) {
                // If it's a "Back to Shop" link, allow default behavior or handle logout
                window.location.href = this.href;
            }
        });
    });

    // Event listener for "Add New" buttons (Products, Categories, Users)
    document.addEventListener('click', function(event) {
        if (event.target.closest('.add-new-btn')) {
            const button = event.target.closest('.add-new-btn');
            const targetFormId = button.dataset.targetForm;
            const currentSection = button.closest('.content-section');

            if (currentSection) {
                currentSection.classList.remove('active'); // Hide the list view
            }
            const targetForm = document.getElementById(targetFormId);
            if (targetForm) {
                targetForm.classList.add('active'); // Show the form view
                targetForm.style.display = 'block'; // Ensure it's displayed
                currentSectionTitle.textContent = targetForm.querySelector('h2').textContent.trim(); // Update title
                headerActionsContainer.innerHTML = ''; // Clear header actions when form is open
            }
        }
    });

    // Event listener for "Cancel" buttons in forms
    document.addEventListener('click', function(event) {
        if (event.target.closest('.cancel-form-btn')) {
            const button = event.target.closest('.cancel-form-btn');
            const targetSectionId = button.dataset.targetSection;
            const currentForm = button.closest('.content-section');

            if (currentForm) {
                currentForm.classList.remove('active');
                currentForm.style.display = 'none'; // Hide the form
            }
            showSection(targetSectionId); // Go back to the main section list
        }
    });

    // Dummy alerts for form submissions
    document.querySelectorAll('.add-product-form, .add-category-form, .add-user-form').forEach(form => {
        form.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent actual form submission
            alert(`Data ${this.querySelector('h2').textContent.replace('Form', '').trim()} berhasil disimpan! (Ini hanya demo frontend)`);
            const targetSectionId = this.classList.contains('add-product-form') ? 'products' :
                                    this.classList.contains('add-category-form') ? 'categories' :
                                    'users';
            // Optionally, reset form fields
            this.reset();
            // Go back to the list view
            this.classList.remove('active');
            this.style.display = 'none';
            showSection(targetSectionId);
        });
    });

    // Dummy alerts for table action buttons (Edit, Delete, Detail, Proses, Kirim, Setujui, Tolak, Print Invoice)
    document.addEventListener('click', function(event) {
        const button = event.target.closest('.btn-sm');
        if (button) {
            const action = button.dataset.action;
            const row = button.closest('tr');
            if (row) {
                const idCell = row.querySelector('td:first-child');
                const id = idCell ? idCell.textContent.trim() : 'unknown ID';
                alert(`Aksi '${action}' untuk item ID ${id} akan diimplementasikan di backend!`);
            } else {
                 alert(`Aksi '${action}' akan diimplementasikan di backend!`);
            }
        }
    });


    // Initialize the dashboard view on load
    showSection('dashboard');
});