// profile.js - Logic for the user profile page.
// This script relies on global functions exposed by dashboard.js

document.addEventListener("DOMContentLoaded", function() {
    const profileForm = document.getElementById("profileForm");
    const profileUsernameInput = document.getElementById("profileUsername");
    const profileNameInput = document.getElementById("profileName");
    const profileEmailInput = document.getElementById("profileEmail");
    const profilePhoneInput = document.getElementById("profilePhone");
    const profileMessage = document.getElementById("profileMessage"); // Referensi ke elemen pesan error profil

    // New detailed profile address input fields
    const profileReceiverNameInput = document.getElementById("profileReceiverName");
    const profileReceiverPhoneInput = document.getElementById("profileReceiverPhone");
    const profileFullAddressInput = document.getElementById("profileFullAddress");
    const profileRtRwInput = document.getElementById("profileRtRw");
    const profileProvinceInput = document.getElementById("profileProvince");
    const profileKabupatenInput = document.getElementById("profileKabupaten");
    const profileCityInput = document.getElementById("profileCity");
    const profilePostalCodeInput = document.getElementById("profilePostalCode");
    const profileLocationDetailsInput = document.getElementById("profileLocationDetails");
    const profileNamaAlamatInput = document.getElementById("profileNamaAlamat");


    // Address Modal elements (Ini sudah benar dan seharusnya tidak diubah)
    const addressModal = document.getElementById("addressModal");
    const closeAddressModalBtn = document.getElementById("closeAddressModal");
    const addressModalTitle = document.getElementById("addressModalTitle");
    const addressForm = document.getElementById("addressForm");
    const addressIdInput = document.getElementById("addressId");
    const addressReceiverNameInput = document.getElementById("addressReceiverName");
    const addressReceiverPhoneInput = document.getElementById("addressReceiverPhone");
    const addressFullAddressInput = document.getElementById("addressFullAddress");
    const addressRtRwInput = document.getElementById("addressRtRw");
    const addressProvinceInput = document.getElementById("addressProvince");
    const addressKabupatenInput = document.getElementById("addressKabupaten");
    const addressCityInput = document.getElementById("addressCity");
    const addressPostalCodeInput = document.getElementById("addressPostalCode");
    const addressLocationDetailsInput = document.getElementById("addressLocationDetails");
    const addressNamaAlamatInput = document.getElementById("addressNamaAlamat");
    const btnSaveAddress = document.getElementById("btnSaveAddress");
    const addressFormMessage = document.getElementById("addressFormMessage"); // Referensi ke elemen pesan error form alamat

    const btnAddAddress = document.getElementById("btnAddAddress");
    const addressesList = document.getElementById("addressesList");
    const addressMessage = document.getElementById("addressMessage"); // Referensi ke elemen pesan untuk daftar alamat


    /**
     * Loads user profile data from the backend and populates the form.
     * Exposed globally to be called by dashboard.js after login check.
     */
    window.loadUserProfile = async function() {
        if (!profileForm) return; // Ensure profile elements exist

        // First, check login status from the backend
        const authResponse = await fetch("/api/get_current_user/", { method: "GET", credentials: "include" });
        const authData = await authResponse.json();

        if (!authData.is_authenticated) {
            if (profileMessage) profileMessage.textContent = "Anda harus login untuk melihat profil.";
            profileForm.style.display = 'none'; // Hide form if not logged in
            if (btnAddAddress) btnAddAddress.style.display = 'none'; // Hide add address button
            if (addressesList) addressesList.style.display = 'none'; // Hide addresses list
            window.showLoginModal();
            return;
        }

        profileForm.style.display = 'block'; // Show form if logged in
        if (btnAddAddress) btnAddAddress.style.display = 'block'; // Show add address button
        if (addressesList) addressesList.style.display = 'block'; // Show addresses list
        if (profileMessage) profileMessage.textContent = "";

        try {
            // Fetch current user details from backend (assuming a /api/profile endpoint)
            const response = await fetch("/api/profile/", {
                method: "GET",
                headers: {
                    "X-CSRFToken": window.getCsrfToken(),
                },
                credentials: "include",
            });
            const data = await response.json();

            if (response.ok && data.success) {
                profileUsernameInput.value = data.username || '';
                profileNameInput.value = data.name || '';
                profileEmailInput.value = data.email || '';
                profilePhoneInput.value = data.phone || '';

                // Populate new detailed address fields for profile
                profileReceiverNameInput.value = data.receiver_name || '';
                profileReceiverPhoneInput.value = data.receiver_phone || '';
                profileFullAddressInput.value = data.full_address || '';
                profileRtRwInput.value = data.rt_rw || '';
                profileProvinceInput.value = data.province || '';
                profileKabupatenInput.value = data.kabupaten || '';
                profileCityInput.value = data.city || '';
                profilePostalCodeInput.value = data.postal_code || '';
                profileLocationDetailsInput.value = data.location_details || '';
                profileNamaAlamatInput.value = data.nama_alamat || '';

                window.showToast("Profil berhasil dimuat.", "success");
                loadUserAddresses(); // Load all addresses after profile is loaded
            } else {
                if (profileMessage) profileMessage.textContent = data.message || "Gagal memuat profil.";
                window.showToast("Gagal memuat profil.", "error");
            }
        } catch (error) {
            console.error("Error loading profile:", error);
            if (profileMessage) profileMessage.textContent = "Terjadi kesalahan saat memuat profil.";
            window.showToast("Terjadi kesalahan saat memuat profil.", "error");
        }
    };

    /**
     * Handles updating user profile data.
     */
    if (profileForm) {
        profileForm.addEventListener("submit", async function(e) {
            e.preventDefault();

            // Re-check login status before saving
            const authResponse = await fetch("/api/get_current_user/", { method: "GET", credentials: "include" });
            const authData = await authResponse.json();

            if (!authData.is_authenticated) {
                window.showToast("Anda harus login untuk menyimpan profil.", "error");
                window.showLoginModal();
                return;
            }

            const updatedData = {
                // Username typically cannot be changed
                name: profileNameInput.value.trim(),
                email: profileEmailInput.value.trim(),
                phone: profilePhoneInput.value.trim(),
                // Collect data from new detailed address fields for profile
                receiver_name: profileReceiverNameInput.value.trim(),
                receiver_phone: profileReceiverPhoneInput.value.trim(),
                full_address: profileFullAddressInput.value.trim(),
                rt_rw: profileRtRwInput.value.trim(),
                province: profileProvinceInput.value.trim(),
                kabupaten: profileKabupatenInput.value.trim(),
                city: profileCityInput.value.trim(),
                postal_code: profilePostalCodeInput.value.trim(),
                location_details: profileLocationDetailsInput.value.trim(),
                nama_alamat: profileNamaAlamatInput.value.trim(),
            };

            try {
                const response = await fetch("/api/profile/", {
                    method: "POST", // Or PUT/PATCH depending on your API design
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": window.getCsrfToken(),
                    },
                    credentials: "include",
                    body: JSON.stringify(updatedData),
                });
                const data = await response.json();

                if (response.ok && data.success) {
                    window.showToast(data.message || "Profil berhasil diperbarui!", "success");
                    window.checkLoginStatus(); // Re-check status to update header UI
                } else {
                    if (profileMessage) profileMessage.textContent = data.message || "Gagal memperbarui profil.";
                    window.showToast("Gagal memperbarui profil.", "error");
                }
            } catch (error) {
                console.error("Error updating profile:", error);
                if (profileMessage) profileMessage.textContent = "Terjadi kesalahan saat memperbarui profil.";
                window.showToast("Terjadi kesalahan saat memperbarui profil.", "error");
            }
        });
    }

    /**
     * Loads user addresses from the backend and displays them.
     */
    async function loadUserAddresses() {
        if (!addressesList) return;
        addressesList.innerHTML = ''; // Clear existing addresses
        if (addressMessage) addressMessage.textContent = '';

        try {
            const response = await fetch("/api/addresses/", { // Assuming a new API endpoint for addresses
                method: "GET",
                headers: {
                    "X-CSRFToken": window.getCsrfToken(),
                },
                credentials: "include",
            });
            const data = await response.json();

            if (response.ok && data.success) {
                if (data.addresses && data.addresses.length > 0) {
                    data.addresses.forEach(address => {
                        const addressDiv = document.createElement("div");
                        addressDiv.className = "address-item";
                        addressDiv.innerHTML = `
                            <h4>${address.nama_alamat || 'Alamat Tersimpan'}</h4>
                            <p><strong>Penerima:</strong> ${address.receiver_name}</p>
                            <p><strong>Telepon:</strong> ${address.receiver_phone}</p>
                            <p><strong>Alamat:</strong> ${address.full_address}, RT/RW ${address.rt_rw}, ${address.city}, ${address.kabupaten}, ${address.province}, ${address.postal_code}</p>
                            ${address.location_details ? `<p><strong>Keterangan:</strong> ${address.location_details}</p>` : ''}
                            <button type="button" class="btn btn-sm btn-outline-primary edit-address-btn" data-id="${address.id}">Edit</button>
                            <button type="button" class="btn btn-sm btn-outline-danger delete-address-btn" data-id="${address.id}">Hapus</button>
                        `;
                        addressesList.appendChild(addressDiv);
                    });
                    addAddressEventListeners();
                } else {
                    if (addressMessage) addressMessage.textContent = "Anda belum memiliki alamat tersimpan.";
                }
            } else {
                if (addressMessage) addressMessage.textContent = data.message || "Gagal memuat daftar alamat.";
                window.showToast("Gagal memuat daftar alamat.", "error");
            }
        } catch (error) {
            console.error("Error loading addresses:", error);
            if (addressMessage) addressMessage.textContent = "Terjadi kesalahan saat memuat alamat.";
            window.showToast("Terjadi kesalahan saat memuat alamat.", "error");
        }
    }

    /**
     * Adds event listeners to dynamically created edit/delete address buttons.
     */
    function addAddressEventListeners() {
        document.querySelectorAll(".edit-address-btn").forEach(button => {
            button.addEventListener("click", function() {
                const addressId = this.dataset.id;
                editAddress(addressId);
            });
        });

        document.querySelectorAll(".delete-address-btn").forEach(button => {
            button.addEventListener("click", function() {
                const addressId = this.dataset.id;
                deleteAddress(addressId);
            });
        });
    }

    /**
     * Opens the address modal for adding a new address.
     */
    if (btnAddAddress) {
        btnAddAddress.addEventListener("click", function() {
            addressModalTitle.textContent = "Tambahkan Alamat Baru";
            addressForm.reset(); // Clear form fields
            addressIdInput.value = ''; // Ensure no ID is set for new address
            btnSaveAddress.textContent = "Simpan Alamat";
            addressFormMessage.textContent = '';
            addressModal.style.display = "flex"; // Show modal
        });
    }

    /**
     * Closes the address modal.
     */
    if (closeAddressModalBtn) {
        closeAddressModalBtn.addEventListener("click", function() {
            addressModal.style.display = "none";
        });
    }

    // Close modal if clicking outside content
    window.addEventListener("click", function(event) {
        if (event.target == addressModal) {
            addressModal.style.display = "none";
        }
    });

    /**
     * Handles saving (adding or updating) an address.
     */
    if (addressForm) {
        addressForm.addEventListener("submit", async function(e) {
            e.preventDefault();

            const authResponse = await fetch("/api/get_current_user/", { method: "GET", credentials: "include" });
            const authData = await authResponse.json();

            if (!authData.is_authenticated) {
                window.showToast("Anda harus login untuk menyimpan alamat.", "error");
                window.showLoginModal();
                return;
            }

            const addressId = addressIdInput.value;
            const method = addressId ? "PUT" : "POST"; // Use PUT for update, POST for new
            const url = addressId ? `/api/addresses/${addressId}/` : "/api/addresses/";

            const addressData = {
                receiver_name: addressReceiverNameInput.value.trim(),
                receiver_phone: addressReceiverPhoneInput.value.trim(),
                full_address: addressFullAddressInput.value.trim(),
                rt_rw: addressRtRwInput.value.trim(),
                province: addressProvinceInput.value.trim(),
                kabupaten: addressKabupatenInput.value.trim(),
                city: addressCityInput.value.trim(),
                postal_code: addressPostalCodeInput.value.trim(),
                location_details: addressLocationDetailsInput.value.trim(),
                nama_alamat: addressNamaAlamatInput.value.trim(),
            };

            try {
                const response = await fetch(url, {
                    method: method,
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": window.getCsrfToken(),
                    },
                    credentials: "include",
                    body: JSON.stringify(addressData),
                });
                const data = await response.json();

                if (response.ok && data.success) {
                    window.showToast(data.message || "Alamat berhasil disimpan!", "success");
                    addressModal.style.display = "none";
                    loadUserAddresses(); // Reload addresses to show changes
                } else {
                    if (addressFormMessage) addressFormMessage.textContent = data.message || "Gagal menyimpan alamat.";
                    window.showToast("Gagal menyimpan alamat.", "error");
                }
            } catch (error) {
                console.error("Error saving address:", error);
                if (addressFormMessage) addressFormMessage.textContent = "Terjadi kesalahan saat menyimpan alamat.";
                window.showToast("Terjadi kesalahan saat menyimpan alamat.", "error");
            }
        });
    }

    /**
     * Fetches an address by ID and populates the modal for editing.
     * @param {string} addressId - The ID of the address to edit.
     */
    async function editAddress(addressId) {
        if (!addressId) return;

        try {
            const response = await fetch(`/api/addresses/${addressId}/`, { // Fetch single address
                method: "GET",
                headers: {
                    "X-CSRFToken": window.getCsrfToken(),
                },
                credentials: "include",
            });
            const data = await response.json();

            if (response.ok && data.success && data.address) {
                addressModalTitle.textContent = "Edit Alamat";
                addressIdInput.value = data.address.id;
                addressReceiverNameInput.value = data.address.receiver_name || '';
                addressReceiverPhoneInput.value = data.address.receiver_phone || '';
                addressFullAddressInput.value = data.address.full_address || '';
                addressRtRwInput.value = data.address.rt_rw || '';
                addressProvinceInput.value = data.address.province || '';
                addressKabupatenInput.value = data.address.kabupaten || '';
                addressCityInput.value = data.address.city || '';
                addressPostalCodeInput.value = data.address.postal_code || '';
                addressLocationDetailsInput.value = data.address.location_details || '';
                addressNamaAlamatInput.value = data.address.nama_alamat || '';
                btnSaveAddress.textContent = "Update Alamat";
                addressFormMessage.textContent = '';
                addressModal.style.display = "flex";
            } else {
                window.showToast(data.message || "Gagal memuat detail alamat untuk diedit.", "error");
            }
        } catch (error) {
            console.error("Error fetching address for edit:", error);
            window.showToast("Terjadi kesalahan saat memuat detail alamat.", "error");
        }
    }

    /**
     * Deletes an address by ID.
     * @param {string} addressId - The ID of the address to delete.
     */
    async function deleteAddress(addressId) {
        if (!addressId || !confirm("Apakah Anda yakin ingin menghapus alamat ini?")) return;

        try {
            const response = await fetch(`/api/addresses/${addressId}/`, {
                method: "DELETE",
                headers: {
                    "X-CSRFToken": window.getCsrfToken(),
                },
                credentials: "include",
            });

            // DELETE requests often return 204 No Content for success, or JSON for errors
            if (response.ok || response.status === 204) {
                window.showToast("Alamat berhasil dihapus!", "success");
                loadUserAddresses(); // Reload addresses to reflect deletion
            } else {
                const data = await response.json();
                window.showToast(data.message || "Gagal menghapus alamat.", "error");
            }
        } catch (error) {
            console.error("Error deleting address:", error);
            window.showToast("Terjadi kesalahan saat menghapus alamat.", "error");
        }
    }


    // Call loadUserProfile when the DOM is ready
    window.loadUserProfile();
});