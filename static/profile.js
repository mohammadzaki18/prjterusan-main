// profile.js - Logic for the user profile page.
// This script relies on global functions exposed by dashboard.js

document.addEventListener("DOMContentLoaded", function() {
    const profileForm = document.getElementById("profileForm");
    const profileUsernameInput = document.getElementById("profileUsername");
    const profileNameInput = document.getElementById("profileName");
    const profileEmailInput = document.getElementById("profileEmail");
    const profilePhoneInput = document.getElementById("profilePhone");
    const profileAddressInput = document.getElementById("profileAddress"); // This element already exists and remains.
    const profileMessage = document.getElementById("profileMessage");

    // New address fields to be added
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
            window.showLoginModal();
            return;
        }

        profileForm.style.display = 'block'; // Show form if logged in
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
                profileAddressInput.value = data.address || ''; // Existing address field

                // Populate new address fields
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
                address: profileAddressInput.value.trim(), // Existing address field
                // New address fields to be sent to backend
                receiver_name: profileReceiverNameInput.value.trim(),
                receiver_phone: profileReceiverPhoneInput.value.trim(),
                full_address: profileFullAddressInput.value.trim(),
                rt_rw: profileRtRwInput.value.trim(),
                province: profileProvinceInput.value.trim(),
                kabupaten: profileKabupatenInput.value.trim(),
                city: profileCityInput.value.trim(),
                postal_code: profilePostalCodeInput.value.trim(),
                location_details: profileLocationDetailsInput.value.trim(),
                nama_alamat: profileNamaAlamatInput.value.trim()
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
                    // No need to update localStorage for user data, as we fetch from DB
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

    // Call loadUserProfile when the DOM is ready
    window.loadUserProfile();
});