function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// اینجا متغیرها رو سراسری تعریف کن
let offerId = null;
let time = null;

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);

    const amount = urlParams.get("amount");
    offerId = urlParams.get("offerId"); // مقداردهی به متغیر سراسری
    time = urlParams.get("time");       // مقداردهی به متغیر سراسری

    if (amount) {
        document.getElementById("payment-amount").textContent =
            `${Number(amount).toLocaleString()} تومان`;
    }

    console.log("Offer ID:", offerId);
    console.log("Appointment Time:", time);
});

document.getElementById("pay-button").addEventListener("click", async (e) => {
    e.preventDefault(); // جلوگیری از رفرش فرم

    alert("پرداخت با موفقیت انجام شد ✅");

    const token = getCookie('token'); 
    try {
        const res = await fetch("/api/user/accept-offer", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                offerId,
                time
            })
        });

        const data = await res.json();
        
        if (res.ok) {
            alert("قرار ملاقات ثبت شد ✅");
            window.location.href = `/`;
        } else {
            alert(`خطا: ${data.message}`);
        }
    } catch (err) {
        console.error(err);
        alert("مشکلی پیش آمد!");
    }
});
