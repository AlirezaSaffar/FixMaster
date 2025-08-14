function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

const role = getCookie('role');
if (role !=="customer") {
    if(!role)
    window.location.href = "/login";

    window.location.href = "/";

}

const token = getCookie('token');

document.getElementById('logout-button')?.addEventListener('click', () => {
    document.cookie = 'token=; Max-Age=0; path=/'; 
    document.cookie = 'role=; Max-Age=0; path=/'; 
    window.location.href = '/login';
});


async function fetchMyRequests() {
    try {
        const res = await fetch("/api/user/myrequests", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await res.json();
        const container = document.getElementById("requests-container");
        container.innerHTML = "";

        if (!data.success || !data.requests || data.requests.length === 0) {
            container.innerHTML = `<p class="loading">No requests found.</p>`;
            return;
        }

        data.requests.forEach(req => {
            const link = document.createElement("a");
    link.href = `/request-detail?id=${req._id}`;
    link.className = "request-link";

    link.innerHTML = `
        <div class="request-card">
            <div class="request-title">${req.service || "No Title"}</div>
            <div class="request-meta">${req.location || "No Location"}</div>
            <p>${req.description || ""}</p>
            <div class="request-images">
                ${req.images && req.images.length > 0 
                    ? req.images.map(img => `<img src="${img}" alt="Request Image">`).join("")
                    : `<span style="color:#999;">No images</span>`}
            </div>
        </div>
    `;

    container.appendChild(link);
        });

    } catch (err) {
        console.error("Error fetching requests:", err);
        document.getElementById("requests-container").innerHTML = `<p class="loading">Error loading data.</p>`;
    }
}

fetchMyRequests();
