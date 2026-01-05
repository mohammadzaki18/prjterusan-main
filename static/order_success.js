document.addEventListener("DOMContentLoaded", () => {
  loadOrderSuccess();
});

function loadOrderSuccess() {
  fetch("/api/order/latest/", {
    headers: {
      "X-Requested-With": "XMLHttpRequest"
    }
  })
    .then(res => {
      if (!res.ok) {
        throw new Error("Order tidak ditemukan");
      }
      return res.json();
    })
    .then(data => {
      renderOrderSuccess(data);
    })
    .catch(err => {
      console.error("Gagal memuat data order:", err);
      showFallback();
    });
}

function renderOrderSuccess(data) {
  setText("orderNumber", data.order_number || "#TRSMK-XXXXX");
  setText("paymentMethod", data.payment_method || "-");
  setText(
    "shippingAddress",
    `${data.address}, ${data.city}, ${data.postal_code}`
  );
  setText("deliveryEstimate", data.delivery_estimate || "2-4 hari kerja");

  if (data.total) {
    setText("finalTotalPrice", `Rp ${formatRupiah(data.total)}`);
  }
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.innerText = value;
}

function formatRupiah(number) {
  return new Intl.NumberFormat("id-ID").format(number);
}

function showFallback() {
  setText("orderNumber", "#TRSMK-XXXXX");
  setText("paymentMethod", "-");
  setText("shippingAddress", "-");
  setText("finalTotalPrice", "Rp 0");
}
